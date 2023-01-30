function brakecontrol(BrakeDemand, HVSOC, RegenAvalibleTorque) {
    if (BrakeDemand >= 800) {
        //basically a thing faking ABS, regen is disabled
        let FrictionBrakeDemand = BrakeDemand;
        //done!
    } else {
        if (HVSOC >= 95) {
            //Battery too full to use regen
            let FrictionBrakeDemand = BrakeDemand;
            F_CAN[6] = 0;
        } else {
            RegenAvalibleTorquePoll();
            if (BrakeDemand >= RegenAvalibleTorque) {
                //Regen unable to meet demanded torque requested, use max regen, make up with auxiliary
                let FrictionBrakeDemand = BrakeDemand - F_CAN[1];
                F_CAN[6] = RegenAvalibleTorque * -1;
            } else {
                //Regen only
                F_CAN[6] = BrakeDemand * -1;
            }
        }
    }
}
//Resistance variables
const BaseResistance = 200;
const ResistanceExponental = 1;
function ResistanceCalc(Speed) {
    if (Speed >= 0.2) {
        let Resistance = BaseResistance + Math.pow(Speed, ResistanceExponental);
    } else {
        let Resistance = 0;
    }
    return Resistance;
}