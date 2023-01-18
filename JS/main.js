//variables the main function will be dealing (eg. speed) with NEED to be global. 
//Perhaps I will optimise the debug ui text thing, make it NON global, just easier to use a global for now.
//might be a good idea to just send the vars spitted out by the torque calculate module to bypass having some vars just floating around in the HV/EV controller. 
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
  //rewrite the whole brake handling/mode select
  if(BrakePedal > 0){
    let MaxBrakeTorque = 1000;
    let BrakeDemand = MaxBrakeTorque * (BrakePedal / 100);
    //call the whole brake handler thingy
  } else {
    
  }
  
  
}
//prototype HTML text adder
function DebugText(TextInput, Flush) {
  DebugUItext = DebugUItext + ("\n" + TextInput);
  if (Flush == 1) {
    document.querySelector('#header').innerHTML = DebugUItext
    DebugUItext = ""
  }
}

//EV drive mode
function EVMode(TorqueDemand, MG1TorqueLimit) {
  //Pure EV Mode
  //Dont call the engine ECU to save resources
  let EngineTorqueOutput = 0;
  let EngineGeneration = 0;
  let EngineRPM = 0;
  //why the FUCK did I make MG1Torquelimit an absolute? Did it ever go into the NEGATIVE range for god knows what reason?!
  if (TorqueDemand >= Math.abs(MG1TorqueLimit)) {
      MG1TorqueOutput = MG1TorqueLimit;
    } else {
      MG1TorqueOutput = TorqueDemand;
    }
  return MG1TorqueOutput;
  return EngineRPM;
  return EngineGeneration;
}
