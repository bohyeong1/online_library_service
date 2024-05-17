const BASE_URL = 'http://127.0.0.1:3400'
const sellec_join_container = document.querySelector('.sellec-join-container')


/////////////////////////////데이터 연결
async function connectData(){
    const idx = location.search
    const isbn = idx.split('=')[1]
    console.log(isbn)
    const bookJson = await fetch(`${BASE_URL}/api/common/${isbn}`,{
        headers: {
            'Content-Type':'application/json'
        },
        method:'POST'
    })
    const book = await bookJson.json()
    console.log(book)
    const data = document.createElement('div')
    data.className = 'data'
    data.innerHTML=`
        <div>제목 : ${book.title}</div>
        <div>줄거리 : ${book.summary}</div>
        <div>출시일 : ${book.release}</div>
        <div>작가 : ${book.author}</div>
    `
    sellec_join_container.appendChild(data)
}

connectData()