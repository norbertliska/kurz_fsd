

/*
drop table articles;
drop table categories;
drop table users;
drop table authors;
*/

CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    job VARCHAR(100) NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    author_id INT NOT NULL,
	is_admin INT NOT NULL
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    publication_date DATE DEFAULT CURRENT_TIMESTAMP,
    author_id INT NOT NULL,
    category_id INT NOT null,
    title VARCHAR(50) NOT NULL,
    uvod VARCHAR(100) NOT NULL,
    content_plain VARCHAR(20000) NOT NULL,
    tags VARCHAR(200) NOT NULL
);


INSERT INTO authors ("name", job) VALUES('Jan Smrek', 'záhradník');
INSERT INTO authors ("name", job) VALUES('Peter Vidlička', 'amaterksky kuchár');

INSERT INTO users (login, "password", author_id, is_admin) VALUES('admin', 'adminpwd', 0, 1);
INSERT INTO users (login, "password", author_id, is_admin) VALUES('js', 'jspwd', 1, 0);
INSERT INTO users (login, "password", author_id, is_admin) VALUES('pv', 'pvpwd', 2, 0);

INSERT INTO categories("name") VALUES('šport');
INSERT INTO categories("name") VALUES('automoto');
INSERT INTO categories("name") VALUES('beh');
INSERT INTO categories("name") VALUES('fitness');
INSERT INTO categories("name") VALUES('záhrada');
INSERT INTO categories("name") VALUES('varím varíš varíme');

INSERT INTO public.articles(author_id, category_id, title, uvod, content_plain, tags) VALUES(1, 5, 'Siatie trávy', 'Každý chce maž pekný trávnik.', 'Trávnik... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis ligula quis libero faucibus iaculis. Integer interdum elementum mauris non euismod. Fusce velit libero, dignissim at libero at, tincidunt eleifend dui. Quisque ut elit eleifend lorem tincidunt eleifend sed nec dui. Phasellus a semper ipsum. In nec molestie dolor.', 'tráva;jar;siatie;záhrada');
INSERT INTO public.articles(author_id, category_id, title, uvod, content_plain, tags) VALUES(1, 5, 'Pekná mrkva', 'Kto by odolal čerstvej mrkvičke?.', 'Mrkva... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis ligula quis libero faucibus iaculis. Integer interdum elementum mauris non euismod. Fusce velit libero, dignissim at libero at, tincidunt eleifend dui. Quisque ut elit eleifend lorem tincidunt eleifend sed nec dui. Phasellus a semper ipsum. In nec molestie dolor.', 'mrkva;záhrada;bio;zdravie;jedlo');
INSERT INTO public.articles(author_id, category_id, title, uvod, content_plain, tags) VALUES(1, 5, 'Zemiaky', 'Ako na zemiaky', 'Zemiaky... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis ligula quis libero faucibus iaculis. Integer interdum elementum mauris non euismod. Fusce velit libero, dignissim at libero at, tincidunt eleifend dui. Quisque ut elit eleifend lorem tincidunt eleifend sed nec dui. Phasellus a semper ipsum. In nec molestie dolor.', 'zemiaky;záhrada;bio');
INSERT INTO public.articles(author_id, category_id, title, uvod, content_plain, tags) VALUES(1, 5, 'Jablka', 'Ako na jablka', 'Jablka... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis ligula quis libero faucibus iaculis. Integer interdum elementum mauris non euismod. Fusce velit libero, dignissim at libero at, tincidunt eleifend dui. Quisque ut elit eleifend lorem tincidunt eleifend sed nec dui. Phasellus a semper ipsum. In nec molestie dolor.', 'jablka;záhrada;bio');
INSERT INTO public.articles(author_id, category_id, title, uvod, content_plain, tags) VALUES(1, 5, 'Hrusky', 'Ako na hrusky', 'Hrusky... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis ligula quis libero faucibus iaculis. Integer interdum elementum mauris non euismod. Fusce velit libero, dignissim at libero at, tincidunt eleifend dui. Quisque ut elit eleifend lorem tincidunt eleifend sed nec dui. Phasellus a semper ipsum. In nec molestie dolor.', 'hrusky;záhrada;bio');

INSERT INTO public.articles(author_id, category_id, title, uvod, content_plain, tags) VALUES(2, 6, 'Domáci chlieb', 'Kto by odolal čerstvému chlebíku?.', 'Chlieb... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis ligula quis libero faucibus iaculis. Integer interdum elementum mauris non euismod. Fusce velit libero, dignissim at libero at, tincidunt eleifend dui. Quisque ut elit eleifend lorem tincidunt eleifend sed nec dui. Phasellus a semper ipsum. In nec molestie dolor.', 'chlieb;jedlo;varenie');
INSERT INTO public.articles(author_id, category_id, title, uvod, content_plain, tags) VALUES(2, 6, 'Domáca palenka', 'Ako vypáliť?', 'Pálenka... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis ligula quis libero faucibus iaculis. Integer interdum elementum mauris non euismod. Fusce velit libero, dignissim at libero at, tincidunt eleifend dui. Quisque ut elit eleifend lorem tincidunt eleifend sed nec dui. Phasellus a semper ipsum. In nec molestie dolor.', '40%;alkohol');
INSERT INTO public.articles(author_id, category_id, title, uvod, content_plain, tags) VALUES(2, 6, 'Domáca majoneza', 'Majoneza? Ziadny problem.', 'majoneza... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis ligula quis libero faucibus iaculis. Integer interdum elementum mauris non euismod. Fusce velit libero, dignissim at libero at, tincidunt eleifend dui. Quisque ut elit eleifend lorem tincidunt eleifend sed nec dui. Phasellus a semper ipsum. In nec molestie dolor.', 'majoneza;jedlo;studenakuchyna');

