const RANDOM_QUOTE_API_URL= 'http:///api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement= document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')

document.addEventListener('click', first)

let paused
let stoptime
function first(e){
    e.stopImmediatePropagation();
    this.removeEventListener("click", first);
    timer.innerText=getTimerTime()
    clearInterval(ID)
    document.onclick=second;
}
function second(){
    renderNewQuote()
    clearInterval(ID)
    document.onclick=first
    document.addEventListener('click', first)
}

quoteInputElement.addEventListener('input',()=>{
    const arrayQuote = quoteDisplayElement.querySelectorAll('span')
    const arrayValue = quoteInputElement.value.split('')
    let correct = true
    arrayQuote.forEach((characterSpan,index)=>{
        const character = arrayValue[index]
        if (character == null){
            characterSpan.classList.remove('correct')
            characterSpan.classList.remove('incorrect')
            correct = false
        }
        else if (character === characterSpan.innerText){
            characterSpan.classList.add('correct')
            characterSpan.classList.remove('incorrect')
        } else {
            characterSpan.classList.remove('correct')
            characterSpan.classList.add('incorrect')
            correct = false
        }
    })
    if (correct) renderNewQuote()
})

function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data.content)
}

const elem = document.getElementById('quoteInput')
async function renderNewQuote(){
    let quote = await getRandomQuote() + "\n"
    quoteDisplayElement.innerHTML= ''
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span')
        characterSpan.innerText = character
        quoteDisplayElement.appendChild(characterSpan)
    })
    quoteInputElement.value=null
    startTimer()
}
let startTime

function startTimer(){
    timerElement.innerText = 0
    startTime = new Date()
    ID = setInterval(() =>{
        timer.innerText = getTimerTime()
    },1000)
    
}


function getTimerTime(){
    return Math.floor((new Date() - startTime)/1000)
}

renderNewQuote()