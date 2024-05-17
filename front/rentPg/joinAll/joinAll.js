const BASE_URL = 'http://127.0.0.1:3400'

const all_join_container = document.querySelector('.all-join-container')
const content = document.querySelector('.content')
const btn = document.querySelector('.btn')
const drop = document.querySelector('.drop')

const key = localStorage.getItem('tokenBox')


/////////////////////////////////////데이터 연결
// 모든 대출목록 연결
async function connectDataAll(data, url){
    console.log(data)

    const bookData = await fetch(`${url}/api/rental/join`,{
        headers:{
            'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({
            userId: data.key
        })
    })

    const books = await bookData.json()
    return books
}
////////////////////////////반납
async function connecReturn(data, url){

    console.log(data)

    const bookData = await fetch(`${url}/api/rental/return`,{
        headers:{
            'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({
            userId: data.key,
            isbn: data.isbn,
            _id : data._id 
        })
    })

    const books = await bookData.json()
    return books
}

///////////////////////////////////연장
async function connecExtend(data, url){
    console.log(data)

    const bookData = await fetch(`${url}/api/rental/extention`,{
        headers:{
            'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({
            userId: data.key,
            isbn: data.isbn,
            _id : data._id
        })
    })

    const books = await bookData.json()
    return books
}

///////////////////////////////데이터 디스플레이
async function displayBook(){

    const datas = await connectDataAll({key},BASE_URL)


    const box = document.querySelectorAll('.box')
    if(box){
        for(let bo of box){
            bo.remove()
        }
    }

    if(datas.length != 0){
        for(let book of datas){


            const data = document.createElement('div')
            data.className='box'
            data.innerHTML = `
            <div >제목 : ${book.title}</div>    
            <div>상태 : ${book.state}</div> 
            <div>카테고리 : ${book.category}</div>
            <div class='id'>isbn : ${book.isbn}</div> 
            <div class='date'>빌린 날짜 : ${book.rentalTime}</div> 
            <div>반납 기한 : ${book.returnTime}</div> 
            <div>반납 날짜 : ${book.finishedTime ? book.finishedTime : '아직 미납'}</div>
            <div class='_id'>_id : ${book._id}</div>
            <div class='btn-box'>
                <button class='returnBtn'>도서 반납</button>
                <button class='extendBtn'>반납 기한 연장</button>
            </div>
            `
            content.appendChild(data)

            const returnBtn = data.querySelector('.returnBtn')
            const extendBtn = data.querySelector('.extendBtn')

            // 반납
            returnBtn.addEventListener('click', async(e)=>{
                const id = data.querySelector('.id')
                const book_id = data.querySelector('._id')

                const isbn = id.innerText.substr(7)
                const _id = book_id.innerText.substr(6)
                const returnDatas = await connecReturn({isbn, key, _id}, BASE_URL)
                // console.log(rentalTime)


                location.reload(true) 
                alert(returnDatas)


            })
            // 연장
            extendBtn.addEventListener('click', async(e)=>{
                const id = data.querySelector('.id')
                const book_id = data.querySelector('._id')

                const isbn = id.innerText.substr(7)
                const _id = book_id.innerText.substr(6)
                const extentionDatas = await connecExtend({isbn, key, _id}, BASE_URL)


                
                location.reload(true) 
                alert(extentionDatas.message)
            })

        }
    }else{
        alert('대출목록 없음')
    }

    content.addEventListener('click',(e)=>{
        const id = e.target.parentElement.querySelector('.id')

        if(e.target.parentElement.className === 'box'){

            const word =  id.innerText.substr(7)


            location.href=`../../common/sellecJoin/sellecJoin.html?book=${word}`
        }
    })
}

///////////////////////////////////////////카테고리별 분류
async function connecClassification(data, url){
    const bookData = await fetch(`${url}/api/rental//join/category`,{
        headers:{
            'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({
            userId: data.key,
            category : data.category
        })
    })

    const books = await bookData.json()
    return books
}
//////////카테고리 별 디스플레이

async function classification(e){
    


    const category = e.target.value
    const datas = await connecClassification({key, category},BASE_URL)

    if(category === ''){
        const box = document.querySelectorAll('.box')
            if(box){
                for(let bo of box){
                    bo.remove()
                }
            }
    }else{
        if(datas.length != 0){
            const box = document.querySelectorAll('.box')
            if(box){
                for(let bo of box){
                    bo.remove()
                }
            }
    
            for(let book of datas){
    
                const data = document.createElement('div')
                data.className='box'
                data.innerHTML = `
                <div >제목 : ${book.title}</div>    
                <div>상태 : ${book.state}</div> 
                <div>카테고리 : ${book.category}</div>
                <div class='id'>isbn : ${book.isbn}</div> 
                <div class='date'>빌린 날짜 : ${book.rentalTime}</div> 
                <div>반납 기한 : ${book.returnTime}</div> 
                <div>반납 날짜 : ${book.finishedTime ? book.finishedTime : '아직 미납'}</div>
                <div class='_id'>_id : ${book._id}</div>
                <div class='btn-box'>
                    <button class='returnBtn'>도서 반납</button>
                    <button class='extendBtn'>반납 기한 연장</button>
                </div>
                `
                content.appendChild(data)
    
                const returnBtn = data.querySelector('.returnBtn')
                const extendBtn = data.querySelector('.extendBtn')
    
                // 반납
                returnBtn.addEventListener('click', async(e)=>{
                    const id = data.querySelector('.id')
                    const book_id = data.querySelector('._id')

                    const _id = book_id.innerText.substr(6)      
                    const isbn = id.innerText.substr(7)
                    const returnDatas = await connecReturn({isbn, key, _id}, BASE_URL)
    
    
                    location.reload(true) 
                    alert(returnDatas)
    
    
                })
                // 연장
                extendBtn.addEventListener('click', async(e)=>{
                    const id = data.querySelector('.id')
                    const book_id = data.querySelector('._id')

                    const _id = book_id.innerText.substr(6)      
                    const isbn = id.innerText.substr(7)
                    const extentionDatas = await connecExtend({isbn, key, _id}, BASE_URL)
    
    
                    
                    location.reload(true) 
                    alert(extentionDatas.message)
                })
    
            }
        }else{
            e.target.value = ''
            const box = document.querySelectorAll('.box')
            if(box){
                for(let bo of box){
                    bo.remove()
                }
            }
            alert('대출목록 없음')
        }
    
        content.addEventListener('click',(e)=>{
            const id = e.target.parentElement.querySelector('.id')
    
            if(e.target.parentElement.className === 'box'){
    
                const word =  id.innerText.substr(7)
    
    
                location.href=`../../common/sellecJoin/sellecJoin.html?book=${word}`
            }
        })
    }
    
}


const opt = document.querySelector('.opt')



//////////////이벤트 등록ㄴ
btn.addEventListener('click',displayBook)
drop.addEventListener('click' ,classification)