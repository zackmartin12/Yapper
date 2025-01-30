const crypto = require('crypto');
const { Buffer } = require('buffer');

const API_SECRET = "YappaDappaDoo";

const TOKEN_COOKIE_NAME = "YapperToken";

function base64urlEncode(string) {
    return Buffer.from(string, 'utf8').toString('base64url');
}

function base64urlDecode(string) {
    return Buffer.from(string, 'base64url').toString('utf8');
}

exports.TokenMiddleware = (req, res, next) => {
    const token = req.cookies[TOKEN_COOKIE_NAME];
    if (!token) {
        res.status(401).json({error: 'Not Authenticated'});
        return;
    }

    try {
        const [header, payload, signature] = token.split('.');

        const tempSignature = crypto.createHmac('sha256', API_SECRET).update(header + '.' + payload).digest('base64url');
        if (tempSignature != signature) {
            res.status(401).json({error: 'Not Authenticated'});
            return;
        }

        const decodedPayload = JSON.parse(base64urlDecode(payload));
        if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
            res.status(401).json({error: 'Not Authenticated'});
            return;
        }

        req.user = decodedPayload.user;
        next();
    } catch(error) {
        res.status(401).json({error: 'Not Authenticated'});
    }
}

exports.generateToken = (req, res, user) => {
    const header = {
        "alg": "HS256",
        "typ": "JWT"
    }

    const payload = {
        "exp": Math.floor(Date.now() / 1000) + (600 * 60),
        "user": user
    };

    const encodedHeader = base64urlEncode(JSON.stringify(header));
    const encodedPayload = base64urlEncode(JSON.stringify(payload));

    const signature = crypto.createHmac('sha256', API_SECRET).update(encodedHeader + '.' + encodedPayload).digest('base64url');

    const token = encodedHeader + '.' + encodedPayload + '.' + signature;

    res.cookie(TOKEN_COOKIE_NAME, token, {
        httpOnly: true, 
        secure: true,
        maxAge: 6000000
    });
};

exports.removeToken = (req, res) => {
    res.cookie(TOKEN_COOKIE_NAME, "", {
        httpOnly: true, 
        secure: true,
        maxAge: -6000000
    });
};