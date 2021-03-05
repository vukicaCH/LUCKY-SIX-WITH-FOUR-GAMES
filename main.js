let loptice = Array.from(document.querySelectorAll('span.broj')).sort((a,b) => Number(a.dataset.index) > Number(b.dataset.index) ? 1 : -1);
let kombinacija = document.querySelector('form');

let endOfGame = document.querySelector('.end-of-game');
let endOfGameText = endOfGame.querySelector('p');
let resetButton = endOfGame.querySelector('button');


let ticketGame = document.querySelector('.igra-naslov');
let ticketDesc = document.querySelector('.igra-opis');
let ticketAmount = document.querySelector('.igra-novac');

///
let luckySixForm = document.querySelector('.brojevi-6');

luckySixForm.addEventListener('submit', kreni);

///
let colorsForm = document.querySelector('.colors');

colorsForm.addEventListener('submit', firstBallColor);

let colors = document.querySelectorAll('.colors .color');

///
let numInFirstFiveForm = document.querySelector('.number-5');

numInFirstFiveForm.addEventListener('submit', numberInFirstFive);

///
let sumOfFirstFiveForm = document.querySelector('.sum-of-5');

sumOfFirstFiveForm.addEventListener('submit', sumOfFirstFive);

let options = Array.from(sumOfFirstFiveForm.querySelectorAll('.option'));


options[0].addEventListener('click', function(){
    gameObj.selectSum = false;
    resetSumOptions();
    this.classList.add('option-clicked');
});
options[1].addEventListener('click',function(){
    gameObj.selectSum = true;
    resetSumOptions();
    this.classList.add('option-clicked');
});


let numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,
41,42,43,44,45,46,47,48];


resetButton.addEventListener('click', resetGame);



let allowSubmit = true;

let gameObj = {
    drawnNumbers:[],
    cash: 0,
    sixNumbers: [],
    color: null,
    numInFirstFive: null,
    selectSum: null,
    sumOf5: 0,
    isSumBigger: null,
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return (Math.random() * (max - min) + min).toFixed(0);
}

function transferNumbers(arr, arr2){
    let broj = arr[getRandomInt(0,arr.length - 1)];

    arr2.push(broj);

    arr.splice(arr.indexOf(broj), 1);
}

function setColor(num){ // this function decides which colors will balls have
    let red = [1,9,17,25,33,41];
    let green = [2,10,18,26,34,42];
    let blue = [3,11,19,27,35,43];
    let purple = [4,12,20,28,36,44];
    let brown = [5,13,21,29,37,45];
    let yellow = [6,14,22,30,38,46];
    let orange = [7,15,23,31,39,47];

    if(red.includes(num)){
        return 'red';
    }

    else if(green.includes(num)){
        return 'green';
    }

    else if(blue.includes(num)){
        return 'blue';
    }

    else if(purple.includes(num)){
        return 'purple';
    }

    else if(brown.includes(num)){
        return 'brown';
    }

    else if(yellow.includes(num)){
        return 'yellow';
    }

    else if(orange.includes(num)){
        return 'orange';
    }

    else{
        return 'black';
    }
}



function resetGame(){ //this function RESETS the game

    numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,
        41,42,43,44,45,46,47,48];

    for(let key of Object.keys(gameObj)){
        gameObj[key] = null;

        if(key === 'sixNumbers' || key === 'drawnNumbers'){
            gameObj[key] = [];
        }

        if(key == 'cash' || key == 'sumOf5'){
            gameObj[key] = 0;
        }
    }

    colors.forEach(color => color.style.border = '3px solid white');

    loptice.forEach(loptica => {
        loptica.innerHTML = '';
        loptica.style.opacity = '0';
        loptica.parentNode.style.backgroundColor = 'rgba(209, 204, 204, 0.4)';
    })

    endOfGame.style.opacity = '0';
    endOfGame.style.zindex = '-1';
    endOfGameText.innerHTML = '';

    document.body.style.overflowY = 'initial';

    ticketGame.innerHTML = 'GAME: ';
    ticketDesc.innerHTML = '';
    ticketAmount.innerHTML = 'AMOUNT: ';

    let fields = document.querySelectorAll('input');

    fields.forEach(field => field.value = '');

    resetSumOptions();

    window.scrollTo(0,0);

    allowSubmit = true;


}


function setNumber(e, number){ //this function create numbers and balls
    transferNumbers(numbers, gameObj.drawnNumbers);
    loptice[number].innerHTML = gameObj.drawnNumbers[number];
    loptice[number].style.opacity = '1';
    loptice[number].parentNode.style.backgroundColor = setColor(gameObj.drawnNumbers[number]);

    if(number == 5){
        for(let i = 1;i<=5;i++){
            gameObj.sumOf5 += +loptice[i].innerHTML;
        }

        if(gameObj.sumOf5 > 122){
            gameObj.isSumBigger = true;
        }else{
            gameObj.isSumBigger = false;
        }
    }

    
    if(number == 35){
        let gamePlayed = e.target.attributes.name.value;

        setTimeout(() => {runCheck(gamePlayed)}, 1200);
        clearTimeout(timer);
    }
    

    let timer = setTimeout(() => {setNumber(e, ++number)}, 700);

}

//CODE FOR LUCKY SIX

function proveriKombinaciju(arr, arr2){


    let win = arr2.every(num => arr.includes(num));

    let lastPosition = lastPos(gameObj.drawnNumbers,gameObj.sixNumbers);
    

    if(win){
        let lastBall = loptice[lastPosition];
        let amountWon = gameObj.cash * lastBall.dataset.puta;

        endOfGameText.innerHTML = `You won $${amountWon}.`;
        endOfGame.style.backgroundColor = 'rgba(29, 202, 43, 0.904)';
    }else{
        endOfGameText.innerHTML = `You lost.`;
        endOfGame.style.backgroundColor = 'rgba(219, 32, 32, 0.904)';
    }

    endOfGame.style.opacity = '1';
    endOfGame.style.zIndex = '1';

}

function lastPos(arr,arr2){
    let positions = [];

    for(let item of arr2){
        if(arr.includes(item)){
            positions.push(arr.indexOf(item));
        }
    }

    return Math.max(...positions);
}


function kreni(e){
    e.preventDefault();

    let numbersLuckySix = document.querySelectorAll('input.number');
    gameObj.cash = +this.querySelector('.novac').value;

    numbersLuckySix.forEach(numberLuckySix => {
        if(gameObj.sixNumbers.includes(+numberLuckySix.value)){
            return;
        }

        if(+numberLuckySix.value < 1 || +numberLuckySix.value > 48){
            return;
        }

        gameObj.sixNumbers.push(+numberLuckySix.value);
    });

    if(gameObj.sixNumbers.length != 6){
        alert('You must enter 6 numbers');
        gameObj.sixNumbers = [];
        return;
    }

    if(gameObj.cash < 5){
        alert('Minimum investment is 5$.');
        gameObj.sixNumbers = [];
        return;
    }

    if(allowSubmit){
        ticketGame.innerHTML += 'Get 6 numbers';
        ticketDesc.innerHTML += `Your numbers: ${gameObj.sixNumbers}`;
        ticketAmount.innerHTML += `$${gameObj.cash}`;
        scrollToTable();
        setNumber(e, 0);
    }

    allowSubmit = false;
}



// CODE FOR COLORS GAME


function changeColor(){
    gameObj.color = this.dataset.color;
    colors.forEach(color => color.style.border = '3px solid white');
    this.style.border = '5px solid tomato';
}

colors.forEach(color => color.addEventListener('click', changeColor));


function firstBallColor(e){
    e.preventDefault();

    gameObj.cash = +this.querySelector('.novac').value;

    if(!gameObj.color){
        alert('You must pick a color.');
        return;
    }

    if(gameObj.cash < 5){
        alert('Minimum investment is $5.');
        return;
    }

    if(allowSubmit){
        ticketGame.innerHTML += 'Color of first ball';
        ticketDesc.innerHTML += `First color: ${gameObj.color}`;
        ticketAmount.innerHTML += `$${gameObj.cash}`;
        scrollToTable();
        setNumber(e, 0);
    }

    allowSubmit = false;

}

function checkColor(){
    if(gameObj.color === loptice[0].parentNode.style.backgroundColor){
        let amountWon = gameObj.cash * 8;
        endOfGameText.innerHTML = `You won $${amountWon}.`;
        endOfGame.style.backgroundColor = 'rgba(29, 202, 43, 0.904)';
    }else{
        endOfGameText.innerHTML = `You lost.`;
        endOfGame.style.backgroundColor = 'rgba(219, 32, 32, 0.904)';
    }

    endOfGame.style.opacity = '1';
    endOfGame.style.zIndex = '1';

}

//CODE FOR NUMBER IN FIRST 5


function numberInFirstFive(e){
    e.preventDefault();

    gameObj.numInFirstFive = +this.querySelector('.single-number').value;

    gameObj.cash = +this.querySelector('.novac').value;

    if(!gameObj.numInFirstFive || !(gameObj.numInFirstFive  > 0 && gameObj.numInFirstFive  < 49)){
        alert('Pick a number between 1 and 48');
        return;
    }

    if(gameObj.cash < 5){
        alert('Minimum investmentment is $5');
        return;
    }

    if(allowSubmit){
        ticketGame.innerHTML += 'Number in first five balls';
        ticketDesc.innerHTML += `Your number: ${gameObj.numInFirstFive}`;
        ticketAmount.innerHTML += `$${gameObj.cash}`;
        scrollToTable();
        setNumber(e, 0);
    }

    allowSubmit = false;
}

function checkNumberInFirstFive(){

    for(let i = 1;i<=5;i++){
        if(gameObj.numInFirstFive == +loptice[i].innerHTML){
            endOfGameText.innerHTML =  `You won $${gameObj.cash * 6}.`;
            endOfGame.style.backgroundColor = 'rgba(29, 202, 43, 0.904)';
            endOfGame.style.opacity = '1';
            endOfGame.style.zIndex = '1';
            return;
        }
    }


    endOfGameText.innerHTML =  `You lost.`;
    endOfGame.style.backgroundColor = 'rgba(219, 32, 32, 0.904)';
    endOfGame.style.opacity = '1';
    endOfGame.style.zIndex = '1';

}


//CODE FOR SUM OF FIRST FIVE GAME



function sumOfFirstFive(e){
    e.preventDefault();

    gameObj.cash = +this.querySelector('.novac').value;

    if(gameObj.selectSum == null){
        alert('Pick one choice.');
        return;
    }

    if(gameObj.cash < 5){
        alert('Minimum investment is $5');
        return;
    }

    if(allowSubmit){
        ticketGame.innerHTML += 'Sum of first five numbers';
        ticketDesc.innerHTML += `Sum will be: ${gameObj.selectSum ? 'greater than 122.5' : 'less than 122.5'}`;
        ticketAmount.innerHTML += `$${gameObj.cash}`;
        scrollToTable();
        setNumber(e, 0);
    }

    allowSubmit = false;

    
}

function checkSum(){

    if(gameObj.selectSum == gameObj.isSumBigger){
        endOfGameText.innerHTML =  `You won $${gameObj.cash * 2}.`;
        endOfGame.style.backgroundColor = 'rgba(29, 202, 43, 0.904)';
    }else{
        endOfGameText.innerHTML =  `You lost.`;
        endOfGame.style.backgroundColor = 'rgba(219, 32, 32, 0.904)';
    }

    endOfGame.style.opacity = '1';
    endOfGame.style.zIndex = '1';
}

function resetSumOptions(){ // resets style for option buttons
    options.forEach(option => option.classList.remove('option-clicked'));
}




function scrollToTable(){ //scrolls to table coordinates
    let table = document.querySelector('.tabla');

    window.scrollBy(0, table.getBoundingClientRect().top);
    document.body.style.overflowY = 'hidden';
}

function runCheck(el){ //checks which game was played and run appropriate check
    if(el === 'lucky-six'){
        proveriKombinaciju(gameObj.drawnNumbers, gameObj.sixNumbers);
    }else if(el === 'colors'){
        checkColor();
    }else if(el === 'number-in-5'){
        checkNumberInFirstFive();
    }else if(el === 'sum-of-5'){
        checkSum();
    }else{
        return;
    }
}


