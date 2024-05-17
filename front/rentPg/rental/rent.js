const BASE_URL = 'http://127.0.0.1:3400'
const all_join_container = document.querySelector('.all-join-container')
const content = document.querySelector('.content')
const btn = document.querySelector('.btn')

const key = localStorage.getItem('tokenBox')


////////////////////////////데이터 연결
//////////대출등록
async function connectData(data, url){
    const bookDatas = await fetch(`${url}/api/rental`,{
        headers:{
            'Content-Type' : 'application/json'
        },
        method:'POST',
        body:JSON.stringify({
            isbn: data.isbn,
            userId : data.userId
        }) 
    })
    const book = await bookDatas.json()
    return book
}
/////////////////대출 리스트 연결
async function connectDataAll(url){
    const bookJson = await fetch(`${url}/api/common`,{
        headers:{
            'Content-Type':'application/json'
        },
        method:'GET'
    })
    const book = await bookJson.json()
 
    return book
}

///////////////////////////////////////////////////데이터 디스플레이
////////전체목록 디스플레이
async function displayAllBook(){
    const books = await connectDataAll(BASE_URL)
    const isData = document.querySelectorAll('.box')

    console.log(isData)

    if(isData.length === 0 ){
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
    }else{
        console.log(isData)
    }


    content.addEventListener('click',async(e)=>{
        const id = e.target.parentElement.querySelector('.id')

        if(e.target.parentElement.className === 'box'){

            const isbn =  id.innerText.substr(7)
            const userId = key

            console.log(isbn, userId)

           const book = await connectData({isbn, userId} ,BASE_URL)
           console.log(book)
           location.reload(true) 




           alert(`책 제목 : ${book.title} / 아이디 : ${book.userId} / 대출시간 : ${book.rentalTime} / 반납시간 : ${book.returnTime}`)
        }
    })
}

btn.addEventListener('click', displayAllBook)