var StepTime
var StepLastTime = getTime();




setInterval(function(){RegularLoop(); }, 1);

function RegularLoop() {
  //Calculate the step time to compensate for lag/slowdowns
  StepTime = getTime() - StepLastTime;
  StepLastTime = getTime();
  
  
}
