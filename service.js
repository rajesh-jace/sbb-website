// let a=10

const { log } = require("console");

// let b=a--

// console.log(a);
// console.log(b)

// //Write a function that demonstrates variable shadowing with let and var. Predict the output and explain the scope differences.
// function variableShadowing() {
//     let a = 10;
//     if (true) {
//       let a = 20;
//       var b = 30;
//       console.log(a); // ?
//     }
//     console.log(a); // ?
//     console.log(b); // ?
//   }
//   variableShadowing();

// //Problem: Function vs. Variable Hoisting
// console.log(foo); // ?
// var foo = 'Hello';
// console.log(foo); // ?

// console.log(bar()); // ?
// function bar() {
//   return 'Hi';
// }

// //closure
// function createCounter() {
//     let count = 0;
//     return function () {
//       count++;
//       return count;
//     };
//   }

//   const counter = createCounter();
//   console.log(counter()); // 1
//   console.log(counter()); // 2
//   console.log(counter()); // 3

// //promise
// function delayedMessage(message) {
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(message), 2000);
//     });
//   }

//   delayedMessage('Hello, World!').then(console.log); // Output: Hello, World!

// // Event Loop
// console.log('Start');
// setTimeout(() => console.log('Timeout'), 0);
// Promise.resolve().then(() => console.log('Promise'));
// console.log('End');

// //string reverse
// function isPalindrome(str) {
//     return str === str.split('').reverse().join('');
//   }

//   console.log(isPalindrome('racecar')); // true
//   console.log(isPalindrome('hello'));   // false

//   //deep clone of an object
//   function deepClone(obj) {
//     return JSON.parse(JSON.stringify(obj));
//   }

//   const original = { a: 1, b: { c: 2 } };
//   const clone = deepClone(original);
//   console.log(clone); // { a: 1, b: { c: 2 } }

// //debounce
// function debounce(fn, delay) {
//     let timer;
//     return function (...args) {
//       clearTimeout(timer);
//       timer = setTimeout(() => fn.apply(this, args), delay);
//     };
//   }

//   const search = debounce((query) => console.log('Searching for:', query), 500);
//   search('a');
//   search('ab');
//   search('abc'); // Only this call triggers the function after 500ms.

//   //throttle
//   function throttle(fn, limit) {
//     let lastCall = 0;
//     return function (...args) {
//       const now = Date.now();
//       if (now - lastCall >= limit) {
//         lastCall = now;
//         fn.apply(this, args);
//       }
//     };
//   }

//   window.addEventListener('scroll', throttle(() => {
//     console.log('Scroll event triggered');
//   }, 200));

//Commonality:

// Both use closures to maintain state between function calls.
// In createCounter, the variable count is remembered and updated.
// In debounce, the variable timer is remembered and updated.
// Key Difference:
// State Purpose:

// In createCounter, the state (count) tracks how many times the function has been called.
// In debounce, the state (timer) controls the timing of when the provided function (fn) executes.
// Behavior:

// createCounter modifies count on every call.
// debounce resets the timer on every call to delay the execution of fn.
// Conclusion
// Both debounce and createCounter demonstrate closures:

// In createCounter:

// The inner function remembers and manipulates the count variable each time it’s called.
// In debounce:

// The inner function remembers the timer variable to control the timing of fn.
// Why is this efficient?
// The closure ensures:

// Variables like count (in createCounter) and timer (in debounce) are not recreated on every function call.
// Instead, the same variables are accessed and updated, improving efficiency and preserving state

// //two sum problem using map method of inserting key and value and get the value using key///////////////////////////////////////////////////////////////////////////

// function twoSum(nums, target) {
//     const map = new Map();
//     for (let i = 0; i < nums.length; i++) {
//         const complement = target - nums[i];
//       if (map.has(complement)) {
//         return [map.get(complement), i];
//       }
//       map.set(nums[i], i);
//     }
//     return [];
//   }

//   console.log(twoSum([2, 7, 11, 15], 22)); // [0, 1]

// //first non repeating character
// function firstNonRepeatingChar(str) {
//     const count = {};
//     for (let char of str) {
//       if(count[char]){
//         count[char]++
//       }else{
//         count[char]=1
//       }
//     }
//     for (let char of str) {
//       if (count[char] === 1) {
//         return char;
//       }
//     }
//     return null;
//   }

//   console.log(firstNonRepeatingChar("swiss")); // "w"

//   //fizzbuzz
//   function fizzBuzz() {
//     for (let i = 1; i <= 100; i++) {
//       if (i % 3 === 0 && i % 5 === 0) {
//         console.log("FizzBuzz");
//       } else if (i % 3 === 0) {
//         console.log("Fizz");
//       } else if (i % 5 === 0) {
//         console.log("Buzz");
//       } else {
//         console.log(i);
//       }
//     }
//   }

//   fizzBuzz();

//   //rotate an array
//   function rotate(nums, k) {
//     k %= nums.length; // Handle cases where k > nums.length
//     nums.unshift(...nums.splice(nums.length - k));
//   }

//   const nums = [1, 2, 3, 4, 5, 6, 7];
//   rotate(nums, 3);
//   console.log(nums); // [5, 6, 7, 1, 2, 3, 4]

// //find majority element
//   function majorityElement(nums) {
//   let count = 0, candidate = null;

//   for (let num of nums) {
//     if (count === 0) candidate = num;
//     count += (num === candidate ? 1 : -1);
//   }

//   return candidate;
// }

// console.log(majorityElement([3, 2, 3])); // 3

// let a = 10;
// let b = a;
// let c = "rajesh";
// let d = c;
// c = "raghu";
// a = 20;

// console.log(a);
// console.log(b);
// console.log(c);
// console.log(d);

// const e = { name: "rajesh", age: 28 };
// const f = e;

// f.name = "suresh";

// console.log(e);
// console.log(f);

// let g = "rajesh";
// let h = "rajesh";

// console.log(g == h);

// let i = {};
// let j = {};
// console.log(i == j);

// let var1 = {
//   name: "rajesh",
//   age: 27,
// };

// let var2 = var1;

// var1 = null;

// var2.sayHi = function () {
//   console.log(`hi from ${this.name}`);
// };

// var2.sayHi();
// console.log(var2["name"]);

///////////////////////////////////////////////////////

// try {
//   // Code that might throw an error
//   let result = 10 /0;
//   console.log(result);
// } catch (error) {
//   // Handle the error
//   console.error("An error occurred:", error.message);
// } finally {
//   // Code that will execute regardless of an error
//   console.log("Execution complete.");
// }

// function validateAge(age) {
//   if (age < 18) {
//     throw new Error("Age must be at least 18.");
//   }
//   console.log("Age is valid.");
// }

// try {
//   validateAge(15);
// } catch (error) {
//   console.error(error.message);
// }
/////////////////////////////////////////////////////////////////////////////////
// let out = "";

// for (let i = 0; i < 10; i++) {

//   let temp=(i*2)-1
//   for (let j = 0; j < temp; j++) {
//     out = out + i+" ";
//   }
//   out=out + "\n"
// }
// console.log(out);

// let outs = "";

// for (let i = 0; i < 10; i++) {
//   for (let j = 0; j < i; j++) {
//     outs = outs + " ";
//   }
//   for (let k = i; k < 10; k++) {
//     outs = outs + "*";
//   }
//   outs = outs + "\n";
// }

// console.log(outs);

///////////////////////////////////////////////////////////////
// let outs = "";

// for (let i = 9; i >0; i--) {

//   temp=(i*2)-1
//   for (let j = 0; j < i; j++) {
//     outs = outs + " ";
//   }
//   for (let k = temp; k < 18; k++) {
//     outs = outs + "*";
//   }
//   outs = outs + "\n";
// }

// console.log(outs);

function pattern(input) {
  let outs = "";

  for (let i = input - 1; i > 0; i--) {
    temp = i * 2 - 1;
    for (let j = 0; j < i; j++) {
      outs = outs + "  ";
    }
    for (let k = temp; k <= (input - 1) * 2 - 1; k++) {
      outs = outs + "* ";
    }
    outs = outs + "\n";
  }

  for (let i = input; i > 0; i--) {
    for (let j = i; j < input; j++) {
      outs = outs + "  ";
    }
    let temp = i * 2 - 1;
    for (let k = 0; k < temp; k++) {
      outs = outs + "* ";
    }
    outs = outs + "\n";
  }

  console.log(outs);
}

pattern(5);
