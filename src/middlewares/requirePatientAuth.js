
import {NotAuthorizedError} from '@fhannan/common';

var requirePatientAuth = function (req, res, next) {
    if (!req.currentUser || req.currentUser.userRole != 0) {
        throw new NotAuthorizedError();
    }
    next();
};
export {requirePatientAuth};

