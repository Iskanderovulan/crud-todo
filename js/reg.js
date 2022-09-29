
const API = 'https://jwt-ulios-test.herokuapp.com'
const regRoute = '/auth/reg'

const form = document.querySelector('#reg-form')
const name = document.querySelector('#username')
const email = document.querySelector('#email')
const pass = document.querySelector('#pass')

const registration = async() =>{

    try{
        const data = {
            name:name.value,
            email:email.value,
            pass:pass.value
        }
    
        const request = await fetch(API+regRoute,{
            headers:{
                "Content-Type":"application/json"
            },
            method:'POST',
            body:JSON.stringify(data)
        })
    
        const response  = await request.json()
        console.log(response)
    
        if(response.token){
            localStorage.setItem('token',response.token)
            alert('REG IS DONE')
            window.location.href='../pages/todo.html'
        }
    
        if(response.message){
            console.log(response)
            renderErrors(response)
        }
    }catch(e){
        alert(e)
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
    if(name.value && email.value && pass.value){
        registration()
    }else{
        alert('Field is empty')
    }
})







// auth
// {
//     email:
//     pass:
// }

// auth



