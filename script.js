const form = document.querySelector('.todo-form')
const alert = document.querySelector('.alert')
const todo = document.getElementById('todo')
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.todo-container')
const list = document.querySelector('.todo-list')
const clearBtn = document.querySelector('.clear-btn')

let editElement
let editFlag = false
let editID = ''

form.addEventListener('submit', addItem)

clearBtn.addEventListener('click', clearItems)

window.addEventListener('DOMContentLoaded', setupItems)

function addItem(e) {
    e.preventDefault()

    const value = todo.value
    const id = new Date().getTime().toString()

    if(value !== '' && !editFlag) {
        const element = document.createElement('article')
        let attr = document.createAttribute('data-id')
        attr.value = id

        element.setAttributeNode(attr)
        element.classList.add('todo-item')
        element.innerHTML = 
        `<p class="title">${value}</p>
        <div class="btn-container">
        <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
        </button>
        <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
        </button>
        </div>`

        const deleteBtn = element.querySelector('.delete-btn')
        deleteBtn.addEventListener('click', deleteItem)

        const editBtn = element.querySelector('.edit-btn')
        editBtn.addEventListener('click', editItem)

        list.appendChild(element)

        displayAlert('Adicionado com sucesso !')

        container.classList.add('show-container')

        addToLocalStorage(id, value)

        setBackToDefault()
    } else if(value !== '' && editFlag) {
        editElement.innerHTML = value
        displayAlert('Correção feita !')

        editLocalStorage(editID, value)
        setBackToDefault()
    } else {
        displayAlert('Digite de novo !')
    }
}

function displayAlert(text, action) {
    alert.textContent = text
    alert.classList.add(`alert-${action}`)

    setTimeout(function () {
        alert.textContent = ''
        alert.classList.remove(`alert-${action}`)
    }, 2000)
}

function clearItems() {
    const items = document.querySelectorAll('todo-item')
    if(items.length > 0) {
        items.forEach(function(item) {
            list.removeChild(item)
        })
    }
    container.classList.remove('show-container')
    displayAlert('Lista vazia !')
    setBackToDefault()
    localStorage.removeItem('list')
}

function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement
    const id = element.dataset.id

    list.removeChild(element)

    if(list.children.length === 0) {
        container.classList.remove('show-container')
    }
    displayAlert('Item removido !')

    setBackToDefault()
    removeFromLocalStorage(id)
}

function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement

    editElement = e.currentTarget.parentElement.previousElementSibling

    todo.value = editElement.innerHTML
    editFlag = true
    editID = element.dataset.id

    submitBtn.textContent = 'Editar !'
}

function setBackToDefault() {
    todo.value = ''
    editFlag = false
    editID = ''
    submitBtn.textContent = 'Enviar !'
}

function addToLocalStorage(id, value) {
    const todo = { id, value }
    let items = getLocalStorage()
    items.push(todo)
    localStorage.setItem('list', JSON.stringify(items))
}

function getLocalStorage() {
    return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : []
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage()

    items = items.filter(function(item) {
        if(item.id !== id) {
            return item
        }
    })
    localStorage.setItem('list', JSON.stringify(items))
}

function editLocalStorage(id, value) {
    let items = getLocalStorage()

    items = items.map(function(item) {
        if(item.id === id) {
            item.value = value
        }
        return item
    })
    localStorage.setItem('list', JSON.stringify(items))
}

function setupItems() {
    let items = getLocalStorage()

    if(items.length > 0) {
        items.forEach(function(item) {
            createListItem(item.id, item.value)
        })
        container.classList.add('show-container')
    }
}

function createListItem(id, value) {
    const element = document.createElement('article')
    let attr = document.createAttribute('data-id')
    attr.value = id

    element.setAttributeNode(attr)
    element.classList.add('todo-item')
    element.innerHTML = 
    `<p class="title">${value}</p>
     <div class="btn-container">
     <button type="button" class="edit-btn">
     <i class="fas fa-edit"></i>
     </button>
     <button type="button" class="delete-btn">
     <i class="fas fa-trash"></i>
     </button>
     </div>`

    const deleteBtn = element.querySelector('delete-btn')
    deleteBtn.addEventListener('click', deleteItem)
    const editBtn = element.querySelector('.edit-btn')
    editBtn.addEventListener('click', editItem)

    list.appendChild(element)
}