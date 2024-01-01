import { IFileInfo, IFileStorageDriver } from './DriverFactory.mjs'
import { S3Client, ListObjectsCommand, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'

export interface IS3DriverConfig {
    endpoint: string;
    accessKey: string;
    secretKey: string;
    region: string;
    bucket: string;
}

export class S3Driver implements IFileStorageDriver {
    bucket: string = "";
    region: string = "";

    /** real S3 client */
    client: S3Client = null;

    constructor(config: IS3DriverConfig) {
        this.bucket = config.bucket;
        this.region = config.region;

        this.client = new S3Client({
            endpoint: config.endpoint,
            region: config.region,
            credentials: {
                accessKeyId: config.accessKey,
                secretAccessKey: config.secretKey
            }
        })
    }

    //
    // #region IFileStorageDriver
    //

    /** Error handling: try/catch */
    async upload(filename: string, data: Uint8Array): Promise<void> {

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: filename,
            Body: data
        })

        await this.client.send(command);
    }

    /** Error handling: try/catch */
    async download(filename: string): Promise<Uint8Array> {

        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: filename
        });

        const response = await this.client.send(command);
        const ba = await response.Body.transformToByteArray();
        return Buffer.from(ba);
    }

    /** Error handling: try/catch */
    async delete(filename: string): Promise<void> {

        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: filename
        });

        await this.client.send(command);
    }

    /** Error handling: try/catch */
    async list(): Promise<IFileInfo[]> {
        const command = new ListObjectsCommand({ Bucket: this.bucket });
        var resp = await this.client.send(command)
        var ret: IFileInfo[] = [];
        if (resp.Contents !== void 0) {
            return resp.Contents.map((o) => {
                return {
                    name: o.Key,
                    length: o.Size,
                    lastModified: o.LastModified
                }
            })
        }
        return [];
    }

    //
    // #endregion IFileStorageDriver
    //

}