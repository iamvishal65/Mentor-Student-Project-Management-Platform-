const crypto = require("node:crypto");
const userModel = require("../models/User.model");

const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(process.env.GITHUB_TOKEN_ENC_KEY, "hex"); // 32 bytes
if (KEY.length !== 32) {
  throw new Error("GITHUB_TOKEN_ENC_KEY must be 32 bytes");
}

function encryptToken(token) {
  const iv = crypto.randomBytes(12); // 96-bit IV (recommended for GCM)
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(token, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return {
    encryptedToken: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: tag.toString("base64"),
  };
}

function decryptToken(encryptedToken, iv, authTag) {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    KEY,
    Buffer.from(iv, "base64"),
  );

  decipher.setAuthTag(Buffer.from(authTag, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedToken, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

async function userAllowed(userId) {
  const user = await userModel.findOne({userId} );
  if (!user) {
    const err = new Error("user donnt register as a student");
    err.statusCode = 403;
    throw err;
  }
  if (user.github.connected === false) return false;
  return true;
}

async function saveAccessToken(userId, encrypted) {
  
  
  const user = await userModel.findOneAndUpdate(
  {userId},
    {
      $set: {
        "github.connected": true,
        "github.accessTokenEnc": encrypted.encryptedToken,
        "github.iv": encrypted.iv,
        "github.authTag": encrypted.authTag,
        "github.connectedAt": new Date(),
      },
    },
    { new: true },
  );

  if (!user) console.log("Invalid userId");
 
}

async function getAccessTokenByUserId(userId) {
  
  const student = await studentModel.findOne({userId:userId}).select("github");
console.log("hey"+student);

  if (!student || student.github.connected==false) {
    throw new Error("can't find student");
  }

  return {
    accessTokenEnc: student.github.accessTokenEnc,
    iv: student.github.iv,
    authTag: student.github.authTag,
  };
}

module.exports = {
  userAllowed,
  encryptToken,
  decryptToken,
  saveAccessToken,
  getAccessTokenByUserId,
};
