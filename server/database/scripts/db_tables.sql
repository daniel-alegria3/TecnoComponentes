CREATE TABLE `Client` (
  `id_client` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `mail` varchar(255),
  `password_encrypted` varchar(255)
);

CREATE TABLE `Shopping_Cart` (
  `id_client` int UNIQUE PRIMARY KEY NOT NULL
);

CREATE TABLE `Shopping_Cart_Detail` (
  `id_client` int NOT NULL,
  `id_product` int NOT NULL,
  PRIMARY KEY (`id_client`, `id_product`)
);

CREATE TABLE `Address` (
  `id_cliente` int PRIMARY KEY NOT NULL,
  `physical_address` varchar(255)
);

CREATE TABLE `Product_Order` (
  `id_product_order` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_cliente` int,
  `fecha` datetime
);

CREATE TABLE `Orden_Detail` (
  `id_orden_detalle` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_producto` int,
  `id_orden` int,
  `cantidad` int,
  `fecha` datetime,
  `precio_unitario` decimal(10,2)
);

CREATE TABLE `Product` (
  `id_product` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255),
  `images_path` varchar(255),
  `brand` varchar(255),
  `category` varchar(255),
  `description` text,
  `price` decimal(10,2),
  `stock` int
);

ALTER TABLE `Shopping_Cart` ADD FOREIGN KEY (`id_client`) REFERENCES `Client` (`id_client`);
ALTER TABLE `Shopping_Cart_Detail` ADD FOREIGN KEY (`id_client`) REFERENCES `Shopping_Cart` (`id_client`);
ALTER TABLE `Shopping_Cart_Detail` ADD FOREIGN KEY (`id_product`) REFERENCES `Product` (`id_product`);
ALTER TABLE `Address` ADD FOREIGN KEY (`id_cliente`) REFERENCES `Client` (`id_client`);
ALTER TABLE `Product_Order` ADD FOREIGN KEY (`id_cliente`) REFERENCES `Client` (`id_client`);
ALTER TABLE `Orden_Detail` ADD FOREIGN KEY (`id_producto`) REFERENCES `Product` (`id_product`);
ALTER TABLE `Orden_Detail` ADD FOREIGN KEY (`id_orden`) REFERENCES `Product_Order` (`id_product_order`);

SHOW FULL TABLES;

