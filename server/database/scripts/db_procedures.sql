DELIMITER //

--########## Procedimientos almacenados Cliente
-- Procedimiento para crear cliente con su carrito (cliente.register)
CREATE PROCEDURE agregar_cliente(
    IN in_name VARCHAR(100),
    IN in_surname VARCHAR(100),
    IN in_mail VARCHAR(255),
    IN in_password_encrypted VARCHAR(255)
)
BEGIN
    DECLARE last_id INT;

    -- Validación de entrada: campos nulos
    IF in_mail IS NULL OR in_password_encrypted IS NULL OR in_name IS NULL OR in_surname IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Ningún campo puede ser nulo.';
    END IF;

    -- Validación: correo ya registrado
    IF EXISTS (SELECT 1 FROM Client WHERE mail = in_mail) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El correo ya está registrado.';
    END IF;

    -- Intentar insertar el cliente
    BEGIN
        DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        BEGIN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Fallo al intentar registrar al cliente.';
        END;

        INSERT INTO Client (name, surname, mail, password_encrypted)
        VALUES (in_name, in_surname, in_mail, in_password_encrypted);
    END;

    SET last_id = LAST_INSERT_ID();

    -- Insertar en la tabla Shopping_Cart
    BEGIN
        DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        BEGIN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Fallo al crear el carrito de compras.';
        END;

        INSERT INTO Shopping_Cart (id_client)
        VALUES (last_id);
    END;
END;
//

-- Procedimiento para validar a un cliente con su contraseña (cliente.login)
CREATE PROCEDURE login_cliente(
    IN in_mail VARCHAR(255),
    IN in_password_encrypted VARCHAR(255)
)
BEGIN
    DECLARE client_id INT;

    -- Validación de entrada: campos nulos
    IF in_mail IS NULL OR in_password_encrypted IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El correo o la contraseña no pueden ser nulos.';
    END IF;

    -- Verificar si el correo está registrado
    IF NOT EXISTS (
        SELECT 1 FROM Client WHERE mail = in_mail
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El correo no está registrado.';
    END IF;

    -- Validar que la contraseña sea correcta para ese correo
    SELECT id_client INTO client_id
    FROM Client
    WHERE mail = in_mail AND password_encrypted = in_password_encrypted;

    IF client_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Contraseña incorrecta.';
    END IF;
END;
//

-- Client.getAllProducts_client
CREATE PROCEDURE ObtenerProductosActivos()
BEGIN
    SELECT
        p.id_product,
        p.name,
        p.images_path,
        p.brand,
        c.name AS category,
        p.description,
        p.price,
        p.stock,
        p.on_sale,
        p.status,
        p.specs
    FROM Product p
    JOIN Category c ON p.category = c.id_category
    WHERE p.status = TRUE;
END;
//

-- Procedimiento para que un cliente pueda ver su carrito (cliente.ver_carrito)
CREATE PROCEDURE ver_carrito(
    IN in_id_client INT
)
BEGIN
    DECLARE client_cart_id INT;

    -- Validación de entrada: campo nulo
    IF in_id_client IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El ID del cliente no puede ser nulo.';
    END IF;

    -- Obtener el ID del carrito del cliente
    SELECT id_cart INTO client_cart_id
    FROM Shopping_Cart
    WHERE id_client = in_id_client
    LIMIT 1;

    IF client_cart_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El cliente no tiene un carrito de compras.';
    END IF;

    -- Seleccionar los productos en el carrito del cliente
    -- CHANGELOG: added quantity
    SELECT
        p.id_product as id_product,
        p.name,
        p.brand,
        p.category,
        p.description,
        p.images_path,
        p.price,
        scp.quantity as quantity,
        scp.date_added
    FROM Product p
    JOIN Shopping_Cart_Product scp ON p.id_product = scp.id_product
    WHERE scp.id_cart = client_cart_id
    ORDER BY scp.date_added DESC;
END;
//

-- Procedimiento para que un cliente pueda agregar algo a su carrito (cliente.agregar_carrito)
CREATE PROCEDURE agregar_carrito(
    IN in_id_client INT,
    IN in_id_product INT,
    IN in_quantity INT
)
BEGIN
    DECLARE client_cart_id INT;

    -- Validar que el producto exista
    IF NOT EXISTS (
        SELECT 1 FROM Product WHERE id_product = in_id_product
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El producto especificado no existe.';
    END IF;

    -- Buscar el carrito del cliente
    SELECT id_cart INTO client_cart_id
    FROM Shopping_Cart
    WHERE id_client = in_id_client
    LIMIT 1;

    -- Validar existencia del carrito
    IF client_cart_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se encontró un carrito de compras para este cliente.';
    END IF;

    -- Validar que el producto no esté ya en el carrito
    IF EXISTS (
        SELECT 1 FROM Shopping_Cart_Product
        WHERE id_cart = client_cart_id AND id_product = in_id_product
    ) THEN
        -- Actualizar la columna 'quantity'
        -- TODO: actualizar 'date_added'?
        UPDATE Shopping_Cart_Product
        SET quantity = in_quantity
        WHERE id_cart = client_cart_id AND id_product = in_id_product;
    ELSE
        -- Insertar el producto en el carrito
        INSERT INTO Shopping_Cart_Product (id_cart, id_product, quantity, date_added)
        VALUES (client_cart_id, in_id_product, in_quantity, NOW());
    END IF;

END;
//

-- Procedimiento para que un cliente pueda eliminar algo de su carrito (cliente.vaciar_carrito)
CREATE PROCEDURE vaciar_carrito(
    IN in_id_client INT,
    IN in_id_product INT
)
BEGIN
    DECLARE client_cart_id INT;
    DECLARE product_exists INT;

    SELECT sc.id_cart INTO client_cart_id
    FROM Shopping_Cart sc
    JOIN Shopping_Cart_Product scp ON sc.id_cart = scp.id_cart
    WHERE sc.id_client = in_id_client
    LIMIT 1;

    IF client_cart_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El cliente no tiene un carrito de compras.';
    ELSE
        SELECT COUNT(*) INTO product_exists
        FROM Shopping_Cart_Product
        WHERE id_cart = client_cart_id AND id_product = in_id_product;

        IF product_exists = 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El producto no existe en el carrito.';
        ELSE
            DELETE FROM Shopping_Cart_Product
            WHERE id_cart = client_cart_id AND id_product = in_id_product;
        END IF;
    END IF;
END;
//

--########## Procedimientos almacenados Productos
-- product.createProduct
CREATE PROCEDURE CrearProducto(
    IN name_in VARCHAR(100),
    IN images_path_in VARCHAR(100),
    IN brand_in VARCHAR(50),
    IN category_name_in VARCHAR(50),
    IN description_in TEXT,
    IN price_in DECIMAL(10,2),
    IN stock_in INT,
    OUT new_id INT
)
BEGIN
    DECLARE category_id INT;

    -- Buscar id de la categoría
    SELECT id_category INTO category_id
    FROM Category
    WHERE name = category_name_in
    LIMIT 1;

    -- Si no se encuentra la categoría, crearla con ese valor
    IF category_id IS NULL THEN
        INSERT INTO Category (name) VALUES (category_name_in);
        SET category_id = LAST_INSERT_ID();
    END IF;

    -- Insertar producto
    INSERT INTO Product (
        name, images_path, brand, category,
        description, price, stock,
        on_sale, status, specs
    ) VALUES (
        name_in, images_path_in, brand_in, category_id,
        description_in, price_in, stock_in,
        100, TRUE, NULL
    );

    SET new_id = LAST_INSERT_ID();
END;
//


-- product.updateProduct
CREATE PROCEDURE ActualizarProducto(
    IN id_product_in INT,
    IN name_in VARCHAR(100),
    IN images_path_in VARCHAR(100),
    IN brand_in VARCHAR(50),
    IN category_name_in VARCHAR(50),
    IN description_in TEXT,
    IN price_in DECIMAL(10,2),
    IN stock_in INT
)
BEGIN
    DECLARE category_id INT;

    -- Buscar id de la categoría
    SELECT id_category INTO category_id
    FROM Category
    WHERE name = category_name_in
    LIMIT 1;

    -- Si no se encuentra la categoría, lanzar error
    IF category_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Categoría no encontrada';
    END IF;

    -- Actualizar producto
    UPDATE Product
    SET
        name = name_in,
        images_path = images_path_in,
        brand = brand_in,
        category = category_id,
        description = description_in,
        price = price_in,
        stock = stock_in
    WHERE id_product = id_product_in;
END;
//

-- product.deleteProduct
CREATE PROCEDURE EliminarProductoLogico(
    IN id_product_in INT
)
BEGIN
    -- Verificar si el producto existe
    IF EXISTS (
        SELECT 1 FROM Product WHERE id_product = id_product_in
    ) THEN
        -- Actualizar el estado a FALSE (inactivo)
        UPDATE Product
        SET status = FALSE
        WHERE id_product = id_product_in;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Producto no encontrado';
    END IF;
END;
//

-- product.getProductById
CREATE PROCEDURE ObtenerProductoPorId(
    IN id_product_in INT
)
BEGIN
    SELECT
        p.id_product,
        p.name,
        p.images_path,
        p.brand,
        c.name AS category,
        p.description,
        p.price,
        p.stock,
        p.on_sale,
        p.status,
        p.specs
    FROM Product p
    JOIN Category c ON p.category = c.id_category
    WHERE p.id_product = id_product_in;
END;
//

-- product.getCategoryByIdProduct
CREATE PROCEDURE ObtenerCategoriaDeProducto(
    IN id_product_in INT
)
BEGIN
    SELECT
        c.id_category,
        c.name AS category_name
    FROM Product p
    JOIN Category c ON p.category = c.id_category
    WHERE p.id_product = id_product_in;
END;
//

-- product.updateProductSpecs
CREATE PROCEDURE ActualizarSpecsProducto(
    IN producto_id INT,
    IN specs_json BLOB
)
BEGIN
    UPDATE Product
    SET specs = specs_json
    WHERE id_product = producto_id;
END;
//

-- product.realizarCompra
CREATE PROCEDURE crear_orden()
BEGIN
    INSERT INTO Orden_Detail (date_added)
    VALUES (NOW());

    SELECT LAST_INSERT_ID() AS id;
END;
//

-- product.realizarCompra
CREATE PROCEDURE agregar_producto_orden(
    IN in_id_order_detail INT,
    IN in_id_client INT,
    IN in_id_product INT,
    IN in_quantity INT
)
BEGIN
    DECLARE client_cart_id INT;
    DECLARE product_price INT;
    DECLARE stock_actual INT;

    -- Validaciones
    IF in_id_order_detail IS NULL OR in_id_client IS NULL OR in_id_product IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Parámetros nulos no permitidos.';
    END IF;

    -- Obtener el id_cart del cliente
    SELECT id_cart INTO client_cart_id
    FROM Shopping_Cart
    WHERE id_client = in_id_client
    LIMIT 1;

    IF client_cart_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se encontró carrito para este cliente.';
    END IF;

    -- Validar que el producto exista en su carrito
    IF NOT EXISTS (
        SELECT 1 FROM Shopping_Cart_Product
        WHERE id_cart = client_cart_id AND id_product = in_id_product
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El producto no está en el carrito del cliente.';
    END IF;

    -- Obtener precio del producto
    SELECT price, stock INTO product_price, stock_actual
    FROM Product
    WHERE id_product = in_id_product;

    IF stock_actual IS NULL OR stock_actual < in_quantity THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuficiente.';
    END IF;

    -- Insertar en Product_Order
    INSERT INTO Product_Order (id_order_detail, id_cart, id_product, price_at_buy, quantity)
    VALUES (in_id_order_detail, client_cart_id, in_id_product, product_price, in_quantity);

    -- Disminuir stock
    UPDATE Product
    SET stock = stock - in_quantity
    WHERE id_product = in_id_product;

    -- Eliminar del carrito
    DELETE FROM Shopping_Cart_Product
    WHERE id_cart = client_cart_id AND id_product = in_id_product;
END;
//

DELIMITER ;

SHOW PROCEDURE STATUS WHERE Db = DATABASE();

