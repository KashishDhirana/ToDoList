const listContainer = document.querySelector('.list-container ul')
const operationContainer = document.querySelector('.list-container ul')
const inputText = document.querySelector('#inputText')
const addBtn = document.querySelector('#textSubmit')

if (!listContainer || !inputText || !addBtn || !operationContainer) {
    throw new Error('Element not found')
}

let data = JSON.parse(localStorage.getItem("toDoList") || '[]')
let size = Object.keys(data).length
let li_id = parseInt(Object.keys(data)[size - 1]) || 0
console.log(Object.keys(data)[size - 1])
console.log(size, +li_id)

const renderList = () => {
    if (size) {
        Object.keys(data).map((key) => {
            listContainer.innerHTML +=
                `
                    <li data-id="${key}">${data[key]}
                        <div>
                            <button type="submit" title="delete task" class="done-btn">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                            <button type="submit" title="update task" class="done-btn">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                        </div>
                    </li>
                    `
        })
    }
    console.log('Data:', data)
}

renderList()

addBtn?.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        console.log("Hello");
    }
})
addBtn?.addEventListener('click', () => {
    const text = inputText.value.trim()
    if (!text) return
    console.log(text)
    inputText.value = ''
    listContainer.innerHTML += `
                    <li data-id="${++li_id}">${text}
                        <div>
                            <button type="submit" title="delete task" class="done-btn">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                            <button type="submit" title="update task" class="done-btn">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                        </div>
                    </li>`
    data = {
        [li_id]: text, // To change the key to a string value we wrap it in square brackets to dynamically assign the key
        ...data
    }
    localStorage.setItem("toDoList", JSON.stringify(data))
})

operationContainer?.addEventListener('click', (e) => {
    if (!e.target) return
    if (e.target.tagName.toLowerCase() === 'i') {
        console.log('Icon clicked:', e.target, e)
    }
    const value = e.target.parentNode.parentNode.parentNode.getAttribute('data-id')
    console.log('Value:', value)
    if (e.target.className === 'fa-regular fa-trash-can') {
        delete data[value]
        listContainer.innerHTML = ''
        renderList()
    }
    localStorage.setItem("toDoList", JSON.stringify(data))
})

