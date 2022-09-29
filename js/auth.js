const API = 'https://jwt-ulios-test.herokuapp.com'
let authRoute = '/auth/sign-in'

const form = document.querySelector('#auth-form')
const email = document.querySelector('#email')
const pass = document.querySelector('#pass')

const sendToReg = () =>{
    const signUp = document.querySelector('#sign-up')
    signUp.addEventListener('click',(e)=>{
        e.preventDefault()
        window.location.href='../reg.html'
    })
}
sendToReg()

const auth = async() =>{
    const data = {
        email:email.value,
        pass:pass.value
    }
    try{
        const request = await fetch(API+authRoute,{
            headers:{
                "Content-Type":"application/json"
            },
            method:'POST',
            body:JSON.stringify(data)
        })

        const response = await request.json()
        console.log(response)

        if(response.token){
            localStorage.setItem('token',response.token)
            window.location.href='../pages/todo.html'
        }

        if(response.message){
            renderErrors(response)
        }

    }catch(e){
        alert('Вы не регистрировались или ошибка сервера')
    }
}

const renderErrors = (data) =>{
    const errorsOutput = document.querySelector('.errors')
    errorsOutput.innerHTML=''
    const messageError = document.createElement('p')
    messageError.textContent=data.message
    errorsOutput.append(messageError)
    data.errors.errors.forEach(el=>{
        const elErrors = document.createElement('p')
        elErrors.textContent=`${el.param==='pass'?'Пароль':el.param==='email'?'Почта':el.param}: ${el.msg}`
        errorsOutput.append(elErrors)
    })
}

const redirect = () =>{
    const token = localStorage.getItem('token')
    if(token){
        window.location.href='../pages/todo.html'
    }
}
redirect()


form.addEventListener('submit',(e)=>{
    e.preventDefault()
    auth()
})



