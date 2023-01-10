let lastTimestamp = 0; 
var StepTime 
var StepLastTime 

setInterval(function(){RegularLoop(); }, 1);
function RegularLoop() {
  // const timestamp = Date.now();
  //checks how long each step is so the program can compensate for execution speeds
  console.log(StepTime)
  StepTime = Date.now()-lastTimestamp
  lastTimestamp = Date.now();
}
