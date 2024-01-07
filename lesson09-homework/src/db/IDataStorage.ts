
/**
 * Len taky pokus o este vyssi level odizolovania ukladania dát...
 */
export interface IDataStorage {

    open(config: any): void;



    // #region users   

    findUserByLoginAndPassword(login: string, pwd: string): Promise<IUser>;

    /**
     * unique -> tzn. ci je unique kontroluje konkretna implementacia ako je jej najlepsie
     */
    addUserUnique(user: IUser): Promise<number>;

    // #endregion users



    // #region author

    /**
     * author.id sa ignoruje
     * unique -> tzn. ci je unique kontroluje konkretna implementacia ako je jej najlepsie
     */
    addAuthorUnique(author: IAuthor): Promise<number>;

    getAuthors(): Promise<IAuthor[]>;

    getAuthor(authorId:number): Promise<IAuthor>;

    updateAuthor(author: IUpdateAuthorPrms): Promise<void>;

    /**
     * Deletne aj users aj articles aj authors
     */
    deleteAuthorAndDeps(authorId: number): Promise<void>;

    // #endregion authors



    // #region Categories

    getCategoryAll(): Promise<ICategory[]>;

    // #endregion Categories



    // #region Articles

    addArticle(a: IAddArticlePrms): Promise<number>;

    /** 
     * @return Vsetky fields okrem contentov plus nieco navyse
     **/
    getArticles(filter: IGetArticlesPrms): Promise<{ articles: IArticleFull[], totalCount: number }>;

    /** 
     * @return Vsetky fields pluse nieco navyse alebo null ak neexistuje
     **/
    getArticle(articleId: number): Promise<IArticleFull>;

    updateArticle(data: IUpdateArticlePrms): Promise<void>;

    deleteArticle(articleId: number): Promise<void>;

    // #endregion Articles
}


export interface IAuthor {
    id: number;
    name: string;
    job: string;
}

export interface IUpdateAuthorPrms {
    id: number;
    name?: string;
    job?: string;
}

export interface IUser {
    id: number;
    login: string,
    password: string
    author_id: number;
    is_admin: boolean;
}

export interface ICategory {
    id: number;
    name: string;
}

export interface IArticle {
    id: number;
    publication_datetime: Date;
    author_id: number;
    category_id: number;
    title: string;
    uvod: string;
    content_plain: string;
    tags: string[];
}

export interface IArticleFull extends IArticle {
    author: {
        id: number;
        name: string;
    };
    category: {
        id: number;
        name: string;
    };
}

export interface IAddArticlePrms {
    author_id: number;
    category_id: number;
    title: string;
    uvod: string;
    content_plain: string;
    tags: string[];
}

export interface IGetArticlesPrms {
    authorId?: number;
    page: number;
    perPage: number;
}

export interface IUpdateArticlePrms {
    id: number;
    category_id?: number;
    title?: string;
    uvod?: string;
    content_plain?: string;
    tags?: string[];
}
