let lastTimestamp = 0; 
var StepTime 
var StepLastTime 

setInterval(function(){RegularLoop(); }, 1);
function RegularLoop() {
  const timestamp = (Date.now());
  console.log(StepTime)
  console.log(timestamp)
  console.log(lastTimestamp)
  StepTime = timestamp-lastTimestamp
  lastTimestamp = timestamp;
}
