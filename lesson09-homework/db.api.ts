/*

IDB.ts
KyselyDB
KyselyDBTypes


*/




interface IDataStorage {

    //
    // administracia
    //

	// 1/*: logne sa administrator, napr. user_id=1. Caller checkne ci nie je banned.
	findUserByLoginAndPassword(login:string, pwd:string):IUser;

	// 2/*: prida autora, napr author_id=100. JWT-user musi byt nezabanovany admin 
	addAuthor(author:IAuthor):IAuthor;

	// 3/*: prida usera -> aby sa autor mohol prihlasit, napr. user_id=101. JWT-user musi byt nezabanovany admin.
	addUser(user:IUser):IUser;

	// 4/*: logne sa user_id=101
	// vid hore: findUserByLoginAndPassword(login, pwd):IUser;

    // 5/*: bez autorizacie, to len pre FE-dropbox
    getCategoryAll():ICategory[];

    // 6:/*: pridat article - JWT-user musi byt nezabanovany author
    addArticle(a:IArticle): IArticle;


    //
    // public web pouzitie
    //


    // 7/*: zoznam clankov, ale bez contentov
    getArticles(filter:{ /* vsetko mozne */}):IArticle[];


    // 8*/: jeden clanok a proste vsetky infos, aj content
    getArticle(articleId:number):IArticle;


    //
    // administracia - zvysok
    //

    // JWT-user musi byt nezabanovany admin
    deleteAuthor(authorId:number):void;

	
	

}

export interface IUser {
    user_id: number;
    login: string,
    password: string
    author_id: number;
    is_admin: number;
    is_banned: boolean; // bud author alebo aj byvaly admin
}

export interface IAuthor {
    author_id:number;
    name:string;
    job: string;
}

export interface ICategory {
    category_id:number;
    name:string;
    examples:string;
}

export interface IArticle {
    id:number;
    publication_datetime:Date;
    autho_id:number;
    category_id:number;
    title:string;
    uvod: string;
    content_plain:string;
    tags: string[];
}

