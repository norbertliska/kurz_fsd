import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Articles {
  author_id: number;
  category_id: number;
  content_plain: string;
  id: Generated<number>;
  publication_date: Generated<Timestamp | null>;
  tags: string;
  title: string;
  uvod: string;
}

export interface Authors {
  id: Generated<number>;
  job: string;
  name: string;
}

export interface Categories {
  id: Generated<number>;
  name: string;
}

export interface Users {
  author_id: number;
  id: Generated<number>;
  is_admin: number;
  login: string;
  password: string;
}

export interface DB {
  articles: Articles;
  authors: Authors;
  categories: Categories;
  users: Users;
}
