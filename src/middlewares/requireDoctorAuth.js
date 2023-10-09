
import {NotAuthorizedError} from '@fhannan/common';

var requireDoctorAuth = function (req, res, next) {
    if (!req.currentUser || req.currentUser.userRole != 1) {
        throw new NotAuthorizedError();
    }
    next();
};
export {requireDoctorAuth};

