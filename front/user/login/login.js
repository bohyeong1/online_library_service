const BASE_URL = 'http://127.0.0.1:3400'
const main_content= document.querySelector('.main-content')

////////////////////////////////////////////데이터 연결

async function connectData(data,url){


    const dataJson = await fetch(`${url}/api/users/login`,{
        headers : {
            'Content-Type':'application/json'
        },
        method : "POST",
        body : JSON.stringify({
            userId : data.userId,
            password : data.password
        })
    })

    const datas = await dataJson.json() 

    return datas
}

////////////////////////////////////////////////데이터 입력(front)
async function submit(e){
    e.preventDefault()
    const userId = e.target.userId.value
    const password = e.target.userPassword.value


    const data = await connectData({userId, password},BASE_URL)
    console.log(data)

    if(data.code=== 200){
        localStorage.setItem('tokenBox',userId)
        location.href='../../main/main.html'
    }else{
        alert(`${data.message}`)
    }

}

////////////////////////////////////이벤트 등록
main_content.addEventListener('submit',submit)