const BASE_URL = 'http://127.0.0.1:3400'



///////////////////////////////////////////////////////////////////////////////////////회원가입
const main_content = document.querySelector('.main-content')





async function submit(e){
    e.preventDefault()

    const name = await e.target.userName.value
    const email = await e.target.userEmail.value
    const id = await e.target.userId.value
    const password = await e.target.userPassword.value
    const userPasswordConfirm = await e.target.userPasswordConfirm.value

    const data = await connectResister({
        name,email,id,password,userPasswordConfirm
    },BASE_URL)

    if(data.code === 200){
        localStorage.setItem('tokenBox', JSON.stringify(data.userId))
        location.href='../../main/main.html'
    }else{
        alert(`${data.message}`)
    }
}

main_content.addEventListener('submit', submit)
// main_content.addEventListener('mouseover', submit)

// 회원가입 서버연결
async function connectResister(data,url){

    console.log('data : ',data)

    const userJson = await fetch(`${url}/api/users/register`,{
        headers:{
            'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({
            name:data.name,
            email:data.email,
            userId:data.id,
            password:data.password,
            confirmPassword:data.userPasswordConfirm
        })        
    })

    const user = await userJson.json()

    return user
}









