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
                F_CAN[6] = F_CAN[1] * -1;
            } else {
                //Regen only
                F_CAN[6] = F_CAN[3] * -1;
            }
        }
    }
}
//Resistance variables
const BaseResistance = 200;
const ResistanceExponental = 1;
function ResistanceCalc(speed) {
    if (speed >= 0.2) {
        let Resistance = BaseResistance + Math.pow(speed, ResistanceExponental);
    } else {
        let Resistance = 0;
    }
    return Resistance;
}