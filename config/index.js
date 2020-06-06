require("dotenv").config();

const config = {
    //dev: process.env.NODE_ENV !== "production",
    port: process.env.PORT,
    type: process.env.TYPE,
    proyectId: process.env.PROYECT_ID,
    privateKey: process.env.PRIVATE_KEY,
    clientEmail: process.env.CLIENT_EMAIL,
    clientId: process.env.CLIENT_ID,
    authUri: process.env.AUTH_URI,
    tokenUri: process.env.TOKEN_URI,
    authProviderCert: process.env.AUTH_PROVIDER_CERT,
    clientCertUrl: process.env.CLIENT_CERT_URL,
};

module.exports = { config };