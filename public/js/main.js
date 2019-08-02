const pickNumElements = document.querySelectorAll('.pick-num');

const rules01Element = document.querySelector('.rules-01');

const currTicketElement = document.querySelector('.curr-ticket');
const currTicketNumsElements = currTicketElement.children[0];
const currTicketInputAmount = document.querySelector('.amount-input');
const currTicketInputWin = document.querySelector('.amount-win');

const addTicketButton = document.getElementById('add-ticket');
const removeTicketButton = document.querySelectorAll('.ticket-btn');
const startGameButton = document.getElementById('start-game');
const resetButton = document.getElementById('reset');

const allTicketsElement = document.querySelector('.section-4');
const winningNumsElements = document.querySelectorAll('.section-3 .result-num');

let allTickets = [];
let winningNumbers = [];

let allNumbers = Array.from({ length: 30 }).map((e, i) => i + 1);

let ticketNums = [];
let inputAmount;
let winAmount;

let intervalID;
let gameOn = false;

class Ticket {
  constructor(nums, pay, win) {
    this.nums = nums;
    this.pay = pay;
    this.win = win;
    this.date = Date.now();
  }
}

// RESET
const reset = () => {
  clearInterval(intervalID);
  gameOn = false;
  allTickets = [];
  winningNumbers = [];
  allNumbers = Array.from({ length: 30 }).map((e, i) => i + 1);
  [...allTicketsElement.children].forEach(e => e.remove());
  [...winningNumsElements].forEach(e => e.innerHTML = '');
  rules01Element.style.display = 'block';
}

// CHECK FOR WINNING TICKETS
const checkWinTickets = () => {
  const arr = [...allTicketsElement.children].reverse();
  const testTickets = allTickets.map(e =>
    e.nums.every(e => winningNumbers.includes(e))
  );

  testTickets.forEach((e, i) =>
    {
      arr[i].children[1].children[1].style.display = 'none';
      if(e) {
        arr[i].children[0].style.backgroundColor = '#85f180';
        arr[i].children[1].children[0].children[1].style.color = '#85f180';
        [...arr[i].children[0].children].forEach(e => {e.style.borderColor = '#FFF'; e.style.color = '#85f180';})
      }else {
        arr[i].children[0].style.backgroundColor = '#ef6c57';
        arr[i].children[1].children[0].children[1].style.color = '#ef6c57';
        arr[i].children[1].children[0].children[1].style.textDecoration = 'line-through';
        [...arr[i].children[0].children].forEach(e => {e.style.borderColor = '#FFF'; e.style.color = '#ef6c57';})
      }
    }
  );
};

// DRAW NUMBERS
const drawNumbers = () => {
  const max = allNumbers.length;
  const pick = Math.floor(Math.random() * max);
  const num = allNumbers[pick];
  const index = 30 - max;

  winningNumsElements[index].innerHTML = num;

  winningNumbers.push(num);
  allNumbers.splice(pick, 1);
  if (allNumbers.length <= 18) {
    clearInterval(intervalID);
    checkWinTickets();
  }
};

// ADD TICKET
const addTicket = arr => {
  if(gameOn) return;
  const obj = arr[arr.length - 1];
  const el = document.createElement('div');
  el.setAttribute('class', 'ticket');
  el.setAttribute('id', obj.date);
  el.innerHTML = `<div class="ticket-main"">
                    ${obj.nums.map(e =>
                    `<div class='num ticket-num'>
                      <span class='num-cont'>${e}<span/>
                     </div>`).join('')}
                  </div>
                  <div class="ticket-info">
                    <div class="ticket-info-box">
                      <p>uplata: ${obj.pay} rsd</p>
                      <p>isplata: ${obj.win} rsd</p>
                    </div>
                    <div class="ticket-btn">
                      <span class="ticket-btn-inner"></span>
                      <span class="ticket-btn-inner"></span>
                    </div>
                  </div>`;

  allTicketsElement.insertBefore(el, allTicketsElement.firstChild);
  if(allTickets.length >= 5) startGameButton.classList.remove('inactive');
};

// UPDATE CURRENT TICKET
const updateCurrTicket = arr => {
  let pattern = '';

  arr.forEach(e => 
    pattern +=`<span class="curr-num">
                ${e !== arr[arr.length - 1] ? e + ',' : e + ''}
              </span>`);

  arr.length ? currTicketElement.style.display = 'block' : currTicketElement.style.display = 'none';
  currTicketInputAmount.focus();
  currTicketNumsElements.innerHTML = pattern;

  updateCurrAmount();
};

// UPDATE CURRENT TICKET AMOUNTS
const updateCurrAmount = () => {
  inputAmount = parseInt(currTicketInputAmount.value, 10);
  inputAmount = isNaN(inputAmount) ? '' : inputAmount;
  winAmount = inputAmount * ticketNums.length * ticketNums.length * 2;
  currTicketInputAmount.value = inputAmount;
  currTicketInputWin.innerHTML = winAmount;
  if(ticketNums.length && inputAmount) addTicketButton.classList.remove('inactive')
  else addTicketButton.classList.add('inactive')
};

// LISTEN FOR NUMBER PICK & BUILD NUMBERS ARRAY
pickNumElements.forEach(item =>
  item.addEventListener('click', function () {
    if(gameOn) return;
    const num = parseInt(this.textContent);
    const index = ticketNums.indexOf(num);

    // Check if num is allready picked
    if (index !== -1) ticketNums.splice(index, 1);
    else if (ticketNums.length > 4) return;
    else ticketNums.push(num);

    this.classList.toggle('num-selected');
    updateCurrTicket(ticketNums);
  })
);

// LISTEN FOR CURRENT TICKET AMOUNT INPUT
currTicketInputAmount.addEventListener('input', updateCurrAmount);

// LISTE FOR ADD TICKET
addTicketButton.addEventListener('click', function () {
  if (!ticketNums.length || !inputAmount) return currTicketInputAmount.focus();

  allTickets.push(new Ticket(ticketNums, inputAmount, winAmount));

  // Reset values
  ticketNums = [];
  currTicketInputAmount.value = '';
  pickNumElements.forEach(e => e.classList.remove('num-selected'));

  addTicket(allTickets);

  currTicketElement.style.display = 'none';
  addTicketButton.classList.add('inactive')
});

// LISTEN FOR TICKET REMOVE
document.addEventListener('click', function (e) {
  if(!gameOn){
    if (e.target && e.target.classList.contains('ticket-btn')) {
      const el = e.target.parentNode.parentNode;
      const index = allTickets.findIndex(e => e.date == el.id);
      allTickets.splice(index, 1);
      el.remove();
    } else if (e.target && e.target.parentNode.classList.contains('ticket-btn')) {
      const el = e.target.parentNode.parentNode.parentNode;
      const index = allTickets.findIndex(e => e.date == el.id);
      allTickets.splice(index, 1);
      el.remove();
    } 
  }
  if(allTickets.length < 5) startGameButton.classList.add('inactive');
});

// LISTEN FOR START GAME
startGameButton.addEventListener('click', function () {
  if (allTickets.length >= 5 && !gameOn) {
    drawNumbers();
    rules01Element.style.display = 'none';
    intervalID = setInterval(drawNumbers, 2000);
    gameOn = true;

    // reset values
    ticketNums = [];
    currTicketInputAmount.value = '';
    pickNumElements.forEach(e => e.classList.remove('num-selected'));
    currTicketElement.style.display = 'none';
    addTicketButton.classList.add('inactive')
  };
});

// LISTEN FOR RESET
resetButton.addEventListener('click', reset);
