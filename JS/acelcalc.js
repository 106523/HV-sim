//2.23694 is the number you use to convert KMH to MPH
const TireRadius = 0.3429;
const WeightKG = 1841;
function acelcalc() {
    //wheel torque to newtons
    const Newtons = F_CAN[7] / TireRadius;
    //calculate the acceleration (still need to find out what unit of acceleration it is but as long as it works)
    const Acceleration = Newtons / WeightKG;
    //calculate the speed change over time due to acceleration (the greeks called it delta so im going to call it that too because it sounds cool)
    const DeltaSpeed = (Acceleration * (F_CAN[8] / 1000)) * 2.23694;
    //set the speed, and set speed to 0 if it is negative to prevent the program from shiting itself.
    F_CAN[0] = Math.max(0, F_CAN[0] + DeltaSpeed);
}
