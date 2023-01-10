//variables the main function will be dealing (eg. speed) with NEED to be global. 

//powertrain variables
var speed = 0;
//Resistance variables
var BaseResistance = 200;
var ResistanceExponental = 1;
//Timer variables
let lastTimestamp = 0; 
var StepTime 
var StepLastTime 

setInterval(function(){Main(); }, 1);
function Main() {
  // const timestamp = Date.now();
  //checks how long each step is so the program can compensate for execution speeds
  StepTime = Date.now()-lastTimestamp
  lastTimestamp = Date.now();
  //prototype, prints to #header
  document.querySelector('#header').innerHTML = AddText("Steptime:" + StepTime);
  //prototype debug section
}
//prototype HTML text adder
function AddText(AddTextInput) {
  let DebugUItext = "Debug";
  DebugUItext = DebugUItext + ("\n" + AddTextInput);
  return DebugUItext
}
