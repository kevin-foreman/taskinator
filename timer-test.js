
// call back function to create an interval timer (Set Interval)
var counter = 10
var countdown = function() {
    console.log(counter);
    counter--;
     if(counter === 0){
         console.log("blastoff");
         clearInterval(startCountdown);
     };
};

var startCountdown = setInterval(countdown, 1000);

////////////////////////


// call back function to create a countdown timer (Set Timeout)
var sayHello = function() {
    console.log("Hello there")
};

var timedGreeting = setTimeout(sayHello, 2000);
// use this to prevent it from happening at all
clearTimeout(timedGreeting);