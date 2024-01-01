import { S3Driver, IS3DriverConfig } from "./S3Driver.mjs";
import { LocalFilesystemDriver, ILocalFilesystemDriverConfig } from "./LocalFilesystemDriver.mjs"

export interface IFileInfo {
    name: string;
    length: number;
    lastModified: Date;
}

export interface IFileStorageDriver {
    upload(filename: string, data: Uint8Array): Promise<void>;
    download(filename: string): Promise<Uint8Array>;
    delete(filename: string): Promise<void>;
    list(): Promise<IFileInfo[]>;
}


/**
 * Ak je config v .env, tak volat "await createByDotenv()"
 * Ak inak - tak volat konkretnu fciu  "await createS3" alebo  "await createLocalFilesystem" alebo ...
 */
class DriverFactory {

    constructor() {
    }

    /**
     * Vzdy volat s await!
     * 
     * [.env]
     * ak FS_DRIVER = "S3Driver":     
     *      S3_ENDPOINT = "http://127.0.0.1:9000"
     *      S3_ACCESS_KEY="root"
     *      S3_SECRET_KEY="password"
     *      S3_REGION = "local"
     *      S3_BUCKET = "lesson7"
     * 
     * ak FS_DRIVER = "LocalFilesystemDriver":
     *      LFS_PATH = "public"
     * 
     */
    async createByDotenv(): Promise<IFileStorageDriver> {

        var sDriver = process.env.FS_DRIVER;
        const S_S3Driver = "S3Driver";
        const S_LocalFilesystemDriver = "LocalFilesystemDriver";

        if (sDriver === void 0) {
            throw new Error("V subore .env nie je definovana polozka FS_DRIVER.");
        }

        if (sDriver.toLowerCase() === S_S3Driver.toLowerCase()) {
            return await this.createS3({
                endpoint: process.env.S3_ENDPOINT,
                accessKey: process.env.S3_ACCESS_KEY,
                secretKey: process.env.S3_SECRET_KEY,
                region: process.env.S3_REGION,
                bucket: process.env.S3_BUCKET
            });
        }

        if (sDriver.toLowerCase() === S_LocalFilesystemDriver.toLowerCase()) {
            return await this.createLocalFilesystem({ path: process.env.LFS_PATH });
        }

        throw new Error(`V subore .env ma polozka FS_DRIVER neznamu hodnotu "${sDriver}"`);
    }

    async createS3(config: IS3DriverConfig): Promise<IFileStorageDriver> {
        return new S3Driver(config);
    }

    async createLocalFilesystem(config: ILocalFilesystemDriverConfig): Promise<IFileStorageDriver> {
        return new LocalFilesystemDriver(config);
    }
}

export var driverFactory = new DriverFactory();

