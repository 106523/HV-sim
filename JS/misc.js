function brakecontrol(BrakeDemand, HVSOC, RegenAvalibleTorque) {
    if (BrakeDemand >= 800) {
        //basically a thing faking ABS, regen is disabled
        let FrictionBrakeDemand = BrakeDemand;
        return FrictionBrakeDemand;
        //done!
    } else {
        if (HVSOC >= 95) {
            //Battery too full to use regen
            let FrictionBrakeDemand = BrakeDemand;
            let MG1TorqueOutput = 0;
            return MG1TorqueOutput, FrictionBrakeDemand;
        } else {
            RegenAvalibleTorquePoll();
            if (BrakeDemand >= RegenAvalibleTorque) {
                //Regen unable to meet demanded torque requested, use max regen, make up with auxiliary
                let FrictionBrakeDemand = BrakeDemand - RegenAvalibleTorque;
                let MG1TorqueOutput = RegenAvalibleTorque * -1;
                return MG1TorqueOutput, FrictionBrakeDemand;
            } else {
                //Regen only
                let MG1TorqueOutput = BrakeDemand * -1;
                return MG1TorqueOutput;
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
        return Resistance;
    } else {
        let Resistance = 0;
        return Resistance;
    }
}