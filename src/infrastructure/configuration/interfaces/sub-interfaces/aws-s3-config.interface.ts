export interface AwsS3ConfigInterface {
  bucket: string;
  region: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}
