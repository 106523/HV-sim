//this entire thing could be made multithreaded, would be intresting to try.






//when main torque poll is run it should run the MG1 torque calculation as well.
//Accelerator Pedal to Torque
function MainTorquePoll() {
  //MG1 RPM Calculation
  MG1RPM = Speed * 130;
  //MG1 Torque calculation
  //Calculate MG1 Torque limit
  //why the fuck did I have a seperate KW calculator again if this does the same thing?!
  if (314 >= (9.5488 * (EngineGeneration + BatteryMaxPowerDraw)) / MG1RPM) {
    MG1TorqueLimit = (9.5488 * (EngineGeneration + BatteryMaxPowerDraw)) / MG1RPM;
  } else {
    MG1TorqueLimit = 314;
  }
  if (314 >= (9.5488 * 134972) / MG1RPM) {
    MG1Torque = (9.5488 * 134972) / MG1RPM;
  } else {
    MG1Torque = 314;
  }
  TorqueDemand = MG1Torque * (AcceleratorRaw / 100);
}

//Lots of independent functions, will be combined into a more efficent blob at some point
//might feed some vars right up the asshole of this function, or I might just use a list.
function WheelTorquePoll() {
  //Overall Toruqe output
  CountershaftTorque = MG1TorqueOutput + EngineTorqueOutput;
  //Countershaft Torque to Wheel Torque
  WheelTorque = Math.round(((CountershaftTorque + FrictionBrakeDemand * -1) * (FinalDrive * MotorCountershaft))- Resistance);
}



//should be faster to keep the regen torque calculate subsystem seperate from the main MG1 torque calculator
//Regen Torque Calculation
function RegenAvalibleTorquePoll() {
  //THIS IS ALSO A GODAWFUL BROKEN HACK I HOPE IT WORKS
  RegenAvalibleTorque = Math.max(0, MG1Torque - 350 / (MG1RPM / 500));
}

//engine ecu code here
