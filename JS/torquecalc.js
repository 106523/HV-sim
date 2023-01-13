










//Lots of independent functions, will be combined into a more efficent blob at some point
function WheelTorquePoll() {
  //Overall Toruqe output
  CountershaftTorque = MG1TorqueOutput + EngineTorqueOutput;
  //Countershaft Torque to Wheel Torque
  WheelTorque = Math.round(((CountershaftTorque + FrictionBrakeDemand * -1) * (FinalDrive * MotorCountershaft))- Resistance);
  TimingCounter = TimingCounter + 1;
}

//MG1 Torque calculation
function MG1TorqueCalculate() {
  //MG1 RPM Calculation
  MG1RPM = Speed * 130;
  //Calculate MG1 Torque limit
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
}
