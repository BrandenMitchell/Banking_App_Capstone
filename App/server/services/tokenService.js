//create token 
const {randomUUID} = require('crypto');
const jwt = require('jsonwebtoken');


class TokenService {
    constructor () {
        this.accessSecret = process.env.ACCESS_TOKEN_SECRET;
        this.refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        this.accessTtl = '15m';     // Access token lifespan
        this.refreshTtl = '7d';   
    }
    //create an ID for a jwt token
    generateJti () {
        return randomUUID();
    }

    signAccessToken(user) {
        const jti = this.generateJti();
        const payload = { sub: user._id.toString(), jti };

        return jwt.sign(payload, this.accessSecret, {
            expiresIn: this.accessTtl,
            algorithm: 'HS256',
        });
    }

    verifyAccessToken() {


    }
    




}