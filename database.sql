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
isAdmin TINYINT DEFAULT 0
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
phone INT,
email VARCHAR(255)
)
ENGINE=INNODB;

CREATE TABLE dates
(
id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
latest_date_order DATE NOT NULL,
delivery_date DATE NOT NULL
)
ENGINE=INNODB;

CREATE TABLE products
(
id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,    
product VARCHAR(255) NOT NULL,
producerId SMALLINT UNSIGNED NOT NULL,
price_kg DECIMAL(5,2),
unite_vente VARCHAR(255) NOT NULL,
price_unite_vente DECIMAL(5,2),
stock_init INT NOT NULL,
stock_updated INT,
alert_stock INT NOT NULL,
ordering TINYINT, 
date_crea_pub DATE NOT NULL,
CONSTRAINT fk_producerId_product FOREIGN KEY (producerId) REFERENCES producers(id)
ON DELETE CASCADE
ON UPDATE CASCADE
)
ENGINE=INNODB;

CREATE TABLE orders
(
id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,    
userId SMALLINT UNSIGNED NOT NULL,
productId SMALLINT UNSIGNED NOT NULL,
quantity INT NOT NULL,
order_date DATE NOT NULL,
dateId SMALLINT UNSIGNED NOT NULL,
CONSTRAINT fk_userId_order FOREIGN KEY (userId) REFERENCES users(id)
ON DELETE CASCADE
ON UPDATE CASCADE,
CONSTRAINT fk_productId_order FOREIGN KEY (productId) REFERENCES products(id)
ON DELETE CASCADE
ON UPDATE CASCADE
CONSTRAINT fk_dateId_order FOREIGN KEY (dateId) REFERENCES dates(id)
ON DELETE CASCADE
ON UPDATE CASCADE
)
ENGINE=INNODB;

