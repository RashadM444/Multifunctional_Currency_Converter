let leftButtons = document.querySelectorAll('.cur.left'); //* calls the buttons of specific currencies from the left side
let rightButtons = document.querySelectorAll('.cur.right'); //* calls the buttons from the right side
let leftOptions = document.querySelectorAll('.curListLeft option'); //* calls the select options from left
let rightOptions = document.querySelectorAll('.curListRight option'); //* calls the select options from right
let leftInput = document.querySelector('.forInput.leftInput'); //* calls the left side input for client
let rightInput = document.querySelector('.forInput.rightInput'); //* calls the right side input for client
let leftCorner = document.querySelector('.forCurInfo.leftCurInfo'); //* cals the left side live currency info
let rightCorner = document.querySelector('.forCurInfo.rightCurInfo'); //* cals the right side live currency info
let swapButton = document.querySelector('#swap'); //* calls the invert button

//**The function provokes the first default rates */
async function fetchForStart() {
    let load = document.querySelector('.siteForLoading')
    load.style.display = 'flex';
    let reqPromise = await fetch(`https://api.ratesapi.io/api/latest?base=RUB&symbols=USD`)
    let respJson = await reqPromise.json();
    load.style.display = 'none';
    let startCur = respJson.rates.USD;
    let revCur = 1 / startCur
    leftCorner.innerHTML = `1 RUB = ${startCur.toFixed(2)} USD`;
    rightCorner.innerHTML = `1 USD = ${revCur.toFixed(2)} RUB`
}

fetchForStart();


//* When called, the two functions below will update the latest currency info on the corners of the boxes
async function updateLeftCorner() {
    let from = formTheFrom();
    let to = formTheTo();
    // if (from == to) {
    //     throw new Error(alert('Please refrain from choosing same currencies'))
    // }
    let load = document.querySelector('.siteForLoading')
    load.style.display = 'flex';
    try {
        let reqPromise = await fetch(`https://api.ratesapi.io/api/latest?base=${from}&symbols=${to}`)
        let respJson = await reqPromise.json();
        load.style.display = 'none';
        let cur = respJson.rates[to];
        let revCur = 1 / cur;
        leftCorner.innerHTML = `1 ${from} = ${cur.toFixed(2)} ${to}`;
        rightCorner.innerHTML = `1 ${to} = ${revCur.toFixed(2)} ${from}`;
    } catch {
        alert('Something Went Wrong!')
    }
}

async function updateRightCorner() {
    let from = formTheFrom();
    let to = formTheTo();
    // if (from == to) {
    //     throw new Error(alert('Please refrain from choosing same currencies'))
    // }
    let load = document.querySelector('.siteForLoading')
    load.style.display = 'flex';
    let reqPromise = await fetch(`https://api.ratesapi.io/api/latest?base=${from}&symbols=${to}`)
    let respJson = await reqPromise.json();
    load.style.display = 'none';
    let cur = respJson.rates[to];
    let revCur = 1 / cur;
    leftCorner.innerHTML = `1 ${from} = ${revCur.toFixed(2)} ${to}`;
    rightCorner.innerHTML = `1 ${to} = ${cur.toFixed(2)} ${from}`;
}


//* When called, below two functions will update the input field according to chosen currencies
async function updateRightInput() {
    let from = formTheFrom();
    let to = formTheTo();
    let input = document.querySelector('.leftInput')
    let output = document.querySelector('.rightInput')
    if (from == to) {
        output.value = input.value
    } else {
        let load = document.querySelector('.siteForLoading')
        load.style.display = 'flex';
        let reqPromise = await fetch(`https://api.ratesapi.io/api/latest?base=${from}&symbols=${to}`)
        let respJson = await reqPromise.json();
        load.style.display = 'none';
        let cur = respJson.rates[to];
        output.value = cur * input.value;
    }

}

async function updateLeftInput() {
    let from = formTheFrom();
    let to = formTheTo();
    let input = document.querySelector('.rightInput')
    let output = document.querySelector('.leftInput')
    if (from == to) {
        output.value = input.value
    } else {
        let load = document.querySelector('.siteForLoading')
        load.style.display = 'flex';
        let reqPromise = await fetch(`https://api.ratesapi.io/api/latest?base=${to}&symbols=${from}`)
        let respJson = await reqPromise.json();
        load.style.display = 'none';
        let cur = respJson.rates[from];
        output.value = cur * input.value;
    }

}

//* When called two functions below will change the classes of pushed buttons to respond dynamically
async function changeTheClassLeft(event) {
    let siblings = document.querySelectorAll('.cur.left');
    let options = document.querySelectorAll('.curListLeft option');
    options.forEach(option => { option.classList.remove('active') });
    siblings.forEach(sibling => { sibling.classList.remove('active') });
    event.target.classList.add('active');

}

async function changeTheClassRight(event) {
    let siblings = document.querySelectorAll('.cur.right');
    let options = document.querySelectorAll('.curListRight option');
    options.forEach(option => { option.classList.remove('active') });
    siblings.forEach(sibling => { sibling.classList.remove('active') });
    event.target.classList.add('active');

}

//* When called, the function will find the currency of the left side
function formTheFrom() {
    let a;
    let selectedLeft = document.querySelectorAll('.cur.left.active');
    selectedLeft.forEach((select) => {
        if (select.classList.contains('curListLeft')) {
            a = select.value;
        } else {
            a = select.innerText;
        }
    });
    return a;
}

//* When called, the function will find the currency of the right side
function formTheTo() {
    let b;
    let selectedRight = document.querySelectorAll('.cur.right.active');
    selectedRight.forEach((select) => {
        if (select.classList.contains('curListRight')) {
            b = select.value;
        } else {
            b = select.innerText;
        }
    })
    return b;
}

//* Two functions below are given to the buttons and select options to respond to a click by client
let leftAction = (e) => {
    changeTheClassLeft(e);
    updateRightInput();
    updateLeftCorner();
    updateRightCorner();
}

let rightAction = e => {
    changeTheClassRight(e);
    updateLeftInput();
    updateLeftCorner();
    updateRightCorner();
}

//* Two functions below will respond to clients input and will update the results on keydown
async function handleInputLeft(e) {
    let from = formTheFrom();
    let to = formTheTo();
    let output = document.querySelector('.rightInput')
    let input = document.querySelector('.forInput.leftInput');
    if (from == to) {
        output.value = input.value;
    } else {
        let load = document.querySelector('.siteForLoading')
        load.style.display = 'flex';
        let reqPromise = await fetch(`https://api.ratesapi.io/api/latest?base=${from}&symbols=${to}`)
        let respJson = await reqPromise.json();
        let cur = respJson.rates[to];
        output.value = (cur * input.value).toFixed(2);
        load.style.display = 'none';
    }

}

async function handleInputRight(e) {
    let from = formTheFrom();
    let to = formTheTo();
    let output = document.querySelector('.leftInput');
    let input = document.querySelector('.forInput.rightInput');
    if (from == to) {
        output.value = input.value;
    } else {
        let load = document.querySelector('.siteForLoading')
        load.style.display = 'flex';
        let reqPromise = await fetch(`https://api.ratesapi.io/api/latest?base=${to}&symbols=${from}`)
        let respJson = await reqPromise.json();
        let cur = respJson.rates[from];
        output.value = (cur * input.value).toFixed(2);
        load.style.display = 'none';
    }

}

let leftSelections = document.querySelectorAll('.s');
let rightSelections = document.querySelectorAll('.d');
let curListRight = document.querySelector('.curListRight');
let curListLeft = document.querySelector('.curListLeft');
let cur;
let cur2;

//* the function will change the chosen currencies with each other and calculate the results accordingly
let handleSwap = (event) => {
    // let from = formTheFrom();
    // let to = formTheTo();

    if (curListLeft.classList.contains('active') && curListRight.classList.contains('active')) {
        let a = curListLeft.value;
        curListLeft.value = curListRight.value;
        curListRight.value = a;
    } else {
        leftSelections.forEach(element => {
            if (element.classList.contains('active')) {
                cur = element.innerText;
            }
            if (curListLeft.classList.contains('active')) {
                cur = '';
            }
        })

        rightSelections.forEach(element => {
            if (element.classList.contains('active')) {
                cur2 = element.innerText;
            }
            if (curListRight.classList.contains('active')) {
                cur2 = '';
            }
        })

        leftSelections.forEach(selection => {
            selection.classList.remove('active')
            if (curListRight.classList.contains('active') && cur2 == '') {

                curListLeft.value = curListRight.value
                curListRight.classList.remove('active')
                curListLeft.classList.add('active');

            }
            if (selection.innerText == cur2) {

                selection.classList.add('active');
            }
        })
        rightSelections.forEach(selection => {
            selection.classList.remove('active')
            if (curListLeft.classList.contains('active') && cur == '') {

                curListRight.value = curListLeft.value;
                curListLeft.classList.remove('active')
                curListRight.classList.add('active');

            }
            if (selection.innerText == cur) {

                selection.classList.add('active');
            }
        })
    }
    updateLeftCorner();
    updateRightCorner();
    updateRightInput();
}

let index;
leftButtons.forEach(button => button.addEventListener('click', leftAction));
rightButtons.forEach(button => button.addEventListener('click', rightAction));
leftInput.addEventListener('input', () => {
    clearTimeout(index);
    index = setTimeout(() => {
        handleInputLeft();
    }, 1000)
});
rightInput.addEventListener('input', () => {
    clearTimeout(index);
    index = setTimeout(() => {
        handleInputRight();
    }, 1000)
});
swapButton.addEventListener('click', handleSwap)


/*function changeKey(input){
let origInput = input;
let newInput ="";
let cur =true;
for (let i =0; i < origInput.length; i++) {
if (cur && (origInput[i] ==="."|| origInput[i] ===",")) {
      newInput += origInput[i];
      cur =false;
}
if (!isNaN(origInput[i])) {
      newInput += origInput[i];
}
if (origInput.length ==1&& origInput[i] ==".") {
      newInput ="";
}
}
return newInput.replace(",",".");
}


 **/