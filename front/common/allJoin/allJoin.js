const BASE_URL = 'http://127.0.0.1:3400'

const all_join_container = document.querySelector('.all-join-container')
const content = document.querySelector('.content')
const btn = document.querySelector('.btn')

// 데이터연결
async function connectData(url){
    const bookJson = await fetch(`${url}/api/common`,{
        headers:{
            'Content-Type':'application/json'
        },
        method:'GET'
    })
    const book = await bookJson.json()
 
    return book
}

// 데이터 디스플레이
async function displayData(){
    const books = await connectData(BASE_URL)

    const box = document.querySelectorAll('.box')
    if(box){
        for(let bo of box){
            bo.remove()
        }
    }
    
    for(const book of books){
        const data = document.createElement('div')
        data.className='box'
        data.innerHTML = `
        <div >제목 : ${book.title}</div>    
        <div>저자 : ${book.author}</div> 
        <div>분류 : ${book.category}</div> 
        <div>줄거리 : ${book.summary}</div> 
        <div>수량 : ${book.amount}</div>
        <div class='id'>isbn : ${book.isbn}</div>`
        content.appendChild(data)
    }

    content.addEventListener('click',(e)=>{
        const id = e.target.parentElement.querySelector('.id')

        if(e.target.parentElement.className === 'box'){

            let word =  id.innerText.substr(7)
            console.log(word)

            location.href=`../sellecJoin/sellecJoin.html?book=${word}`
        }
    })
}



btn.addEventListener('click', displayData)




