import jwt from 'jsonwebtoken';

const test = function (req, res, next) {
    console.log("I am in middleware test");
    next();
};
export default test;

