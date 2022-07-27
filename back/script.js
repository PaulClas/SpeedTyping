const RANDOM_QUOTE_API_URL= 'http:///api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement= document.getElementById('quoteInput')
const wordsperMinuteElement = document.getElementById('wordsPerMinutelesson')
const accuraccyPerLesson= document.getElementById('accuracylesson')
const timerElement = document.getElementById('timer')
const wpmAverage = document.getElementById('wpmall')
const accuracyall = document.getElementById('accuracyall')
const timeall = document.getElementById('timeall')
const progressBar = document.getElementById('progressBar')
const lessonTime = 1800

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
localStorage.setItem("accuracyall","")
localStorage.setItem("totalTime","")
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
        stopTime=getTimerTime()
        var wpmlesson=wpmSetLessonSpeed(stopTime)
        var lessonAccuracy=setLessonAccuracy(nb_incorrect,arrayQuote)
        setAverage("wpmAvg",wpmlesson,wpmAverage)
        setAverage("accuracyall",lessonAccuracy,accuracyall)
        time=setTotalTimeSpent(stopTime)
        renderNewQuote()
        nb_incorrect = 0
        accuraccy = 0

    }
})

function setLessonAccuracy(nb_incorrect,arrayQuote){
    var lessonAccuracy=new Number(roundedToFixed((100-(nb_incorrect/arrayQuote.length*100)),1))
    accuraccyPerLesson.innerHTML=lessonAccuracy
    return lessonAccuracy
}

function wpmSetLessonSpeed(stopTime){
    var wpmlesson= new Number(roundedToFixed(getWordsPerMinute(stopTime),1))
    wordsperMinuteElement.innerHTML=wpmlesson
    return wpmlesson
}

function setAverage(key,value,dom){
    if (localStorage.getItem(key) === ""){
        localStorage.setItem(key,value)
    }else{
        var temp = new Number (localStorage.getItem(key))
        var avg = new Number((temp + value)/2)
        localStorage.setItem(key,avg)
        console.log(localStorage.getItem(key))
    }
    console.log(roundedToFixed(localStorage.getItem(key),1))
    dom.innerHTML=roundedToFixed(localStorage.getItem(key),1)
}

function setTotalTimeSpent(stopTime){
    if(localStorage.getItem("totalTime")===""){
        localStorage.setItem("totalTime",stopTime)
        var time=stopTime
    }
    else{
        var time=stopTime+ Number(localStorage.getItem("totalTime"))
        localStorage.setItem("totalTime",time)
    }
    timeall.innerHTML=fancyTimeFormat(Number(localStorage.getItem("totalTime")))
    progressBar.style.width= progress(time) + '%'
    if (progress(time) >= 5)
        progressBar.innerHTML= roundedToFixed(progress(time),1) + '%'

}

function progress(time){
    return pourcentage = time*100/lessonTime
}

function fancyTimeFormat(duration)
{   
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

function roundedToFixed(input, digits){
    var rounded = Math.pow(10, digits);
    return (Math.round(input * rounded) / rounded).toFixed(digits);
  }

function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data.content+' '+data.author+'.')

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