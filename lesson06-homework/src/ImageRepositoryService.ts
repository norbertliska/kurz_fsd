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

    /** Povolene au len a-z, A-Z, 0-9, "-", "." a "_": Vsetky ostatne znaky sa nahradia za "_" 
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
     * Ak je väčší ako IMAGE_MAX_SIZE, tak príslušne resizne (dodrží aspect ratio)
     * Urobí thumbnail o veľkosti THUMBNAIL_SIZE (dodrží aspect ratio)
     * @returns { error?:string; path?:string; thumbnailPath?:string } 
     */
    async saveImage(fileName:string, mimetype:string, userId:number, tempFilePath:string )
    : Promise<{ error?:string; path?:string; thumbnailPath?:string; }>
     {
        // pripava
        fileName = this.normaliseFilename(fileName);
        this.ensureExistsUserDir(userId);
        var dir = this.getDirPathForUser(userId);

        // priprava na "hugo2.jpg", "hugo3.jpg", "hugo4.jpg" ...
        var pureFileName = fileName, extension = ""; // "hugo.jpg" -> "hugo", "jpg"
        {
            var i = fileName.lastIndexOf(".");
            if (i >= 0) {
                pureFileName = fileName.substring(0, i);
                extension = fileName.substring(i + 1);
            }
        }

        var errmsg = this.checkMimetypeAndExtension(mimetype, extension);
        if (errmsg !== null) return { error: errmsg };

        // skutocne meno suboru aj nahladu
        var savePath = `${dir}${fileName}`;
        var tnPath = `${dir}_${fileName}`;
        var counter = 1;
        while (fs.existsSync(savePath)) {
            counter++; // čiže začíname od 2-ky!
            savePath = `${dir}${pureFileName}${counter}`; // "...../hugo.jpg" -> "...../hugo2.jpg"
            tnPath = `${dir}_${pureFileName}${counter}`; //  "...../hugo.jpg" -> "...../_hugo2.jpg"
            if (extension !== "") {
                savePath += "." + extension;
                tnPath += "." + extension;
            }            
        }        
        await fs.copyFile(tempFilePath, savePath, fs.constants.COPYFILE_EXCL, (err:any) => { });
                
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
            await fs.copyFile(tempFilePath, savePath, fs.constants.COPYFILE_EXCL, (err:any) => { });
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


}

// export var imageRepositoryService = new ImageRepositoryService();

