const { configAdmin, firebaseConfig} = require('./index.js');

const firebaseAdminConfig = {
    "type": configAdmin.type,
    "project_id": configAdmin.project_id,
    "private_key_id": configAdmin.private_key_id,
    "private_key": configAdmin.private_key,
    "client_email": configAdmin.client_email,
    "client_id": configAdmin.client_id,
    "auth_uri": configAdmin.auth_uri,
    "token_uri": configAdmin.token_uri,
    "auth_provider_x509_cert_url": configAdmin.auth_provider_x509_cert_url,
    "client_x509_cert_url": configAdmin.client_x509_cert_url,
};

const firebaseSimple = {
    "apiKey": firebaseConfig.apiKey,
    "authDomain":firebaseConfig.authDomain,
    "databaseURL":firebaseConfig.databaseURL,
    "projectId":firebaseConfig.projectid,
    "storageBucket":firebaseConfig.storageBucket,
    "messagingSenderId":firebaseConfig.messagingSenderId,
    "appId": firebaseConfig.appId,
    "measurementId":firebaseConfig.messagingSenderId
  };

module.exports = {
    firebaseAdminConfig,
    firebaseSimple
};  
 