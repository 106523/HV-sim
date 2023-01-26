//variables the main function will be dealing (eg. speed) with NEED to be global. 
//Perhaps I will optimise the debug ui text thing, make it NON global, just easier to use a global for now.
//okay so the whole AP thing needs some lists, perhaps I could make some "CAN bus" like system, will need to have some decoder rings
var F_CAN = [
  "0_Speed:",
  "1_RegenAvalibleTorque:",
  "2_BrakePedal:",
  "3_BrakeDemand:",
  "4_MG1TorqueLimit;",
  "5_TorqueDemand:",
  "6_MG1TorqueOutput:",
  "7_WheelTorque:",
  "8_StepTime:",
  "9_MG1RPM:",
  "10_EngineGeneration:",
  "11_EngineTorqueOutput:",
  "12_EngineRPM:",
  "13_FrictionBrakeDemand:",
  "14_HVSOC:",
  

];
var DebugUItext
//powertrain variables
F_CAN[0] = 0;
//Resistance variables
var BaseResistance = 200;
var ResistanceExponental = 1;
//Timer variables
let lastTimestamp = 0; 
var StepLastTime 

setInterval(function(){Main(); }, 1);
function Main() {
  //grab some basic input
  //get accelerator slider value
  F_CAN[5] = MainTorquePoll(document.getElementById("Accelerator"));
  // const timestamp = Date.now();
  //checks how long each step is so the program can compensate for execution speeds
  F_CAN[8] = Date.now()-lastTimestamp;
  lastTimestamp = Date.now();
  //prototype, prints to #header
  DebugText("AcceleratorRaw:" + F_CAN[1].value, 0);
  DebugText("Steptime:" + F_CAN[8], 1);
  //rewrite the whole brake handling/mode select
  if(BrakePedal > 0){
    let MaxBrakeTorque = 1000;
    F_CAN[3] = MaxBrakeTorque * (BrakePedal / 100);
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
function EVMode(TorqueDemand) {
  //Pure EV Mode
  //Dont call the engine ECU to save resources
  //let everything else know the engine isnt doing shit
  F_CAN[12] = 0;
  F_CAN[11] = 0;
  F_CAN[10] = 0;
  //why the FUCK did I make MG1Torquelimit an absolute? Did it ever go into the NEGATIVE range for god knows what reason?!
  if (TorqueDemand >= Math.abs(F_CAN[4])) {
      F_CAN[6] = F_CAN[4];
    } else {
      F_CAN[6] = TorqueDemand;
    }
}
