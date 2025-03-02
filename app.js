const listContainer = document.querySelector('.list-container ul')
const operationContainer = document.querySelector('.list-container ul')
const inputText = document.querySelector('#inputText')
const addBtn = document.querySelector('#textSubmit')

// Type guard checks
if (!(listContainer instanceof HTMLUListElement) ||
    !(operationContainer instanceof HTMLUListElement) ||
    !(inputText instanceof HTMLInputElement) ||
    !(addBtn instanceof HTMLButtonElement)) {
    throw new Error('Element not found or incorrect type')
}

let data = JSON.parse(localStorage.getItem("toDoList") || '{}')
let li_id = Object.keys(data).length ? parseInt(Object.keys(data).pop() || '0') : 0

const renderList = () => {
    listContainer.innerHTML = ''
    Object.keys(data).forEach((key) => {
        const li = document.createElement('li')
        li.setAttribute('data-id', key)
        li.innerHTML = `
            ${data[key]}
            <div>
                <button type="submit" title="delete task" class="done-btn">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
                <button type="submit" title="update task" class="done-btn">
                    <i class="fa-regular fa-pen-to-square"></i>
                </button>
            </div>
        `
        listContainer.appendChild(li)
    })
    console.log('Data:', data)
}

renderList()

const addData = (e) => {
    const text = inputText.value.trim()
    if (!text) return
    inputText.value = ''
    const li = document.createElement('li')
    li.setAttribute('data-id', (++li_id).toString())
    li.innerHTML = `
        ${text}
        <div>
            <button type="submit" title="delete task" class="done-btn">
                <i class="fa-regular fa-trash-can"></i>
            </button>
            <button type="submit" title="update task" class="done-btn">
                <i class="fa-regular fa-pen-to-square"></i>
            </button>
        </div>
    `
    listContainer.appendChild(li)
    data[li_id] = text
    localStorage.setItem("toDoList", JSON.stringify(data))
}

inputText.addEventListener('keypress', (e) => {
    if (!(e instanceof KeyboardEvent)) return
    if (e.key === 'Enter') {
        addData()
    }
})

addBtn.addEventListener('click', addData)

operationContainer.addEventListener('click', (e) => {
    const target = e.target
    if (!target) return
    if (!(target instanceof HTMLElement)) return
    if (target.tagName.toLowerCase() === 'i') {
        console.log('Icon clicked:', target, e)
    }
    const li = target.closest('li')
    if (!li) return
    const value = li.getAttribute('data-id')
    if (!value) return
    console.log('Value:', value)
    if (target.classList.contains('fa-trash-can')) {
        delete data[value]
        renderList()
    }
    localStorage.setItem("toDoList", JSON.stringify(data))
})
