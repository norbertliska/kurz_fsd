import fs from 'fs/promises'
import { IFileInfo, IFileStorageDriver } from './DriverFactory.mjs'

export interface ILocalFilesystemDriverConfig {
    path: string;
}

export class LocalFilesystemDriver implements IFileStorageDriver {

    /** Konci na "/" */
    path: string;

    constructor(config: ILocalFilesystemDriverConfig) {
        this.path = config.path;
        if (this.path === void 0 || this.path === null) this.path = "";
        this.path = this.path.replaceAll("\\", "/");
        if (this.path.length > 0 && this.path[this.path.length - 1] !== "/") this.path += "/";
    }


    //
    // #region IFileStorageDriver    
    //    

    async upload(filename: string, data: Uint8Array): Promise<void> {
        filename = this.normaliseFilename(filename);
        await fs.writeFile(this.path + filename, data);
    }

    async download(filename: string): Promise<Uint8Array> {
        filename = this.normaliseFilename(filename);
        return fs.readFile(this.path + filename);
    }

    async delete(filename: string): Promise<void> {
        filename = this.normaliseFilename(filename);
        await fs.rm(this.path + filename);
    }

    async list(): Promise<IFileInfo[]> {
        var ret: IFileInfo[] = [];
        const files = await fs.readdir(this.path);
        for (let i = 0; i < files.length; i++) {
            var file = files[i];
            const stats = await fs.stat(this.path + file);
            if (stats.isDirectory()) continue;
            ret.push({
                name: file,
                length: stats.size,
                lastModified: stats.ctime
            })
        }
        return ret;

        /* import fs from 'fs'
        return new Promise<IFileInfo[]> ( (resolve, reject) => {

            var ret: IFileInfo[] = [];
            fs.readdir(this.path, async (err, files) => {
                //handling error
                if (err) {
                    throw new Error(`Unable to scan directory "${this.path}": ${err}`);
                }
                files.forEach( (file) => {
                    const stats = fs.statSync(this.path + file);
                    if (stats.isDirectory()) return;
                    ret.push({
                        name: file,
                        length: stats.size,
                        lastModified: new Date(stats.mtime)
                    })
                });   
    
                resolve(ret);
            });

        });        
        */
    }

    //
    // #endregion IFileStorageDriver    
    //

    /** nahradi nevalidne znaky za "_" */
    private normaliseFilename(fn: string): string {
        if (fn === void 0 || fn === null) fn = "";
        const wrongChars = "/\\\"*<>?|";

        let ret = "";
        for (var i = 0; i < fn.length; i++) {
            var ch = fn.charAt(i);
            var code = fn.charCodeAt(i);
            if (code < 32) ch = "_";
            if (wrongChars.indexOf(ch) >= 0) ch = "_";
            ret += ch;
        }
        return ret;
    }

}