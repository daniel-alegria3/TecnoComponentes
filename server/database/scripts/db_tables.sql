CREATE TABLE `Client` (
  `id_client` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(100),
  `surname` varchar(100),
  `mail` varchar(100) UNIQUE,
  `password_encrypted` varchar(255)
);

CREATE TABLE `Shopping_Cart` (
  `id_cart` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_client` int
);

CREATE TABLE `Shopping_Cart_Product` (
  `id_cart` int NOT NULL,
  `id_product` int NOT NULL,
  `quantity` int NOT NULL,
  `date_added` datetime
);

CREATE TABLE `Address` (
  `id_address` int PRIMARY KEY AUTO_INCREMENT,
  `id_client` int NOT NULL,
  `city` varchar(50),
  `country` varchar(50),
  `physical_address` varchar(200)
);

CREATE TABLE `Product_Order` (
  `id_order_detail` int,
  `id_cart` int,
  `id_product` int,
  `price_at_buy` int,
  `quantity` int
);

CREATE TABLE `Orden_Detail` (
  `id_order_detail` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `date_added` datetime
);

CREATE TABLE `Product` (
  `id_product` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(100),
  `images_path` varchar(100),
  `brand` varchar(50),
  `category` int,
  `description` text,
  `price` decimal(10,2),
  `stock` int,
  `on_sale` int,
  `status` boolean,
  `specs` blob
);

CREATE TABLE `Category` (
  `id_category` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(50)
);

ALTER TABLE `Shopping_Cart` ADD FOREIGN KEY (`id_client`) REFERENCES `Client` (`id_client`);
ALTER TABLE `Shopping_Cart_Product` ADD FOREIGN KEY (`id_cart`) REFERENCES `Shopping_Cart` (`id_cart`);
ALTER TABLE `Shopping_Cart_Product` ADD FOREIGN KEY (`id_product`) REFERENCES `Product` (`id_product`);
ALTER TABLE `Address` ADD FOREIGN KEY (`id_client`) REFERENCES `Client` (`id_client`);
ALTER TABLE `Product_Order` ADD FOREIGN KEY (`id_order_detail`) REFERENCES `Orden_Detail` (`id_order_detail`);
ALTER TABLE `Product_Order` ADD FOREIGN KEY (`id_cart`) REFERENCES `Shopping_Cart` (`id_cart`);
ALTER TABLE `Product` ADD FOREIGN KEY (`category`) REFERENCES `Category` (`id_category`);

SHOW FULL TABLES;

