//this entire thing could be made multithreaded, would be intresting to try.



let MG1Torque = 0;


//when main torque poll is run it should run the MG1 torque calculation as well.
//Accelerator Pedal to Torque
function MainTorquePoll(AcceleratorRaw) {
  //MG1 RPM Calculation
  F_CAN[9] = F_CAN[0] * 130;
  //MG1 Torque calculation
  //Calculate MG1 Torque limit
  //why the fuck did I have a seperate KW calculator again if this does the same thing?!
  //could use some math.min thing here isnted of an if statement
  if ((9.5488 * (F_CAN[10] + BatteryMaxPowerDraw)) / F_CAN[9] <= 314) {
    F_CAN[4] = (9.5488 * (F_CAN[10] + BatteryMaxPowerDraw)) / F_CAN[9];
  } else {
    F_CAN[4] = 314;
  }
  if ((9.5488 * 134972) / F_CAN[9] <= 314) {
    MG1Torque = (9.5488 * 134972) / F_CAN[9];
  } else {
    MG1Torque = 314;
  }
  //Return the Torque Demand
  return MG1Torque * (AcceleratorRaw / 100);
}

//Lots of independent functions, will be combined into a more efficent blob at some point
//might feed some vars right up the asshole of this function, or I might just use a list.
function WheelTorquePoll() {
  //call the rolling resistance calculator
  const Resistance = RollingResistanceCalc();
  //Overall Toruqe output
  const CountershaftTorque = F_CAN[6] + EngineTorqueOutput;
  //Countershaft Torque to Wheel Torque
  F_CAN[7] = Math.round(((CountershaftTorque + FrictionBrakeDemand * -1) * (FinalDrive * MotorCountershaft)) - Resistance);
}



//should be faster to keep the regen torque calculate subsystem seperate from the main MG1 torque calculator
//Regen Torque Calculation
function RegenAvalibleTorquePoll() {
  //THIS IS ALSO A GODAWFUL BROKEN HACK I HOPE IT WORKS
  F_CAN[1] = Math.max(0, MG1Torque - 350 / (F_CAN[9] / 500));
}

//engine ecu code here
