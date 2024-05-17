const token = localStorage.getItem('tokenBox')
const status = document.querySelector('.status')
const main_container = document.querySelector('.main-container')


console.log(token)

if(token){
    status.innerText = '로그아웃'
    const deleteBtn = document.createElement('button')
    deleteBtn.innerHTML='아이디삭제'

    const modifyBtn = document.createElement('button')
    modifyBtn.innerHTML='정보수정'

    const rentBtn = document.createElement('button')
    rentBtn.innerHTML='도서대출'
    
    main_container.appendChild(modifyBtn)
    main_container.appendChild(deleteBtn)
    main_container.appendChild(rentBtn)

    modifyBtn.addEventListener('click',()=>{
        location.href = '../user/modify/auth.html'
    })
    deleteBtn.addEventListener('click',()=>{
        location.href = '../user/delete/delete.html'
    })
    rentBtn.addEventListener('click',()=>{
        location.href = '../rentPg/rentalMain/rentalMain.html'
    })
    


}else{
    status.innerText = '로그인'
}

function statusClick(){

    if(this.innerText === '로그인'){
        location.href='../user/login/login.html'
    }else{
        this.innerText = '로그인'
        window.localStorage.removeItem('tokenBox')
        location.reload(true) 
    }
}

console.log(token)

status.addEventListener('click', statusClick)