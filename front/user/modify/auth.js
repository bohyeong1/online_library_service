const BASE_URL = 'http://127.0.0.1:3400'
const main_content = document.querySelector('.main-content')

////////////////////////////////데이터 연결
async function connectData(data, uri){

    const userJson = await fetch(`${uri}/api/users/`,{
        headers:{
            'Content-Type':'application/json'
        },
        method:"POST",
        body:JSON.stringify({
            userId : data.userId,
            password : data.password
        })
    })
    const user = await userJson.json()

    return user
}

//////////////////////////////////////////////////////////////////서브밋
async function submit(e){
    e.preventDefault()

    const userId = e.target.userId.value
    const password = e.target.userPassword.value

    const data = await connectData({userId, password}, BASE_URL)


    console.log(data)
    if(data.code===200){
        location.href = './modify.html'

    }else{
        alert(`${data.message}`)
    }


}

main_content.addEventListener('submit', submit)