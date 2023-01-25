//2.23694 is the number you use to convert KMH to MPH
var TireRadius = 0.3429;
var WeightKG = 1841;
function acelcalc() {
    //wheel torque to newtons
    let Newtons = F_CAN[7] / TireRadius;
    //calculate the acceleration (still need to find out what unit of acceleration it is but as long as it works)
    let Acceleration = Newtons / WeightKG;
    //calculate the speed change over time due to acceleration (the greeks called it delta so im going to call it that too because it sounds cool)
    let DeltaSpeed = (Acceleration * (F_CAN[8] / 1000)) * 2.23694;
    F_CAN[0] = Math.max(0, F_CAN[0] + DeltaSpeed);
}
