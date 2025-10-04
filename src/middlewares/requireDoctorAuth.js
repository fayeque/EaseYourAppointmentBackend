
import {NotAuthorizedError} from '@fhannan/common';

var requireDoctorAuth = function (req, res, next) {
    console.log("requiredDoctorAUth called");
    if (!req.currentUser || req.currentUser.userRole != 1) {
        throw new NotAuthorizedError();
    }
    next();
};
export {requireDoctorAuth};

