const BASE_URL = 'http://127.0.0.1:3400'
const main_content = document.querySelector('.main-content')
const main_container = document.querySelector('.main-container')

////////////////////////////////데이터 연결
async function connectData(data, uri){
    console.log(data)
    const userJson = await fetch(`${uri}/api/users/update`,{
        headers:{
            'Content-Type':'application/json'
        },
        method:"PUT",
        body:JSON.stringify({
            userId : data.userId,
            password : data.password,
            email : data.email,
            name : data.name,
            authId : data.authId,
            confirmPassword : data.confirmPassword
        })
    })
    const user = await userJson.json()

    return user
}

//////////////////////////////////////////////////////////////////서브밋
async function submit(e){
    e.preventDefault()
    const key = JSON.parse(localStorage.getItem('tokenBox')) ///데이터 호출 키
    console.log(key)

    const userId = e.target.userId.value
    const password = e.target.userPassword.value
    const email = e.target.userEmail.value
    const name = e.target.userName.value
    const confirmPassword = e.target.userPasswordConfirm.value
    const authId = key

    const data = await connectData({userId, password, email, name, confirmPassword, authId}, BASE_URL)


    console.log(data)
    if(data.code===200){
       console.log('확인')
       main_content.style.display = 'none'
       const confirmDiv = document.createElement('div')
       confirmDiv.className = 'confirm'
       confirmDiv.innerHTML = `
            <div>변경된 이름 : ${data.name}</div>
            <div>변경된 ID : ${data.userId}</div>
            <div>변경된 E-mail : ${data.password}</div>
       `
       main_container.appendChild(confirmDiv)

    }else{
        alert(`${data.message}`)
    }


}

main_content.addEventListener('submit', submit)