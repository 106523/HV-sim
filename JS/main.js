//variables the main function will be dealing (eg. speed) with NEED to be global. 
//Perhaps I will optimise the debug ui text thing, make it NON global, just easier to use a global for now.
var DebugUItext
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
  //grab some basic input
  //get accelerator slider value
  let AcceleratorRaw = document.getElementById("Accelerator");
  // const timestamp = Date.now();
  //checks how long each step is so the program can compensate for execution speeds
  StepTime = Date.now()-lastTimestamp
  lastTimestamp = Date.now();
  //prototype, prints to #header
  DebugText("AcceleratorRaw:" + AcceleratorRaw.value, 0);
  DebugText("Steptime:" + StepTime, 1);
  
  
}
//prototype HTML text adder
function DebugText(TextInput, Flush) {
  DebugUItext = DebugUItext + ("\n" + TextInput);
  if (Flush == 1) {
    document.querySelector('#header').innerHTML = DebugUItext
    DebugUItext = ""
  }
}
