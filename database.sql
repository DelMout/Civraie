-- Read instructions on README for setting up the database on MySQL server

CREATE DATABASE civraie CHARACTER SET 'utf8mb4';
USE civraie;

CREATE TABLE users
(
id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,    
nom VARCHAR(255) NOT NULL,
prenom VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
phone VARCHAR(255),
password VARCHAR(255) NOT NULL,
jeton VARCHAR(255) NOT NULL,
last_connect DATE NOT NULL,
comment VARCHAR(255),
isAdmin TINYINT DEFAULT 0,
consent_RGPD TINYINT NOT NULL,
consent_date DATE NOT NULL
)
ENGINE=INNODB;

CREATE TABLE producers
(
id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
nom VARCHAR(255) NOT NULL,
prenom VARCHAR(255),
entreprise VARCHAR(255) NOT NULL,  
products VARCHAR(255), 
address VARCHAR(255) NOT NULL,
phone VARCHAR(255),
email VARCHAR(255),
site_web VARCHAR(255)
)
ENGINE=INNODB;

CREATE TABLE categories
(
id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
category VARCHAR(255) NOT NULL,
cloture_day VARCHAR(255) NOT NULL,
class VARCHAR(255) NOT NULL,
priority TINYINT NOT NULL

)
ENGINE=INNODB;


CREATE TABLE products
(
id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,    
product VARCHAR(255) NOT NULL,
producerId SMALLINT UNSIGNED NOT NULL,
categoryId SMALLINT UNSIGNED NOT NULL,
cloturedayId SMALLINT UNSIGNED NOT NULL,
price DECIMAL(5,2) NOT NULL,
unite_vente VARCHAR(255) NOT NULL,
unity VARCHAR(255),
stock_manag TINYINT,
stock_init INT ,
stock_updated INT,
stock_in_date DATE ,
ordering TINYINT, 
active TINYINT DEFAULT 0,
active_date DATE ,
photo VARCHAR(255),
CONSTRAINT fk_producerId_product FOREIGN KEY (producerId) REFERENCES producers(id)
ON DELETE CASCADE
ON UPDATE CASCADE,
CONSTRAINT fk_categoryId_product FOREIGN KEY (categoryId) REFERENCES categories(id)
ON DELETE CASCADE
ON UPDATE CASCADE

)
ENGINE=INNODB;

CREATE TABLE orders
(
id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,    
userId SMALLINT UNSIGNED NOT NULL,
productId SMALLINT UNSIGNED NOT NULL,
delivery_date VARCHAR(255) NOT NULL,
quantity INT NOT NULL,
escarg TINYINT NOT NULL,
order_date DATE NOT NULL,
CONSTRAINT fk_userId_order FOREIGN KEY (userId) REFERENCES users(id)
ON DELETE CASCADE
ON UPDATE CASCADE,
CONSTRAINT fk_productId_order FOREIGN KEY (productId) REFERENCES products(id)
ON DELETE CASCADE
ON UPDATE CASCADE
)
ENGINE=INNODB;

CREATE TABLE informations
(
item VARCHAR(255) NOT NULL ,
title VARCHAR(255),
content VARCHAR(255) NOT NULL,
)
ENGINE=INNODB;
