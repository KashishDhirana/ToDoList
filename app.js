class TodoList {
    constructor() {
        this.listContainer = document.querySelector('.list-container ul')
        this.inputText = document.querySelector('#inputText')
        this.addBtn = document.querySelector('#textSubmit')
        this.data = []
        this.nextId = 0

        this.initialize()
    }

    initialize() {
        this.validateElements()
        this.loadData()
        this.setupEventListeners()
        this.renderList()
    }

    validateElements() {
        if (!(this.listContainer instanceof HTMLUListElement) ||
            !(this.inputText instanceof HTMLInputElement) ||
            !(this.addBtn instanceof HTMLButtonElement)) {
            throw new Error('Element not found or incorrect type')
        }
    }

    loadData() {
        try {
            const savedData = localStorage.getItem("toDoList")
            this.data = savedData ? JSON.parse(savedData) : []
            this.nextId = this.data.length > 0
                ? Math.max(...this.data.map(item => item.id)) + 1
                : 0
        } catch (error) {
            console.error('Error loading data:', error)
            this.data = []
            this.nextId = 0
        }
    }

    setupEventListeners() {
        if (!(this.listContainer instanceof HTMLUListElement) ||
            !(this.inputText instanceof HTMLInputElement) ||
            !(this.addBtn instanceof HTMLButtonElement)) {
            throw new Error('Element not found or incorrect type')
        }

        this.inputText.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addData()
        })

        this.addBtn.addEventListener('click', () => this.addData())
        this.listContainer.addEventListener('click', (e) => this.handleListClick(e))
    }

    addData() {
        if (!(this.inputText instanceof HTMLInputElement)) return
        const text = this.inputText.value.trim()
        if (!text) return

        this.data.push({
            id: this.nextId++,
            text: this.sanitizeInput(text)
        })

        this.inputText.value = ''
        this.saveData()
        this.renderList()
    }

    handleListClick(e) {
        const target = e.target
        if (!target) return

        const button = target.closest('[data-action]')
        const li = target.closest('li')
        if (!button || !li) return

        const itemId = parseInt(li.dataset.id)
        const action = button.dataset.action
        const item = this.data.find(item => item.id === itemId)

        if (!item) return

        switch (action) {
            case 'delete':
                this.deleteItem(itemId)
                break
            case 'copy':
                this.copyItem(item, li)
                break
            case 'edit':
                this.editItem(item, li)
                break
        }
    }

    deleteItem(id) {
        this.data = this.data.filter(item => item.id !== id)
        this.saveData()
        this.renderList()
    }

    async copyItem(item, li) {
        try {
            await navigator.clipboard.writeText(item.text)
            const span = li.querySelector('span')
            if (!span) return

            const originalText = span.textContent
            span.textContent = 'Copied!'
            setTimeout(() => {
                span.textContent = originalText
            }, 500)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    editItem(item, li) {
        const span = li.querySelector('span')
        if (!span) return

        span.contentEditable = true
        span.focus()

        const finishEdit = () => {
            span.contentEditable = false
            const newText = this.sanitizeInput(span.textContent.trim())

            if (newText && newText !== item.text) {
                item.text = newText
                this.saveData()
                this.renderList()
            } else {
                span.textContent = item.text
            }
        }

        const handleKey = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault()
                finishEdit()
            } else if (e.key === 'Escape') {
                span.textContent = item.text
                span.contentEditable = false
            }
        }

        span.addEventListener('keydown', handleKey)
        span.addEventListener('blur', finishEdit)
    }

    renderList() {
        if (!(this.listContainer instanceof HTMLUListElement)) return

        this.listContainer.innerHTML = ''
        this.data.forEach(item => {
            if (!(this.listContainer instanceof HTMLUListElement)) return

            const li = this.createListItem(item)
            this.listContainer.appendChild(li)
        })
    }

    createListItem(item) {
        const li = document.createElement('li')
        li.dataset.id = item.id

        const span = document.createElement('span')
        span.textContent = item.text

        const div = document.createElement('div')
        div.append(
            this.createButton('edit', 'fa-pen-to-square'),
            this.createButton('copy', 'fa-copy'),
            this.createButton('delete', 'fa-trash-can')
        )

        li.append(span, div)
        return li
    }

    createButton(action, iconClass) {
        const button = document.createElement('button')
        button.type = 'submit'
        button.dataset.action = action

        const icon = document.createElement('i')
        icon.className = `fa-regular ${iconClass}`
        button.appendChild(icon)

        return button
    }

    sanitizeInput(text) {
        const div = document.createElement('div')
        div.textContent = text
        return div.innerHTML
    }

    saveData() {
        try {
            localStorage.setItem("toDoList", JSON.stringify(this.data))
        } catch (error) {
            console.error('Error saving data:', error)
        }
    }
}

// Initialize the TodoList application
new TodoList()