// how to update DataStorageKyselyTypes.ts:
// npx kysely-codegen --dialect postgres --out-file src/db/DataStorageKyselyTypes.ts

import { DB } from './DataStorageKyselyTypes.js'
import { Kysely } from 'kysely'
import { PostgresDialect } from 'kysely';
import pg from 'pg';

import { IAddArticlePrms, IAuthor, ICategory, IDataStorage, IUser, IArticleFull, IGetArticlesPrms, IUpdateArticlePrms } from './IDataStorage.js'

export interface IDataStorageKyselyOpenConfig {
    connectionString: string
}

export class DataStorageKysely implements IDataStorage {

    // https://kysely.dev/docs/category/examples
    db: Kysely<DB> = null;

    tagsToString(tags: string[]) {
        if (tags === void 0 || tags === null) return "";
        return tags.join(";");
    }

    stringToTags(s: string) {
        if (s === void 0 || s === null) return [];
        return s.split(";");
    }


    //
    // interface IDataStorage
    //

    // #region interface IDataStorage

    /**
     * Radsej takto ako cez constructor, lebo constructor nemoze byt async a co ak by hned v constructore trebalo volat async query?
     * 
     */
    async open(config: IDataStorageKyselyOpenConfig) {
        this.db = new Kysely<DB>({
            dialect: new PostgresDialect({
                pool: new pg.Pool({
                    connectionString: config.connectionString
                })
            })
        })

        // toto sa cez constructor nedalo, lebo samozrejme vracalo Promise...
        //console.log( await this.db.selectFrom("categories").selectAll().execute() );
    }


    async findUserByLoginAndPassword(login: string, password: string): Promise<IUser> {

        try {
            var rows = await this.db
                .selectFrom("users")
                .where((eb) => eb.and([
                    eb("login", "=", login),
                    eb("password", "=", password),
                ])
                )
                .selectAll()
                .execute();

            if (rows.length !== 1) throw new Error("Zle meno alebo heslo");
            const user = rows[0];
            return {
                id: user.id,
                login: user.login,
                password: user.password,
                author_id: user.author_id,
                is_admin: user.is_admin === 1
            }
        }
        catch (e) {
            throw new Error(`[findUserByLoginAndPassword] ${e}`)
        }
    }


    async addUserUnique(user: IUser): Promise<number> {
        try {
            var a = await this.db
                .insertInto("users")
                .values({
                    "login": user.login,
                    "password": user.password,
                    "author_id": user.author_id,
                    "is_admin": user.is_admin ? 1 : 0
                })
                .returning(["id"])
                .executeTakeFirst();

            return a.id;
        }
        catch (e) {
            if (e.toString().indexOf("duplicate key") >= 0) {
                throw new Error(`User s loginom "${user.login}" uz existuje`);
            }
            throw new Error(`[addAuthorUnique] ${e}`)
        }
    }


    async addAuthorUnique(author: IAuthor): Promise<number> {
        try {
            var a = await this.db
                .insertInto("authors")
                .values({
                    "name": author.name,
                    "job": author.job
                })
                .returning(["id"])
                .executeTakeFirst();

            return a.id;
        }
        catch (e) {
            if (e.toString().indexOf("duplicate key") >= 0) {
                throw new Error(`Autor s menom "${author.name}" uz existuje`);
            }
            throw new Error(`[addAuthorUnique] ${e}`)
        }
    }


    async getAuthors(): Promise<IAuthor[]> {
        try {
            const data = await this.db
                .selectFrom("authors")
                .selectAll()
                .execute();

            return data.map(a => {
                return {
                    id: a.id,
                    name: a.name,
                    job: a.job
                }
            });
        }
        catch (e) {
            throw new Error(`[getAuthors] ${e}`)
        }
    }


    async getAuthor(authorId: number): Promise<IAuthor> {
        try {
            const data = await this.db
                .selectFrom("authors")
                .where("id", "=", authorId)
                .selectAll()
                .executeTakeFirst();
            if (data === void 0 || data === null) return null;

            return {
                id: data.id,
                name: data.name,
                job: data.job
            }
        }
        catch (e) {
            throw new Error(`[getAuthors] ${e}`)
        }
    }


    async updateAuthor(author: IAuthor): Promise<void> {
        try {
            if (author === void 0 || author == null || isNaN(author.id)) return;

            let doUpdate = false;
            let values: any = {};
            if (author.job !== void 0 && author.job !== null) {
                values.job = author.job;
                doUpdate = true;
            }

            if (author.name !== void 0 && author.name !== null) {
                values.name = author.name;
                doUpdate = true;
            }

            if (!doUpdate) return;

            try {
                await this.db
                    .updateTable("authors")
                    .set(values)
                    .where("id", "=", author.id)
                    .executeTakeFirst();
            }
            catch (e) {
                if (e.toString().indexOf("duplicate key") >= 0) {
                    throw new Error(`Autor s menom "${author.name}" uz existuje`);
                }
                throw new Error(`[addAuthorUnique] ${e}`)
            }
        }
        catch (e) {
            throw new Error(`[updateAuthor] ${e}`)
        }
    }


    async deleteAuthorAndDeps(authorId: number): Promise<void> {
        try {
            if (isNaN(authorId)) return;

            if (authorId === 0) return; // aby sme si nepomazali adminov!

            await this.db
                .deleteFrom("articles")
                .where("author_id", "=", authorId)
                .execute();

            await this.db
                .deleteFrom("users")
                .where("author_id", "=", authorId)
                .execute();

            await this.db
                .deleteFrom("authors")
                .where("id", "=", authorId)
                .execute();
        }
        catch (e) {
            throw new Error(`[deleteAuthor] ${e}`)
        }
    }


    async getCategoryAll(): Promise<ICategory[]> {
        var data = await this.db
            .selectFrom("categories")
            .selectAll()
            .execute();

        return data.map(c => {
            return {
                id: c.id,
                name: c.name
            }
        });
    }


    async addArticle(prms: IAddArticlePrms): Promise<number> {
        try {
            const data = await this.db
                .insertInto("articles")
                .values({
                    author_id: prms.author_id,
                    category_id: prms.category_id,
                    title: prms.title,
                    uvod: prms.uvod,
                    content_plain: prms.content_plain,
                    tags: this.tagsToString(prms.tags)
                })
                .returning(["id"])
                .executeTakeFirst();

            return data.id;
        }
        catch (e) {
            throw new Error(`[addArticle] ${e}`)
        }
    }


    async getArticles(filter: IGetArticlesPrms): Promise<{ totalCount: number, articles: IArticleFull[] }> {
        try {
            let query = this.db
                .selectFrom("articles")
                .leftJoin("categories", "categories.id", "articles.category_id")
                .leftJoin("authors", "authors.id", "articles.author_id");

            if (filter.authorId !== void 0 && filter.authorId !== 0) {
                query = query.where("articles.author_id", "=", filter.authorId);
            }

            const totalCount = await query
                .select((eb) => eb.fn.countAll<number>().as("count"))
                .executeTakeFirst();

            const data = await query
                .selectAll("articles")
                .select(["categories.name as catagory_name"])
                .select(["authors.name as author_name"])
                .orderBy(["articles.id desc"])
                .offset((filter.page - 1) * filter.perPage)
                .limit(filter.perPage)
                .execute();
            if (data === void 0 || data === null) return { totalCount: 0, articles: [] };

            const articles = data.map(row => {
                return {
                    id: row.id,
                    publication_datetime: row.publication_date,
                    author_id: row.author_id,
                    author: {
                        id: row.author_id,
                        name: row.author_name
                    },
                    category_id: row.category_id,
                    category: {
                        id: row.category_id,
                        name: row.catagory_name
                    },
                    title: row.title,
                    uvod: row.uvod,
                    content_plain: "", // bez contentu!
                    tags: this.stringToTags(row.tags)
                };
            })

            return { totalCount: totalCount.count, articles: articles };
        }
        catch (e) {
            throw new Error(`[getArticles] ${e}`)
        }
    }


    async getArticle(articleId: number): Promise<IArticleFull> {
        try {
            const data = await this.db
                .selectFrom("articles")
                .leftJoin("categories", "categories.id", "articles.category_id")
                .leftJoin("authors", "authors.id", "articles.author_id")
                .where(eb => eb("articles.id", "=", articleId))
                .selectAll("articles")
                .select(["categories.name as catagory_name"])
                .select(["authors.name as author_name"])
                .executeTakeFirst();
            if (data === void 0 || data === null) return null;

            return {
                id: data.id,
                publication_datetime: data.publication_date,
                author_id: data.author_id,
                author: {
                    id: data.author_id,
                    name: data.author_name
                },
                category_id: data.category_id,
                category: {
                    id: data.category_id,
                    name: data.catagory_name
                },
                title: data.title,
                uvod: data.uvod,
                content_plain: data.content_plain,
                tags: this.stringToTags(data.tags)
            };
        }
        catch (e) {
            throw new Error(`[getArticle] ${e}`)
        }
    }


    async updateArticle(data: IUpdateArticlePrms): Promise<void> {
        try {

            let doUpdate = false;
            let values: any = {};

            if (data.category_id !== void 0 && data.category_id !== 0) {
                values.category_id = data.category_id;
                doUpdate = true;
            }

            if (data.title !== void 0 && data.title !== null) {
                values.title = data.title;
                doUpdate = true;
            }

            if (data.uvod !== void 0 && data.uvod !== null) {
                values.uvod = data.uvod;
                doUpdate = true;
            }

            if (data.content_plain !== void 0 && data.content_plain !== null) {
                values.content_plain = data.content_plain;
                doUpdate = true;
            }

            if (data.tags !== void 0 && data.tags !== null) {
                values.tags = this.tagsToString(data.tags);
                doUpdate = true;
            }

            if (!doUpdate) return;

            await this.db
                .updateTable("articles")
                .set(values)
                .where("id", "=", data.id)
                .execute();
        }
        catch (e) {
            throw new Error(`[updateArticle] ${e}`)
        }
    }


    async deleteArticle(articleId: number): Promise<void> {
        try {
            await this.db
                .deleteFrom("articles")
                .where("id", "=", articleId)
                .execute();
        }
        catch (e) {
            throw new Error(`[deleteArticle] ${e}`)
        }
    }

    // #endregion interface IDataStorage

}