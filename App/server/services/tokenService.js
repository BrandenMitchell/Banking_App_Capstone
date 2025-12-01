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
        const jti = this.generateJti(); //create a jwt id 
        const payload = { sub: user._id.toString(), jti }; //create a payload with the user ID as the subject, and the token ID

        return jwt.sign(payload, this.accessSecret, {
            expiresIn: this.accessTtl,
            algorithm: 'HS256',
        });
    }

     signAccessToken(user) {
        const jti = this.generateJti();
        const payload = { sub: user._id.toString(), jti };

        return jwt.sign(payload, this.accessSecret, {
            expiresIn: this.accessTtl,
            algorithm: 'HS256',
        });
    }

    // Create longer-lived refresh token
    signRefreshToken(user) {
        const jti = this.generateJti();
        const payload = { sub: user._id.toString(), jti };

        return jwt.sign(payload, this.refreshSecret, {
            expiresIn: this.refreshTtl,
            algorithm: 'HS256',
        });
    }

    // Verify and decode access token
    verifyAccessToken(token) {
        try {
            return jwt.verify(token, this.accessSecret);
        } catch (err) {
            console.error('Access token verification failed:', err.message);
            return null;
        }
    }

    // Verify and decode refresh token
    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, this.refreshSecret);
        } catch (err) {
            console.error('Refresh token verification failed:', err.message);
            return null;
        }
    }

}
module.exports = new TokenService();