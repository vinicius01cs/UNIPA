const { expressjwt: jwt } = require('express-jwt');
const { get } = require('./questionarioRoutes');
const jwtSecret = process.env.JWT_SECRET;
const getTokenFromHeaders = (req) => {
    const { headers: { authorization } } = req;

    if(authorization && authorization.split(' ')[0] === 'Token'){
        return authorization.split(' ')[1];
    }
    return null; 
};

const auth = {
    required: jwt({
        secret: jwtSecret,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        algorithms: ['HS256']
    }),
    optional: jwt({
        secret: jwtSecret,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialRequired: false,
        algorithms: ['HS256']
    }),
};

module.exports = auth;