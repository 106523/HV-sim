//this entire thing could be made multithreaded, would be intresting to try.




//when main torque poll is run it should run the MG1 torque calculation as well.
//Accelerator Pedal to Torque
function MainTorquePoll(AcceleratorRaw, Speed, EngineGeneration) {
  //MG1 RPM Calculation
  const MG1RPM = Speed * 130;
  //MG1 Torque calculation
  //Calculate MG1 Torque limit
  //why the fuck did I have a seperate KW calculator again if this does the same thing?!
  //could use some math.min thing here isnted of an if statement
  if ((9.5488 * (EngineGeneration + BatteryMaxPowerDraw)) / MG1RPM <= 314) {
    var MG1TorqueLimit = (9.5488 * (EngineGeneration + BatteryMaxPowerDraw)) / MG1RPM;
  } else {
    var MG1TorqueLimit = 314;
  }
  if ((9.5488 * 134972) / MG1RPM <= 314) {
    var MG1Torque = (9.5488 * 134972) / MG1RPM;
  } else {
    var MG1Torque = 314;
  }
  //Return the Torque Demand
  return {
    'TorqueDemand': MG1Torque * (AcceleratorRaw / 100),
    'MG1TorqueLimit': MG1TorqueLimit
  };
}

//Lots of independent functions, will be combined into a more efficent blob at some point
//might feed some vars right up the asshole of this function, or I might just use a list.
function WheelTorquePoll(MG1TorqueOutput, EngineTorqueOutput, FrictionBrakeDemand) {
  //call the rolling resistance calculator
  const Resistance = RollingResistanceCalc();
  //Overall Toruqe output
  const CountershaftTorque = MG1TorqueOutput + EngineTorqueOutput;
  //Countershaft Torque to Wheel Torque
  return Math.round(((CountershaftTorque + FrictionBrakeDemand * -1) * (FinalDrive * MotorCountershaft)) - Resistance);
}



//should be faster to keep the regen torque calculate subsystem seperate from the main MG1 torque calculator
//Regen Torque Calculation
function RegenAvalibleTorquePoll() {
  //THIS IS ALSO A GODAWFUL BROKEN HACK I HOPE IT WORKS
  return Math.max(0, MG1Torque - 350 / (MG1RPM / 500));
}

//engine ecu code here
