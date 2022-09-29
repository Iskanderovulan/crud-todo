const API = 'https://jwt-ulios-test.herokuapp.com'
const createTodoRoute = '/create-todo'
const getAllTodoRoute = '/get-all-todo'
const deleteTodoRoute = '/delete-todo/'
const doneTodoRoute = '/done/'
const editTodoRoute = '/update-todo/'



const exitFunc = () => {
    const exit = document.querySelector('.logOut')
    exit.addEventListener('click', () => {
        localStorage.removeItem('token')
        window.location.href = '../pages/auth.html'
    })
}
exitFunc()


const redirect = () => {
    const token = localStorage.getItem('token')
    if (!token) {
        window.location.href = '../pages/auth.html'
    }
}
redirect()


const form = document.querySelector('#todo-form')
const title = document.querySelector('#title')
const description = document.querySelector('#descr')
const output = document.querySelector('#output')


const createTodo = async () => {
    const data = {
        title: title.value,
        description: description.value
    }
    const req = await fetch(API + createTodoRoute,
        {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            method: 'POST',
            body: JSON.stringify(data)
        })
    const res = await req.json()
    getAllTodos()
    title.value = ''
    description.value = ''
    console.log(res)
}




const getAllTodos = async () => {
    const request = await fetch(API + getAllTodoRoute, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token')
        },
    })
    const response = await request.json()
    console.log(response)
    renderTodos(response)
}

if(localStorage.getItem('token')){
    getAllTodos()
}






let portalId = ''

const renderTodos = (data) => {
    output.innerHTML = ''
    data.reverse().forEach((el, index) => {
        const box = document.createElement('div')
        const title = document.createElement('p')
        const description = document.createElement('p')
        const numberOfTodo = document.createElement('p')

        box.className='box'


        numberOfTodo.textContent = index + 1
        title.textContent = `title:${el.title}`
        description.textContent = `description:${el.description}`

        box.style.background=el.status?'green':'red'

        title.style.textDecoration=el.status?'line-through':'none'
        description.style.textDecoration=el.status?'line-through':'none'

        const deleteBtn = document.createElement('button')
        deleteBtn.textContent = 'Delete'
        deleteBtn.addEventListener('click', () => {
            deleteTodo(el._id)
        })

        const doneBtn = document.createElement('button')
        doneBtn.textContent = 'done'
        doneBtn.addEventListener('click', () => {
            doneTodo(el._id)
        })

        const editBtn = document.createElement('button')
        editBtn.textContent = 'edit'
        editBtn.addEventListener('click', () => {
          
            editTodoModal(el._id)
            portalId=el._id
            console.log(portalId)
        })

        box.append(numberOfTodo, title, description, deleteBtn, doneBtn, editBtn)
        output.append(box)
    })
}





const deleteTodo = async (id) => {
    try {
        const request = await fetch(API + deleteTodoRoute + id, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            method: 'DELETE',
        })
        const response = await request.json()

        alert(response.message)
        getAllTodos()
    } catch (e) {
        alert(e)
    }
}


const doneTodo = async(id) =>{
    const req = await fetch(API+doneTodoRoute+id,{
        headers:{
            'Content-Type':"application/json",
            'x-access-token':localStorage.getItem('token')
        },
        method:'POST'
    })
    const res = await req.json()
    alert(res.message)
    getAllTodos()
}

// ===modal===
const modalCloseButton = document.querySelector('.modalCloseButton')
const modal = document.querySelector('.modal')
const backdrop = document.querySelector('.backdrop')

const removeClasses = () => {
    modal.classList.remove('modalActive')
    backdrop.classList.remove('backdropActive')
}

const editTodoModal = () => {
    modal.classList.add('modalActive')
    backdrop.classList.add('backdropActive')
    backdrop.addEventListener('click', removeClasses)
    modalCloseButton.addEventListener('click',removeClasses)
    modal.addEventListener('click', (e) => {
        e.stopPropagation()
    })
}

// ===modal===

const btn = document.querySelector('#modalBtn')

const editFunc = async() =>{
    const title = document.querySelector('#modalTitle')
    const descr = document.querySelector('#modalDescr')
   
    const data = {
        title:title.value,
        description:descr.value
    }

    const request = await fetch(API+editTodoRoute+portalId,{
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token')
        },
        method:'PATCH',
        body:JSON.stringify(data)
    })
    const res = await request.json()
    alert(res.message)
    getAllTodos()
    if(res.message){
        removeClasses()
    }
  
}


btn.addEventListener('click',()=>{
    editFunc()
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    if(description.value && title.value && title.value.trim() && description.value.trim()){
        createTodo()
    }else{
        alert('Fields are empty')
    }
})




// 1)Создать кнопку -> done
// 2)Привязать событие на кнопку, вызвать func -> doneTodo
// и передать id
// 3)DoneTodo встречает id в самом url и является post запросом
// 4)поменять фон и отрисовать 'todo is completed' если статус true
// 5)если статуc false -> кнопка delete не должна работать
// и оповестить что тудушка не завершена



// 1)Создать кнопку -> edit
// 2)при нажатии на edit откроется модалка
// 3)в модалке будет 2 инпута и баттон




// 1)после нажатия на editTodo(запрос) модалка должна закрыться
// 2)если status-true у тудушки,edit не должен работать
// alert(todo is done)
// 3)если инпуты пустые, createTodo не должен сработать 
// в alert выведите - инпуты пустые 
// 4)инпуты не должны принимать пробелы (trim())
// 5)инпуты в edit написать теже валидации, 
// что стоят на основные инпуты
// 6)если status-true у тудушки, зачеркните текст
// 7)Вместо buttons(edit,delete,done) поставьте иконки 
// 8)Все асинхронные запросы обернуть в try catch
// 9)чтобы тудушка добавлялась в начало (reverse())
// 10)const getNameRoute = '/get-user-name'
// отправить запрос и отрисовать имя юзера
// 11)Сверстать footer, в footer будут 2 кнопки:reg и auth 
// reg - перенаправляет на страницу регистрации 
// auth - перенаправляет на страницу авторизации 
// 12)если status - true,btn done - disabled
// 13)при первом нажатии на done, вас спросят(confirm)
// если true - status- true
// если false - status - false
// 14)2 окошка 
// в первом окошке - кол-во завершенных тудушек
// во втором окошке - кол-во незавершенных тудушек

// // Igor:6
// // Akas:7
// // Alina:1 
// // Adina:3
// // Aiperi:2

// button atr - disabled 

// disabled{
//     opacity:0.5,
//     pointerEvents:none;
// }