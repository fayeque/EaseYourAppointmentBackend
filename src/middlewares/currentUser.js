import jwt from 'jsonwebtoken';

const currentUser = function (req, res, next) {
    const token = req.headers.authorization.split(' ')[1];;
    console.log(req.headers.authorization);
    console.log("token here is " + token);
    if (token === undefined || token === null){
        console.log("is it not coming here");
        return next();
    }
    try {
        console.log("is it coming here");
        var payload = jwt.verify(token, 'abcdefg');
        req.currentUser = payload;
    }
    catch (err) { 
        console.log("error in currentUser " + err);
    }
    next();
};
export default currentUser;

