const RANDOM_QUOTE_API_URL= 'http:///api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement= document.getElementById('quoteInput')
const wordsperMinuteElement = document.getElementById('wordsPerMinutelesson')
const accuraccyPerLesson= document.getElementById('accuracylesson')
const timerElement = document.getElementById('timer')
const wpmAverage = document.getElementById('wpmall')

document.addEventListener('click', first)

function first(e){
    if(quoteInputElement === document.activeElement)
        return
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
let nb_incorrect = 0
let accuraccy = 0
localStorage.setItem("wpmAvg","")
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
            nb_incorrect+=1
            correct = false
        }
    })
    if (correct){
        accuraccyPerLesson.innerHTML=roundedToFixed((100-(nb_incorrect/arrayQuote.length*100)),1)
        stopTime=getTimerTime()
        var wpmlesson= new Number(getWordsPerMinute(stopTime))
        console.log(wpmlesson)
        wordsperMinuteElement.innerHTML=wpmlesson
        renderNewQuote()
        var existing = new Number(localStorage.getItem("wpmAvg"))
        var wpmAvg = existing ? new Number((existing + wpmlesson)/2) : wpmlesson
        console.log(wpmAvg)
        localStorage.setItem("wpmAvg",wpmAvg)
        wpmAverage.innerHTML=localStorage.getItem('wpmAvg')
        nb_incorrect = 0
        accuraccy = 0

    }
})

function roundedToFixed(input, digits){
    var rounded = Math.pow(10, digits);
    return (Math.round(input * rounded) / rounded).toFixed(digits);
  }

function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data.content+data.length)

}

function getWordsPerQuote(quote){
    return quote.trim().split(/\s+/).length
}

function getWordsPerMinute(stopTime){
    let wpm = (getWordsPerQuote(quote)/stopTime)*60
    return wpm
}

let quote
async function renderNewQuote(){
    quote = await getRandomQuote() + "\n"
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