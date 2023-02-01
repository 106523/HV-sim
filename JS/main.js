//variables the main function will be dealing (eg. speed) with NEED to be global. 
//Perhaps I will optimise the debug ui text thing, make it NON global, just easier to use a global for now.
//okay so the whole AP thing needs some lists, perhaps I could make some "CAN bus" like system, will need to have some decoder rings

//uninitialized variables BE GONE!!!!! EVERYTHING THAT WILL EVER BE WILL ALWAYS BE SINCE ALWAYS, NEVER AGAIN WILL WE HAVE TO FEAR THE UNDEFINED VARIABLE!!!
var F_CAN = {
  "Speed" : 0,
  "MG1RPM" : 0,
  "TorqueDemand" : 0,
  "StepTime" : 0,
  "MG1TorqueOutput" : 0,
  "EngineTorqueOutput" : 0,
  "MG1TorqueLimit" : 0,
  "MG1Torque" : 0,
  "RegenAvalibleTorque" : 0,
  "HVSOC" : 0,
  "FrictionBrakeDemand" : 0,
  "HVMode" : 0,
  "LockUpClutch" : 0,
  "EngineGeneration" : 0,
  "EngineRPM" : 0,
  "WheelTorque" : 0,
};
//set max brake torque
const MaxBrakeTorque = 1000;
var DebugUItext = "";
//powertrain variables
F_CAN.Speed = 0;
const BatteryMaxPowerDraw = 100000;
//Timer variables
let lastTimestamp = 0; 
//misc variables
//2.23694 is the number you use to convert KMH to MPH
const TireRadius = 0.3429;
const WeightKG = 1841;

setInterval(function(){Main(); }, 100);
function Main() {
  //grab some basic input
  //get brake slider value
  const BrakePedal = document.getElementById("brakePedal").value;
  //get accelerator slider value
  MainTorquePoll(document.getElementById("Accelerator"), F_CAN.Speed, F_CAN.EngineGeneration);
 
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
      if (F_CAN.HVSOC >= 10) {
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
  F_CAN.WheelTorque = WheelTorquePoll();
  acelcalc();
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

//torque calculation
//this entire thing could be made multithreaded, would be intresting to try.
//when main torque poll is run it should run the MG1 torque calculation as well.
//Accelerator Pedal to Torque
function MainTorquePoll(AcceleratorRaw) {
  //MG1 RPM Calculation
  F_CAN.MG1RPM = F_CAN.Speed * 130;
  //MG1 Torque calculation
  //Calculate MG1 Torque limit
  //why the fuck did I have a seperate KW calculator again if this does the same thing?!
  //could use some math.min thing here isnted of an if statement
  if ((9.5488 * (F_CAN.EngineGeneration + BatteryMaxPowerDraw)) / F_CAN.MG1RPM <= 314) {
    F_CAN.MG1TorqueLimit = (9.5488 * (F_CAN.EngineGeneration + BatteryMaxPowerDraw)) / F_CAN.MG1RPM;
  } else {
    F_CAN.MG1TorqueLimit = 314;
  }
  if ((9.5488 * 134972) / F_CAN.MG1RPM <= 314) {
    F_CAN.MG1Torque = (9.5488 * 134972) / F_CAN.MG1RPM;
  } else {
    F_CAN.MG1Torque = 314;
  }
  F_CAN.TorqueDemand = F_CAN.MG1Torque * (AcceleratorRaw / 100);
}

//Lots of independent functions, will be combined into a more efficent blob at some point
//might feed some vars right up the asshole of this function, or I might just use a list.
function WheelTorquePoll() {
  //call the rolling resistance calculator
  const Resistance = RollingResistanceCalc();
  //Overall Toruqe output
  const CountershaftTorque = F_CAN.MG1TorqueOutput + F_CAN.EngineTorqueOutput;
  //Countershaft Torque to Wheel Torque
  return Math.round(((CountershaftTorque + F_CAN.FrictionBrakeDemand * -1) * (FinalDrive * MotorCountershaft)) - Resistance);
}



//should be faster to keep the regen torque calculate subsystem seperate from the main MG1 torque calculator
//Regen Torque Calculation
function RegenAvalibleTorquePoll() {
  //THIS IS ALSO A GODAWFUL BROKEN HACK I HOPE IT WORKS
  return Math.max(0, F_CAN.MG1Torque - 350 / (F_CAN.MG1RPM / 500));
}

//acceleration calculation

function acelcalc() {
    //wheel torque to newtons
    const Newtons = F_CAN.WheelTorque / TireRadius;
    //calculate the acceleration (still need to find out what unit of acceleration it is but as long as it works)
    const Acceleration = Newtons / WeightKG;
    //calculate the speed change over time due to acceleration (the greeks called it delta so im going to call it that too because it sounds cool)
    const DeltaSpeed = (Acceleration * (F_CAN.StepTime / 1000)) * 2.23694;
    //set the speed, and set speed to 0 if it is negative to prevent the program from shiting itself.
    F_CAN.Speed = Math.max(0, F_CAN.Speed + DeltaSpeed);
}
//engine ecu code here