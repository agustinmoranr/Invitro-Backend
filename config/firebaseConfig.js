const { firebaseAdminConf, firebaseConf} = require('./index.js');

const firebaseAdmin = {
    "type": firebaseAdminConf.type,
    "project_id": firebaseAdminConf.project_id,
    "private_key_id": firebaseAdminConf.private_key_id,
    "private_key": firebaseAdminConf.private_key,
    "client_email": firebaseAdminConf.client_email,
    "client_id": firebaseAdminConf.client_id,
    "auth_uri": firebaseAdminConf.auth_uri,
    "token_uri": firebaseAdminConf.token_uri,
    "auth_provider_x509_cert_url": firebaseAdminConf.auth_provider_x509_cert_url,
    "client_x509_cert_url": firebaseAdminConf.client_x509_cert_url,
};

const firebaseConfig = {
    "apiKey": firebaseConf.apiKey,
    "authDomain":firebaseConf.authDomain,
    "databaseURL":firebaseConf.databaseURL,
    "projectId":firebaseConf.projectId,
    "storageBucket":firebaseConf.storageBucket,
    "messagingSenderId":firebaseConf.messagingSenderId,
    "appId": firebaseConf.appId,
    "measurementId":firebaseConf.measurementId
  };

module.exports = {
    firebaseAdmin,
    firebaseConfig
};  
 