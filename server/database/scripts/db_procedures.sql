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
        -- Calculate available stock by subtracting total quantities in all shopping carts
        CAST(COALESCE(p.stock - IFNULL(cart_totals.total_in_carts, 0), p.stock) AS int) AS available_stock,
        p.on_sale,
        p.status,
        p.specs
    FROM Product p
    JOIN Category c ON p.category = c.id_category
    LEFT JOIN (
        SELECT
            scp.id_product,
            SUM(scp.quantity) AS total_in_carts
        FROM Shopping_Cart_Product scp
        JOIN Shopping_Cart sc ON scp.id_cart = sc.id_cart
        -- Only count active shopping carts (you might want to add additional filters here)
        GROUP BY scp.id_product
    ) cart_totals ON p.id_product = cart_totals.id_product
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
        -- Calculate available stock by subtracting total quantities in all shopping carts
        CAST(COALESCE(p.stock - IFNULL(cart_totals.total_in_carts, 0), p.stock) AS int) AS available_stock,
        p.on_sale,
        p.status,
        p.specs
    FROM Product p
    JOIN Category c ON p.category = c.id_category
    LEFT JOIN (
        SELECT
            scp.id_product,
            SUM(scp.quantity) AS total_in_carts
        FROM Shopping_Cart_Product scp
        JOIN Shopping_Cart sc ON scp.id_cart = sc.id_cart
        -- Only count active shopping carts (you might want to add additional filters here)
        GROUP BY scp.id_product
    ) cart_totals ON p.id_product = cart_totals.id_product
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
    DECLARE available_stock INT;

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

    -- Obtener precio y stock disponible usando la misma lógica que ObtenerProductosActivos
    SELECT
        p.price,
        COALESCE(p.stock - IFNULL(cart_totals.total_in_carts, 0), p.stock)
    INTO product_price, available_stock
    FROM Product p
    LEFT JOIN (
        SELECT
            scp.id_product,
            SUM(scp.quantity) AS total_in_carts
        FROM Shopping_Cart_Product scp
        JOIN Shopping_Cart sc ON scp.id_cart = sc.id_cart
        GROUP BY scp.id_product
    ) cart_totals ON p.id_product = cart_totals.id_product
    WHERE p.id_product = in_id_product AND p.status = TRUE;

      -- Validar stock disponible (considerando lo que está en carritos)
    IF available_stock IS NULL OR available_stock < in_quantity THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuficiente considerando productos en carritos.';
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

--cliente.crearDireccionCliente
CREATE PROCEDURE crear_direccion_cliente(
    IN p_id_client INT,
    IN p_city VARCHAR(50),
    IN p_country VARCHAR(50),
    IN p_physical_address VARCHAR(200)
)
BEGIN
    DECLARE client_exists INT;
    DECLARE error_message VARCHAR(255);

    -- Verificar si el cliente existe
    SELECT COUNT(*) INTO client_exists
    FROM Client
    WHERE id_client = p_id_client;

    -- Validar campos no nulos
    IF p_id_client IS NULL THEN
        SET error_message = 'Error: El ID del cliente no puede ser nulo.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSEIF client_exists = 0 THEN
        SET error_message = CONCAT('Error: El cliente con ID ', p_id_client, ' no existe.');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSEIF p_city IS NULL OR p_city = '' THEN
        SET error_message = 'Error: La ciudad no puede estar vacía.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSEIF p_country IS NULL OR p_country = '' THEN
        SET error_message = 'Error: El país no puede estar vacío.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSEIF p_physical_address IS NULL OR p_physical_address = '' THEN
        SET error_message = 'Error: La dirección física no puede estar vacía.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSE
        -- Todos los datos son válidos, proceder con la inserción
        INSERT INTO Address (id_client, city, country, physical_address)
        VALUES (p_id_client, p_city, p_country, p_physical_address);

    END IF;
END;
//

CREATE PROCEDURE obtener_direcciones_cliente(
    IN p_id_client INT
)
BEGIN
    DECLARE client_exists INT;
    DECLARE error_message VARCHAR(255);

    -- Verificar si el cliente existe
    SELECT COUNT(*) INTO client_exists
    FROM Client
    WHERE id_client = p_id_client;

    -- Validar parámetro
    IF p_id_client IS NULL THEN
        SET error_message = 'Error: El ID del cliente no puede ser nulo.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSEIF client_exists = 0 THEN
        SET error_message = CONCAT('Error: El cliente con ID ', p_id_client, ' no existe.');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSE
        -- Obtener todas las direcciones del cliente
        SELECT
            id_address,
            id_client,
            city,
            country,
            physical_address,
            created_at,
            updated_at
        FROM Address
        WHERE id_client = p_id_client
        ORDER BY created_at DESC;
    END IF;
END;
//

CREATE PROCEDURE ver_direcciones_cliente(
    IN p_id_client INT
)
BEGIN
    DECLARE client_exists INT;
    DECLARE error_message VARCHAR(255);

    -- Verificar si el cliente existe
    SELECT COUNT(*) INTO client_exists
    FROM Client
    WHERE id_client = p_id_client;

    -- Validar parámetro
    IF p_id_client IS NULL THEN
        SET error_message = 'Error: El ID del cliente no puede ser nulo.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSEIF client_exists = 0 THEN
        SET error_message = CONCAT('Error: El cliente con ID ', p_id_client, ' no existe.');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSE
        -- Obtener todas las direcciones del cliente (solo con los campos existentes)
        SELECT
            id_address,
            id_client,
            city,
            country,
            physical_address
        FROM Address
        WHERE id_client = p_id_client;
    END IF;
END;
//

-- cliente.editarDireccionCliente
CREATE PROCEDURE editar_direccion_cliente(
    IN p_id_client INT,
    IN p_id_address INT,
    IN p_city VARCHAR(50),
    IN p_country VARCHAR(50),
    IN p_physical_address VARCHAR(200)
)
BEGIN
    DECLARE client_exists INT;
    DECLARE address_exists INT;
    DECLARE address_belongs_to_client INT;
    DECLARE error_message VARCHAR(255);

    -- Verificar si el cliente existe
    SELECT COUNT(*) INTO client_exists FROM Client WHERE id_client = p_id_client;

    -- Verificar si la dirección existe
    SELECT COUNT(*) INTO address_exists FROM Address WHERE id_address = p_id_address;

    -- Verificar que la dirección pertenezca al cliente
    SELECT COUNT(*) INTO address_belongs_to_client
    FROM Address
    WHERE id_address = p_id_address AND id_client = p_id_client;

    -- Validaciones
    IF p_id_client IS NULL THEN
        SET error_message = 'Error: El ID del cliente no puede ser nulo.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSEIF p_id_address IS NULL THEN
        SET error_message = 'Error: El ID de la dirección no puede ser nulo.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSEIF client_exists = 0 THEN
        SET error_message = CONCAT('Error: El cliente con ID ', p_id_client, ' no existe.');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSEIF address_exists = 0 THEN
        SET error_message = CONCAT('Error: La dirección con ID ', p_id_address, ' no existe.');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSEIF address_belongs_to_client = 0 THEN
        SET error_message = 'Error: La dirección no pertenece al cliente especificado.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSEIF p_city IS NULL OR p_city = '' THEN
        SET error_message = 'Error: La ciudad no puede estar vacía.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSEIF p_country IS NULL OR p_country = '' THEN
        SET error_message = 'Error: El país no puede estar vacío.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSEIF p_physical_address IS NULL OR p_physical_address = '' THEN
        SET error_message = 'Error: La dirección física no puede estar vacía.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSE
        -- Actualización sin mensaje de confirmación
        UPDATE Address
        SET
            city = p_city,
            country = p_country,
            physical_address = p_physical_address
        WHERE
            id_address = p_id_address AND
            id_client = p_id_client;
    END IF;
END;
//

CREATE PROCEDURE eliminar_direccion_cliente(
    IN p_id_client INT,
    IN p_id_address INT
)
BEGIN
    DECLARE client_exists INT;
    DECLARE address_exists INT;
    DECLARE address_belongs_to_client INT;
    DECLARE error_message VARCHAR(255);

    -- Verificar si el cliente existe
    SELECT COUNT(*) INTO client_exists FROM Client WHERE id_client = p_id_client;

    -- Verificar si la dirección existe
    SELECT COUNT(*) INTO address_exists FROM Address WHERE id_address = p_id_address;

    -- Verificar que la dirección pertenezca al cliente
    SELECT COUNT(*) INTO address_belongs_to_client
    FROM Address
    WHERE id_address = p_id_address AND id_client = p_id_client;

    -- Validaciones
    IF p_id_client IS NULL THEN
        SET error_message = 'Error: El ID del cliente no puede ser nulo.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSEIF p_id_address IS NULL THEN
        SET error_message = 'Error: El ID de la dirección no puede ser nulo.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSEIF client_exists = 0 THEN
        SET error_message = CONCAT('Error: El cliente con ID ', p_id_client, ' no existe.');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSEIF address_exists = 0 THEN
        SET error_message = CONCAT('Error: La dirección con ID ', p_id_address, ' no existe.');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSEIF address_belongs_to_client = 0 THEN
        SET error_message = 'Error: La dirección no pertenece al cliente especificado.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSE
        -- Eliminar la dirección
        DELETE FROM Address
        WHERE id_address = p_id_address AND id_client = p_id_client;
    END IF;
END;
//

-- cliente.obtenerHistorialCompras
CREATE PROCEDURE obtener_historial_compras_cliente(
    IN p_id_client INT
)
BEGIN
    DECLARE client_exists INT;
    DECLARE error_message VARCHAR(255);

    -- Verificar si el cliente existe
    SELECT COUNT(*) INTO client_exists FROM Client WHERE id_client = p_id_client;

    IF p_id_client IS NULL THEN
        SET error_message = 'Error: El ID del cliente no puede ser nulo.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSEIF client_exists = 0 THEN
        SET error_message = CONCAT('Error: El cliente con ID ', p_id_client, ' no existe.');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
    ELSE
        -- Obtener historial de compras
        SELECT
            od.id_order_detail,
            od.date_added AS fecha_compra,
            po.id_product,
            p.name AS nombre_producto,
            p.images_path,
            po.price_at_buy AS precio_compra,
            po.quantity AS cantidad,
            (po.price_at_buy * po.quantity) AS subtotal,
            cat.name AS categoria
        FROM
            Orden_Detail od
        JOIN
            Product_Order po ON od.id_order_detail = po.id_order_detail
        JOIN
            Product p ON po.id_product = p.id_product
        JOIN
            Category cat ON p.category = cat.id_category
        WHERE
            po.id_cart IN (SELECT id_cart FROM Shopping_Cart WHERE id_client = p_id_client)
        ORDER BY
            od.date_added DESC;
    END IF;
END;
//


DELIMITER ;

SHOW PROCEDURE STATUS WHERE Db = DATABASE();

