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
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDcTmzBkSyxVwqH\n89dBkpjTL/DF78ktpiZyw1or95UI3yEs31qX6kBuzW2qySWo92NujncUAtIpyoOV\n2TDTKV9mlCStDA1xUS6pK0TvwNFJZnfL3owaXLGcLLUce3T0GMQXpRTp+mnB09TJ\nufOnYVf0T/7XcHx9W2P2tFAIHqb98COygrFcNAnX9JGPSYw7eHiLpHjP7ZYKH89Z\nyOLtjVj0b05rueDlbsp6ORHownuPp4WG4TM5afC95901I7KFdG2D2IedBj+hTYJh\nlEtW/G+bY5MLCyEfQs36xx2JCpi839NcPi1UWJ5AfFm7Cuy4vC/Eayq5B+j0zAtY\nZ3yEIL59AgMBAAECggEAG/yUgVSVdmPl0RaPemOKqY12C1cmWfe4+6xIeLxngOyD\nlOU8536ZN9o9+8u4zom65nEPvImNNETnSXKBatnfJjNco2UcEhCrmk8GX2TB0Y7E\nWjBH4RN0drARQ/CFD3tT8eMFUKIArGBiMExAoTtTBpTg/XJrRiuFe/I1For6UNjj\n+FwqdYHFRdcx6NeyXX4CcexAhhBsjyEowqiICfKiVNGWUp34xcDN89WU0Q4henDk\nvw+zltK1uIC6aLhAEWuPVTdmLq48sRWBBtxBgu2/65xyKU5nzu386bZ9/ffh6194\nn7QmxLSeuYmYnfkKK9z5Z18eMiF7GMdstyiVGbrS2wKBgQD1wER3yi8iulvIhfr8\nN+m4S0AgflRUQU3TpIouVkpgvTYbiTiZUxif2pLnAW0JQ1GRKt3ihfJjzk/pP2Zs\nOFlL5BqPmjYmjcm5GKHH+91I5ERh0ucaUhebDkSwMBbjVG1Ow+CQM/YXRRwS/Zi2\n55x/xOsAGmvk1Qsc/XzI+T9XpwKBgQDlfoAAmkyGFYLG2h6Sj2xArSkAUi87ICvR\nzYcRIV1vkayAuCeakkXRL6kZdv6InqOe2R3Q8Ed1ONLa7pHo6VpENUBgxSIQJjBQ\noWNJ5VxYoASlx9f7IyYhVE4pv0nHPAiuKY20tx6TB9mrElLbdtcsYdHRcKpGz3ez\n5h+Q7M19OwKBgCRDrhbbQB9ozriFhOcJPTUT7a+d1MXmKRztL/LsiudBpKVll3OQ\nvpaAQ6NRI4z1YSkB4WJXD9DIliQ+VdfsbMj1LTI5uHnx/G2TA/Sl5x6liK3C2JWa\nvZ8E+P/i6M29HLA92XqOIGeIrD7lK076WK7GGUOXoopPIeeyRGLH3SALAoGBALFk\nQMk2e+RBCF9xBqS/HCw6LTFEVaHcUkLQHZFOOw0cizzMHEDMxA7YSluWsVUlWtBU\nf0mcEYA4tjPoqPxiNBX5G5QxjQzyl/IbbcYW9nTC7BTBDt/e4YBtzCVU6VCJxSPq\nltCTo5x/Ou+TMFzX1adGzYqZDeXCRILYZJn/kS81AoGAPcJPdh8Qx6vUa7Wepkv8\njBpECzx8Cgo2p3i3PhUaqiv5fTWbt/1SSYYlcSiKep4lEuweqGW/c2wWsikHYgvr\nE9N+j2ljPX6bqFPXC8s+pTzqQzcmn+yMSL17+74ME0uM2NvehZDNksSw9+96x5mS\n8NqlSPfPlcO7dhfquRyEnAU=\n-----END PRIVATE KEY-----\n",
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
