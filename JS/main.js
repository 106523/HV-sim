//variables the main function will be dealing (eg. speed) with NEED to be global. 
//Perhaps I will optimise the debug ui text thing, make it NON global, just easier to use a global for now.
//okay so the whole AP thing needs some lists, perhaps I could make some "CAN bus" like system, will need to have some decoder rings

var F_CAN = {
  "Speed" : 0,
  "MG1RPM" : 0,
  "TorqueDemand" : 0,
  "StepTime" : 0,
  "MG1TorqueOutput" : 0,
  "EngineTorqueOutput" : 0,
  "MG1TorqueLimit" : 0,
  "RegenAvalibleTorque" : 0,
  "HVSOC" : 0,
  "FrictionBrakeDemand" : 0,
  "HVMode" : 0,
  "LockUpClutch" : 0,
  "EngineGeneration" : 0,
  "EngineRPM" : 0,


}
//set max brake torque
const MaxBrakeTorque = 1000;
var DebugUItext = "";
//powertrain variables
F_CAN.Speed = 0;
const BatteryMaxPowerDraw = 100000;
//Timer variables
let lastTimestamp = 0; 

setInterval(function(){Main(); }, 1);
function Main() {
  //grab some basic input
  //get accelerator slider value
  const TorqueValues = MainTorquePoll(document.getElementById("Accelerator"), F_CAN.Speed, F_CAN.EngineGeneration);
  F_CAN.TorqueDemand = TorqueValues.TorqueDemand;
  F_CAN.MG1TorqueLimit = TorqueValues.MG1TorqueLimit;
  // const timestamp = Date.now();
  //checks how long each step is so the program can compensate for execution speeds
  F_CAN.StepTime = Date.now() - lastTimestamp;
  lastTimestamp = Date.now();
  //prototype, prints to #header
  DebugText("Steptime:" + F_CAN.StepTime, 1);
  //brake override function
  if(BrakePedal > 0){
    const BrakeDemand = MaxBrakeTorque * (BrakePedal / 100);
    //call the whole brake handler thingy
    const BrakeVars = brakecontrol(BrakeDemand, F_CAN.HVSOC, F_CAN.RegenAvalibleTorque);
    F_CAN.FrictionBrakeDemand = BrakeVars.FrictionBrakeDemand;
    F_CAN.MG1TorqueOutput = BrakeVars.MG1TorqueOutput;
  } else {
    //start deciding what to do to make the car go vroom!
    //make sure the car isnt fighting against the brakes
    F_CAN.FrictionBrakeDemand = 0;
    if (F_CAN.HVMode === 1) {
      //operating mode as a hybrid
      if (condition) {
        //operating mode in the event of a criticaly low battery
        F_CAN.LockUpClutch = 0;
        F_CAN.EngineGeneration = 76.8;
      } else {
        //standard operating mode
      }
    } else {
      //run as an EV
      EVMode();
    }
  }
}
//prototype HTML text adder
function DebugText(TextInput, Flush) {
  DebugUItext = DebugUItext + ("\n" + TextInput);
  if (Flush === 1) {
    document.querySelector('#header').innerHTML = DebugUItext
    DebugUItext = ""
  }
}
//EV drive mode
function EVMode() {
  //Pure EV Mode
  //Dont call the engine ECU to save resources
  //let everything else know the engine isnt doing shit
  F_CAN.EngineTorqueOutput = 0;
  F_CAN.EngineRPM = 0;
  F_CAN.EngineGeneration = 0;
  //why the FUCK did I make MG1Torquelimit an absolute? Did it ever go into the NEGATIVE range for god knows what reason?!
  if (F_CAN.TorqueDemand >= Math.abs(F_CAN.MG1TorqueLimit)) {
      F_CAN.MG1TorqueOutput = F_CAN.MG1TorqueLimit;
    } else {
      F_CAN.MG1TorqueOutput = F_CAN.TorqueDemand;
    }
}
