/** @format */
const firebase = require("../key.json");
const { Storage } = require("@google-cloud/storage");

const { v4: uuidv4 } = require("uuid");
const uuid = uuidv4();

const storage = new Storage({
  projectId: "blog-posts-1a74b",
  keyFilename: process.env.GOOGLE_CREDENTIALS,
});

const bucket = storage.bucket("gs://blog-posts-1a74b.appspot.com");

async function uploadedImage(file) {
  if (!file) {
    console.log("no file");
  }
  const data = await bucket.upload(file.path, {
    gzip: true,
    metadata: {
      metadata: {
        firebaseStorageDownloadTokens: uuid,
      },
      cacheControl: "public, max-age=31536000",
    },
  });
  return data[0].metadata.mediaLink;
}

module.exports = uploadedImage;
