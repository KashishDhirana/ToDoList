// const listContainer = document.querySelector('.list-container ul')
// const inputText = document.querySelector('#inputText')
// const addBtn = document.querySelector('#textSubmit')

// // Type guard checks
// if (!(listContainer instanceof HTMLUListElement) ||
//     !(inputText instanceof HTMLInputElement) ||
//     !(addBtn instanceof HTMLButtonElement)) {
//     throw new Error('Element not found or incorrect type')
// }

// let data = JSON.parse(localStorage.getItem("toDoList") || '{}')
// let li_id = Object.keys(data).length ? parseInt(Object.keys(data).pop() || '0') : 0

// const renderList = () => {
//     listContainer.innerHTML = ''
//     Object.keys(data).forEach((key) => {
//         const li = document.createElement('li')
//         li.setAttribute('data-id', key)
//         li.innerHTML = `
//             <span>${data[key]}</span>
//             <div>
//                 <button type="submit" title="Edit">
//                     <i class="fa-regular fa-pen-to-square"></i>
//                 </button>
//                 <button type="submit" title="Copy">
//                     <i class="fa-regular fa-copy"></i>
//                 </button>
//                 <button type="submit" title="Delete Task">
//                     <i class="fa-regular fa-trash-can"></i>
//                 </button>
//             </div>
//         `
//         listContainer.appendChild(li)
//     })
//     console.log('Data:', data)
// }

// renderList()

// const addData = (e) => {
//     const text = inputText.value.trim()
//     if (!text) return
//     inputText.value = ''
//     const li = document.createElement('li')
//     li.setAttribute('data-id', (++li_id).toString())
//     li.innerHTML = `
//         <span>${text}</span>
//         <div>
//             <button type="submit" title="Edit">
//                 <i class="fa-regular fa-pen-to-square"></i>
//             </button>
//             <button type="submit" title="Copy">
//                 <i class="fa-regular fa-copy"></i>
//             </button>
//             <button type="submit" title="Delete Task">
//                 <i class="fa-regular fa-trash-can"></i>
//             </button>
//         </div>
//     `
//     listContainer.appendChild(li)
//     data[li_id] = text
//     localStorage.setItem("toDoList", JSON.stringify(data))
// }

// inputText.addEventListener('keypress', (e) => {
//     if (!(e instanceof KeyboardEvent)) return
//     if (e.key === 'Enter') {
//         addData()
//     }
// })

// addBtn.addEventListener('click', addData)

// listContainer.addEventListener('click', (e) => {
//     const target = e.target
//     if (!target) return
//     if (!(target instanceof HTMLElement)) return
//     if (target.tagName.toLowerCase() === 'i') {
//         console.log('Icon clicked:', target, e)
//     }
//     const li = target.closest('li')
//     if (!li) return
//     const value = li.getAttribute('data-id')
//     if (!value) return
//     // console.log('Value:', value)
//     if (target.classList.contains('fa-trash-can')) {
//         delete data[value]
//         renderList()
//     }
//     if (target.classList.contains('fa-copy')) {
//         const text = data[value]
//         navigator.clipboard.writeText(text)
//         data[value] = `Copied!`
//         renderList()
//         setTimeout(() => {
//             data[value] = text
//             renderList()
//         }, 500)
//         data[value] = text
//     }
//     if (target.classList.contains('fa-pen-to-square')) {

//         // By Prompt
//         // const text = data[value]
//         // const newText = prompt('Edit task:', text)
//         // if (newText && newText.trim() !== '') {
//         //     data[value] = newText
//         //     renderList()
//         // }
        
//         // By Content Editable
//         const span = li.children[0]
//         if (!(span instanceof HTMLSpanElement)) return
//         span.setAttribute('contenteditable', "true")
//         span.focus()
//         span.onkeyup = (e) => {
//             if (e.key === 'Enter') {
//                 data[value] = span.innerText.trim()
//                 localStorage.setItem("toDoList", JSON.stringify(data))
//                 span.removeAttribute('contenteditable')
//                 renderList()
//             }
//         }
//     }
//     localStorage.setItem("toDoList", JSON.stringify(data))
// })


class TodoList {
    constructor() {
        this.listContainer = document.querySelector('.list-container ul');
        this.inputText = document.querySelector('#inputText');
        this.addBtn = document.querySelector('#textSubmit');
        this.data = [];
        this.nextId = 0;

        this.initialize();
    }

    initialize() {
        this.validateElements();
        this.loadData();
        this.setupEventListeners();
        this.renderList();
    }

    validateElements() {
        if (!(this.listContainer instanceof HTMLUListElement) ||
            !(this.inputText instanceof HTMLInputElement) ||
            !(this.addBtn instanceof HTMLButtonElement)) {
            throw new Error('Element not found or incorrect type');
        }
    }

    loadData() {
        try {
            const savedData = localStorage.getItem("toDoList");
            this.data = savedData ? JSON.parse(savedData) : [];
            this.nextId = this.data.length > 0 
                ? Math.max(...this.data.map(item => item.id)) + 1 
                : 0;
        } catch (error) {
            console.error('Error loading data:', error);
            this.data = [];
            this.nextId = 0;
        }
    }

    setupEventListeners() {
        this.inputText.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addData();
        });

        this.addBtn.addEventListener('click', () => this.addData());
        this.listContainer.addEventListener('click', (e) => this.handleListClick(e));
    }

    addData() {
        const text = this.inputText.value.trim();
        if (!text) return;

        this.data.push({
            id: this.nextId++,
            text: this.sanitizeInput(text)
        });

        this.inputText.value = '';
        this.saveData();
        this.renderList();
    }

    handleListClick(e) {
        const target = e.target;
        if (!target) return;

        const button = target.closest('[data-action]');
        const li = target.closest('li');
        if (!button || !li) return;

        const itemId = parseInt(li.dataset.id);
        const action = button.dataset.action;
        const item = this.data.find(item => item.id === itemId);

        if (!item) return;

        switch(action) {
            case 'delete':
                this.deleteItem(itemId);
                break;
            case 'copy':
                this.copyItem(item, li);
                break;
            case 'edit':
                this.editItem(item, li);
                break;
        }
    }

    deleteItem(id) {
        this.data = this.data.filter(item => item.id !== id);
        this.saveData();
        this.renderList();
    }

    async copyItem(item, li) {
        try {
            await navigator.clipboard.writeText(item.text);
            const span = li.querySelector('span');
            if (!span) return;

            const originalText = span.textContent;
            span.textContent = 'Copied!';
            setTimeout(() => {
                span.textContent = originalText;
            }, 500);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }

    editItem(item, li) {
        const span = li.querySelector('span');
        if (!span) return;

        span.contentEditable = true;
        span.focus();

        const finishEdit = () => {
            span.contentEditable = false;
            const newText = this.sanitizeInput(span.textContent.trim());
            
            if (newText && newText !== item.text) {
                item.text = newText;
                this.saveData();
                this.renderList();
            } else {
                span.textContent = item.text;
            }
        };

        const handleKey = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                finishEdit();
            } else if (e.key === 'Escape') {
                span.textContent = item.text;
                span.contentEditable = false;
            }
        };

        span.addEventListener('keydown', handleKey);
        span.addEventListener('blur', finishEdit);
    }

    renderList() {
        this.listContainer.innerHTML = '';
        this.data.forEach(item => {
            const li = this.createListItem(item);
            this.listContainer.appendChild(li);
        });
    }

    createListItem(item) {
        const li = document.createElement('li');
        li.dataset.id = item.id;

        const span = document.createElement('span');
        span.textContent = item.text;

        const div = document.createElement('div');
        div.append(
            this.createButton('edit', 'fa-pen-to-square'),
            this.createButton('copy', 'fa-copy'),
            this.createButton('delete', 'fa-trash-can')
        );

        li.append(span, div);
        return li;
    }

    createButton(action, iconClass) {
        const button = document.createElement('button');
        button.type = 'submit';
        button.dataset.action = action;
        
        const icon = document.createElement('i');
        icon.className = `fa-regular ${iconClass}`;
        button.appendChild(icon);

        return button;
    }

    sanitizeInput(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveData() {
        try {
            localStorage.setItem("toDoList", JSON.stringify(this.data));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }
}

// Initialize the TodoList application
new TodoList();