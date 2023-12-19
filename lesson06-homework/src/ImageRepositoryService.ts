import * as fs from 'fs'
import removeAccents from 'remove-accents';
import sharp from 'sharp';

export class ImageRepositoryService {
    private IMAGE_MAX_SIZE:number = 1000;
    private THUMBNAIL_SIZE:number = 96;
    private imagesExt = ["gif", "jpg", "jpeg", "png", "bmp", "ico", "tiff", "webp"];
    private imagesMT = ["image/gif", "image/jpeg", "image/png", "image/bmp", "image/x-icon", "image/tiff", "image/webp"];

    private root = "";

    constructor(dir:string) {
        if (dir.substring(0, 1) === "/") dir = dir.substring(1); // odstran prvy slash
        if (dir.length > 0 &&  dir[dir.length - 1] === "/") dir = dir.substring(0, dir.length); // odstran posledny slash

        var dirs = dir.split("/");
        try {
            this.root = "";
            for (var i in dirs) {
                this.root += dirs[i] + "/";
                this.createDirIfNotExists(this.root);
            }            
        }
        catch(e) {
            console.log(e);
        }
    }    

    private createDirIfNotExists(path:string){
        if (!fs.existsSync(path)) fs.mkdirSync(path);
    }

    /** inkl. / */
    private getDirPathForUser(userId:number):string {
        return this.root + userId.toString() + "/";
    }

    private ensureExistsUserDir(userId:number) {
        this.createDirIfNotExists(this.getDirPathForUser(userId));
    }

    /** Povolene au len a-z, A-Z, 0-9, "-", "." a "_": Vsetky ostatne znaky sa nahradia za podtrznik 
     * #todo ak prilis dlhe - odseknut
    */
    private normaliseFilename(fn: string):string {
        fn = removeAccents(fn);
        const validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-.";
        let ret = "";
        for (var i = 0; i < fn.length; i++) {
            var ch = fn[i];
            if (validChars.indexOf(ch) < 0) ch = "_";
            ret += ch;
        }
        return ret;
    }

    /**
     * @returns null if ok , otherwise errmsg
     */
    private checkMimetypeAndExtension(mimetype:string, extension: string): string {

        // primitivna kontrola podla mime-type
        if (mimetype === void 0 
           || mimetype === null
           || this.imagesMT.indexOf(mimetype.toLowerCase()) < 0 )
        {
            return `Mime-Type "${mimetype}" nevyzerá byť obrázok.`;
        }

        // primitivna kontrola. Chcelo by to cez sharp, ale neviem odchytit chybu...
        if (extension === void 0
            || extension === null
            ||this.imagesExt.indexOf(extension.toLowerCase()) < 0 ) 
        {
            return `Súbor s príponov "${extension}" nevyzerá byť obrázok.`;         
        }

        return null;
    }

    /**
     * "hugo.jpg" -> { name:"hugo", extension:"string"}
     */
    private parseFilename(filename:string): { pureName:string, extension:string} {
        var pureName = filename, extension = "";        
        var i = pureName.lastIndexOf(".");
        if (i >= 0) {
            pureName = filename.substring(0, i);
            extension = filename.substring(i + 1);
        }        
        return { pureName:pureName, extension: extension};
    }


    /**
     * 
     * @param userId 
     * @param name 
     * @param extension 
     * @param isThumbnail 
     * @param counter : 0 -> ignore, >0 ->  <name><counter>.<extension>
     */
    private generRealPath(userId:number, name:string, extension:string, isThumbnail: boolean, counter:number) {
        var ret = this.getDirPathForUser(userId) + name;
        if (isThumbnail) ret += "_";
        if (counter > 0) ret += counter.toString();
        if (extension !== "") ret += "." + extension;   
        return ret;
    }

    private findUnusedRealPath(userId:number, name:string, extension:string) {
        var savePath = this.generRealPath(userId, name, extension, false, 0);
        var tnPath = this.generRealPath(userId, name, extension, true, 0);
        var counter = 1;
        while (fs.existsSync(savePath)) {
            counter++; // čiže začíname od 2-ky!
            savePath = this.generRealPath(userId, name, extension, false, counter );
            tnPath = this.generRealPath(userId, name, extension, true, counter );
        }  

        return {
            savePath: savePath,
            tnPath: tnPath
        }
    }

    /**
     * Uz image len proste ulozi, resp zmensi na max IMAGE_MAX_SIZE
     */
    private async saveImageAndThumbnail(tempFilePath:string, savePath:string, tnPath: string) {
        // zistenie rozmerov
        const objSharp = sharp(tempFilePath);
        const md = await objSharp.metadata(); // tu by to chcelo odchytit chybu, ale nic nezabralo...
        const imageWidth = <number>md.width;   
        const imageHeight = <number>md.height;

        if (imageHeight > this.IMAGE_MAX_SIZE || imageWidth > this.IMAGE_MAX_SIZE) {            
            objSharp
                .resize(this.IMAGE_MAX_SIZE, this.IMAGE_MAX_SIZE, {fit: sharp.fit.inside} )
                .toFile(savePath);
        }
        else {
            // priamo kopiruj
            fs.copyFile(tempFilePath, savePath, fs.constants.COPYFILE_EXCL, (err: any) => { });
        }

        // urob thumbnail
        objSharp
            .resize(this.THUMBNAIL_SIZE, this.THUMBNAIL_SIZE, {fit: sharp.fit.inside})
            .toFile(tnPath);

        return {
            path: savePath,
            thumbnailPath: tnPath
        }        

    }
    

    /**
     * Ak je väčší ako IMAGE_MAX_SIZE, tak príslušne resizne (dodrží aspect ratio)
     * Urobí thumbnail o veľkosti THUMBNAIL_SIZE (dodrží aspect ratio)
     * @returns { error?:string; path?:string; thumbnailPath?:string } 
     */
    async saveImage(fileName:string, mimetype:string, userId:number, tempFilePath:string )
    : Promise<{ error?:string; path?:string; thumbnailPath?:string; }>
     {
        // priprava
        fileName = this.normaliseFilename(fileName);
        this.ensureExistsUserDir(userId);
        const parsedFilename = this.parseFilename(fileName);

        // base checks
        const errmsg = this.checkMimetypeAndExtension(mimetype, parsedFilename.extension);
        if (errmsg !== null) return { error: errmsg };

        // skutocne meno suboru aj nahladu        
        const { savePath, tnPath} = this.findUnusedRealPath(userId, parsedFilename.pureName, parsedFilename.extension);

        // samotne ulozenie
        this.saveImageAndThumbnail(tempFilePath, savePath, tnPath);

        return {
            path: savePath,
            thumbnailPath: tnPath
        }

    }


}

// export var imageRepositoryService = new ImageRepositoryService();

