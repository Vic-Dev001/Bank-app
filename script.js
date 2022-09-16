'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const userDeletedPopUp = document.querySelector('.pop-up');
const loginInfo = document.querySelector('.account-details');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movement, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movement;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
            <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          
          <div class="movements__value">${mov} €</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// display balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, move) => acc + move, 0);

  return (labelBalance.textContent = `${acc.balance} €`);
};

const calcDisplaySummary = function (acc) {
  const summaryDeposit = acc.movements
    .filter(mov => mov > 0)
    .reduce((acum, mov) => acum + mov, 0);
  labelSumIn.textContent = `${summaryDeposit} €`;
  const summaryWithdrawal = acc.movements
    .filter(mov => mov < 0)
    .reduce((acum, mov) => acum + mov, 0);
  labelSumOut.textContent = `${Math.abs(summaryWithdrawal)} €`;

  const interestRate = acc.movements
    .filter(mov => mov > 0)
    .map(deposits => (deposits * acc.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${Math.abs(interestRate)} €`;
};

// computing username function for the accounts

const createUsernames = function (acct) {
  acct.forEach(accts => {
    accts.username = accts.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
  return acct;
};

createUsernames(accounts);
const updateUI = function (acc) {
  //display balance
  calcDisplayBalance(acc);
  // display movements
  displayMovements(acc.movements);
  // display summary and interest rates dynamically
  calcDisplaySummary(acc);
};
/////////////////////////////////////////////////

// Add event listeners
// Login
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // prevents default reload function from a form submit button
  e.preventDefault();
  currentAccount = accounts.find(acc => {
    return inputLoginUsername.value === acc.username;
  });
  // th ? conatains the whole elements in the objects. so if the pin is in the object, it returns the functions
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // update User interface
    updateUI(currentAccount);
    // reveal app
    containerApp.style.opacity = 1;
    // reveal welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    loginInfo.style.display = 'none';
  }
  // conditon if accountis deleted
  if (currentAccount !== accounts.username) {
    console.log('user');
  } else {
    // alert('User account not found');
    userDeletedPopUp.style.opacity = 1;
    setTimeout(function () {
      userDeletedPopUp.style.opacity = 0;
    }, 2000);
  }
});
// impelemting Request Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  } else {
    console.log('error');
  }
  inputLoanAmount.value = '';
});

// Implementing the transfers
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);

  // creating the condition for transfers
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    currentAccount?.username !== currentAccount
  ) {
    receiverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);
    updateUI(currentAccount);
  } else {
    console.log('error');
  }
  inputTransferTo.value = inputTransferAmount.value = '';
});
// user delete account function

// Delete Acoounts
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const userClose = accounts.find(
    acc => acc.username === inputCloseUsername.value
  );
  const userPIn = accounts.find(acc => acc.pin === Number(inputClosePin.value));

  if (
    currentAccount?.username === userClose.username &&
    currentAccount?.pin === userPIn.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //deletes acount
    accounts.splice(index, 1);
    // clear fields
    inputCloseUsername.value = inputClosePin.value = '';
    // Logs you out
    containerApp.style.opacity = 0;
  } else {
    console.log('error');
  }
});
// sorting the movements
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
// Sorting the accounts movements

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////

//Simple Array Methods
// Slice
// extarcs the part and returns a new array, Doesn't mutate the array
// let arr = ['a', 'b', 'c', 'd', 'e'];
// console.log(arr.slice(1, 4));

// splice // deletes the part of the extraccted
// console.log(arr.splice(1, 2));
// console.log(arr);

// reverse
// rearange an array from right to left. Murates the array
// const arr2 = ['j', 'i', 'h', 'g', 'f'];

// console.log(arr2.reverse());

// concat
// adds arrays together. Mutates the array

// console.log(arr.concat(arr2));

// using the spread operator doesn't muate the array
// console.log([...arr, ...arr2]);

// const joinedArr = arr2.join('-');
// console.log(joinedArr);
// console.log(arr2);

// the foreach method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// the foroff method first
// for (const [i, moves] of movements.entries()) {
//   if (moves > 0) {
//     console.log(`User ${i + 1} You deposited ${moves}`);
//   } else {
//     console.log(`User ${i + 1} you withdrew ${Math.abs(moves)}`); // Math.abs removes any sign attached to numeber
//   }
// }

// foreach
// console.log('---- FOREACH----');
// movements.forEach((moves, i) => {
// if (moves > 0) {
//   console.log(`User ${i + 1} You deposited ${moves}`);
// } else {
//   console.log(`User ${i + 1} you withdrew ${Math.abs(moves)}`); // Math.abs removes any sign attached to numeber
//   }
// });

//  0: (200) at position 0, the element becomes the parameter
//  1: (450) at position 1, the element becomes the parameter etc

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach((value, keys, map) => {
//   console.log(`${keys}: ${value}`);
// });

// const currencyUnique = new Set(['USD', 'USD', 'EUR', 'GBP', 'EUR', 'GBP']);

// currencyUnique.forEach(function (value, _, map) {
//   console.log(`${value}: ${value}`);
// }); // in the _(underscore ) is used to assign an irrelevant variable

//////////////////////////////////////////

// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// const JuliaData = [3, 5, 2, 12, 7];
// const KateData = [4, 1, 15, 8, 3];

// const checkDogs = function (dogsJulia, dogsKate) {
//   const removeCatAges = dogsJulia.slice(1, 3);
//   console.log(removeCatAges);
//   const corrected = removeCatAges.concat(dogsKate);
//   corrected.forEach(function (val, i) {
//     if (val >= 3) {
//       console.log(`Dog number ${i + 1} is an adult, and is ${val} years old`);
//     } else {
//       console.log(`Dog number ${i + 1} is still a puppy 🐶`);
//     }
//   });
// };
// checkDogs(JuliaData, KateData);

// map // this loops over the array and returns the specified into a new array
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUSD = 1.1;
// const movementToUsD = movements.map(mov => mov * eurToUSD);
// console.log(movementToUsD);

// using the for off loop
// const movementToUsD = [];
// for (const mov of movements) {
//   movementToUsD.push(mov * eurToUSD);
// }
// console.log(movementToUsD);

// using the Filter method
// const deposits = movements.filter(move => move > 0);

// const withdrawals = movements.filter(move => move < 0);

// using the for off lopp
// const depositsFor = [];
// for (const move of movements) {
//   if (move > 0) depositsFor.push(move);
// }
// console.log(deposits);
// console.log(withdrawals);
// console.log(depositsFor);

// using the reduce method
// balance
// const balance = movements.reduce((acc, curr) => acc + curr, 0);

// console.log(balance);
// maximum value
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) {
//     return acc;
//   } else {
//     return mov;
//   }
// });
// console.log(max);

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// Solutions
// const calcAverageHumanAge = function (ages) {
//   const humanToDogAge = ages.map(function (dogAge) {
//     let humanAge = 0;
//     if (dogAge <= 2) {
//       return (humanAge = 2 * dogAge);
//     } else {
//       return (humanAge = 16 + dogAge * 4);
//     }
//   });
//   const adults = humanToDogAge.filter(age => age >= 18);
//   console.log(adults);
//   const averageHuman = adults.reduce(function (acc, human, i, arr) {
//     return acc + human / arr.length;
//   }, 0);
//   console.log(averageHuman);
// };
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// const eurToUSD = 1.1;
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map((mov, i, arr) => {
//     // console.log(arr);
//     return mov * eurToUSD;
//   })
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

///////////////////////////////////////
// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// Solutions
// const calcAverageHumanAge = function (ages) {
//   const humanToDogAge = ages.map(function (dogAge) {
//     let humanAge = 0;
//     if (dogAge <= 2) {
//       return (humanAge = 2 * dogAge);
//     } else {
//       return (humanAge = 16 + dogAge * 4);
//     }
//   });
//   const adults = humanToDogAge.filter(age => age >= 18);
//   console.log(adults);
//   const averageHuman = adults.reduce(function (acc, human, i, arr) {
//     return acc + human / arr.length;
//   }, 0);
//   console.log(averageHuman);
// };

// const calcAverageHumanAgeArrow = ages => {
//   return ages
//     .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, human, i, arr) => {
// console.log(acc + human / arr.length);
//       return acc + human / arr.length;
//     }, 0);
// };
// const avg3 = calcAverageHumanAgeArrow([5, 2, 4, 1, 15, 8, 3]);
// console.log(avg3);

// the find method
// const firstWithdrawal = movements.find(move => move < 0);

// console.log(movements);
// console.log(firstWithdrawal);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);
// console.log(accounts);

// using the for off loop

// const accountfor = [];

// for (const [i, acc] of accounts.entries()) {
//   accountfor.push(acc.owner === ' Jessica Davis');
// }
// console.log(accountfor);
// equality
// console.log(movements.includes(movements - 130));

// conditions some
// const deposits = movements.some(mov => mov > 0);
// console.log(deposits);
// every
// console.log(movements.every(mov => mov > 0));

// Flat
// const arr = [1, 2, 3, [4, 5, 6], [7, 8, 9]];
// const allarr = arr.flat();
// console.log(allarr);
// const allarr2 = [1, 2, 3, [4, 5, 6, [7, 8, 9], [10, 11]]];
// const allarrDeep = allarr2.flat(2);
// console.log(allarrDeep);

// adding all trhe movemnts in the acounts
// using flat

// const allMovements = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(allMovements);
// using the flat map method
// const allMovements2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(allMovements2);

// Sorting
// strings
const owners = ['jonas', 'Victor', 'Adam', 'Martha'];
console.log(owners);

owners.sort();
console.log(owners);

// Numbers
// Accending order
movements.sort((a, b) => {
  // if (a > b) return 1;
  // if (a < b) return -1;

  return a - b;
});
// decending order

movements.sort((a, b) => b - a);
console.log(movements);
