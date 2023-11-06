import { UploadedFile } from "express-fileupload";
import S3 from "aws-sdk/clients/s3";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const Bucket = process.env.S3_BUCKET;
const s3 = new S3({ region, accessKeyId, secretAccessKey });
const client = new S3Client({ region });

export const uploadFile = async (file: UploadedFile) => {
  const data = await s3
    .putObject({
      Bucket,
      Key: `${file.name}`,
      Body: file.data,
      ACL: "public-read",
      ContentType: "image/jpg, image/png, image/jpeg",
    })
    .promise();

  return data;
};

export const getUrlFromS3 = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket,
    Key: key,
  });

  try {
    return await getSignedUrl(client, command);
  } catch (err) {
    console.error(err);
  }
};
