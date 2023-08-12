const {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const fs = require("fs");
const path = require("path");

class AwsService {
  constructor() {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCES_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY_ACCESS,
      },
      region: process.env.AWS_REGION,
    });
  }

  async uploadToS3(fileName) {
    try {
      const options = {
        Bucket: process.env.S3_BUCKET_NAME,
        Body: fs.createReadStream(fileName),
        Key: fileName,
      };

      const uploads = new Upload({
        client: this.s3,
        queueSize: 4,
        leavePartsOnError: false,
        params: options,
      });

      uploads.on("httpUploadProgress", (progress) => {
        console.log(progress);
      });

      return await uploads.done();
    } catch (err) {
      throw err;
    }
  }

  async getFileFromS3(fileName) {
    try {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
      };

      let result = await this.s3.send(new GetObjectCommand(params));
      return result;
    } catch (err) {
      throw err;
    }
  }

  async deleteFileFromS3(fileName) {
    try {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
      };

      const result = await this.s3.send(new DeleteObjectCommand(params));
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new AwsService();
