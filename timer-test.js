
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


// Coding quiz challenge 
// view high scores - call back to robots?
// question up top, selectable answers, timer in the corner
// ends with your score
// asks for your initials
// !! displays your score in a list of high scores
// !! high scores is on another html page
// 75 seconds is fine
// no randomness to the questions necessary
// how to track the score is up to us
