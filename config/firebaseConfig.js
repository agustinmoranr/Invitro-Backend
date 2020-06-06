const { config } = require('./index.js');

const firebaseConfig = {
    "type": config.type,
    "project_id": config.project_id,
    "private_key_id": config.private_key_id,
    "private_key": config.private_key,
    "client_email": config.client_email,
    "client_id": config.client_id,
    "auth_uri": config.auth_uri,
    "token_uri": config.token_uri,
    "auth_provider_x509_cert_url": config.auth_provider_x509_cert_url,
    "client_x509_cert_url": config.client_x509_cert_url,
};

module.exports = firebaseConfig;