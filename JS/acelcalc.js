//2.23694 is the number you use to convert KMH to MPH
const TireRadius = 0.3429;
const WeightKG = 1841;
function acelcalc(WheelTorque, Speed, StepTime) {
    //wheel torque to newtons
    const Newtons = WheelTorque / TireRadius;
    //calculate the acceleration (still need to find out what unit of acceleration it is but as long as it works)
    const Acceleration = Newtons / WeightKG;
    //calculate the speed change over time due to acceleration (the greeks called it delta so im going to call it that too because it sounds cool)
    const DeltaSpeed = (Acceleration * (StepTime / 1000)) * 2.23694;
    //set the speed, and set speed to 0 if it is negative to prevent the program from shiting itself.
    const Speed_2 = Math.max(0, Speed + DeltaSpeed);
    return Speed_2;
}
