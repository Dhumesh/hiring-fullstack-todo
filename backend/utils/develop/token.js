const crypto = require("crypto");

const getSecret = () => process.env.JWT_SECRET || "change-this-development-secret";

const base64UrlEncode = (value) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");

const base64UrlDecode = (value) =>
    JSON.parse(Buffer.from(value, "base64url").toString("utf8"));

const sign = (value) =>
    crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");

const generateToken = (userId) => {
    const header = base64UrlEncode({ alg: "HS256", typ: "JWT" });
    const payload = base64UrlEncode({
        id: userId.toString(),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    });
    const signature = sign(`${header}.${payload}`);

    return `${header}.${payload}.${signature}`;
};

const verifyToken = (token) => {
    const [header, payload, signature] = token.split(".");

    if (!header || !payload || !signature) {
        throw new Error("Invalid token");
    }

    const expectedSignature = sign(`${header}.${payload}`);
    const signatureBuffer = Buffer.from(signature);
    const expectedSignatureBuffer = Buffer.from(expectedSignature);

    if (
        signatureBuffer.length !== expectedSignatureBuffer.length ||
        !crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
    ) {
        throw new Error("Invalid token");
    }

    const decodedPayload = base64UrlDecode(payload);

    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error("Token expired");
    }

    return decodedPayload;
};

module.exports = {
    generateToken,
    verifyToken,
};
