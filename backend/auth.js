const jwt = require('jsonwebtoken');
const secret = 'ilovesparcs';
const expiresIn = 60 * 60; // 60 min


//Authentication code from https://github.com/jeonghwan-kim/vue-auth-sample/blob/master/server/auth.js
const auth = {
    signToken (id) {
        return jwt.sign({id}, secret, {expiresIn})
    },
    ensureAuth () {
        return (req, res, next) => {
            const {authorization} = req.headers;
            if (!authorization) {
                res.status(401);
                throw Error('No Authorization headers');
            }

            try {
                req.user = this.verify(authorization);
            } catch (e) {
                res.status(401);
                throw e;
            }

            next();
        }
    },
    verify (token) {
        return jwt.verify(token.replace(/^Bearer\s/, ''), secret);
    }
};

module.exports = auth;