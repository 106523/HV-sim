function brakecontrol() {
    if (F_CAN[3] >= 800) {
        //basically a thing faking ABS, regen is disabled
        F_CAN[13] = F_CAN[3];
        //done!
    } else {
        if (F_CAN[14] >= 95) {
            //Battery too full to use regen
            F_CAN[13] = F_CAN[3];
            F_CAN[6] = 0;
        } else {
            RegenAvalibleTorquePoll();
            if (F_CAN[3] >= F_CAN[1]) {
                //Regen unable to meet demanded torque requested, use max regen, make up with auxiliary
                F_CAN[13] = F_CAN[3] - F_CAN[1];
                F_CAN[6] = F_CAN[1];
            } else {
                F_CAN[6] = F_CAN[3];
            }
        }
    }
}
//Resistance variables
var BaseResistance = 200;
var ResistanceExponental = 1;
function ResistanceCalc() {
    
}