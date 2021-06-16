var admin = require("firebase-admin");

const type = process.env.FB_type;
const project_id = process.env.FB_project_id;
const private_key_id = process.env.FB_private_key_id;
const private_key = process.env.FB_private_key;
const client_email = process.env.FB_client_email;
const client_id = process.env.FB_client_id;
const auth_uri = process.env.FB_auth_uri;
const token_uri = process.env.FB_token_uri;
const auth_provider_x509_cert_url = process.env.FB_auth_provider_x509_cert_url;
const client_x509_cert_url = process.env.FB_client_x509_cert_url;
var serviceAccount = {
  type: `${type}`,
  project_id: `${project_id}`,
  private_key_id: `${private_key_id}`,
  private_key: `${private_key}`,
  client_email: `${client_email}`,
  client_id: `${client_id}`,
  auth_uri: `${auth_uri}`,
  token_uri: `${token_uri}`,
  auth_provider_x509_cert_url: `${auth_provider_x509_cert_url}`,
  client_x509_cert_url: `${client_x509_cert_url}`,
};

var db = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports.db = db.firestore();
