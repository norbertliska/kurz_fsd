import { IFileInfo, IFileStorageDriver } from "./DriverFactory.mjs";


/**
 * Zatial 1:1 ako IFileStorageDriver, ale neskor moze dostat specificke fcie, preto extra
 */
export interface IFileStorage {
    upload(filename: string, data: Uint8Array): Promise<void>;
    download(filename: string): Promise<Uint8Array>;
    delete(filename: string): Promise<void>;
    list(): Promise<IFileInfo[]>;
}

/**
 * Zatial len nadbytocny wrapper na IFileStorageDriver a nic viac.
 * Ale keby trebalo, da sa spravit spolocna logika pred a po volaní IFileStorageDriver-funkcií
 */
export class FileStorage implements IFileStorage {

    driver: IFileStorageDriver = null;

    constructor(driver: IFileStorageDriver) {
        this.driver = driver;
    }

    async upload(filename: string, data: Uint8Array): Promise<void> {
        return await this.driver.upload(filename, data);
    }

    async download(filename: string): Promise<Uint8Array> {
        return await this.driver.download(filename);
    }

    async delete(filename: string): Promise<void> {
        return await this.driver.delete(filename);
    }

    async list(): Promise<IFileInfo[]> {
        return await this.driver.list();
    }

}