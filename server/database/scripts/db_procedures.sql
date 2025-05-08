DELIMITER //

-- Procedimiento para crear cliente con su carrito (cliente.register)
CREATE PROCEDURE agregar_cliente(
    IN in_mail VARCHAR(255),
    IN in_password_encrypted VARCHAR(255)
)
BEGIN
    DECLARE last_id INT;

    -- Validación de entrada: campos nulos
    IF in_mail IS NULL OR in_password_encrypted IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El correo o la contraseña no pueden ser nulos.';
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

        INSERT INTO Client (mail, password_encrypted)
        VALUES (in_mail, in_password_encrypted);
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

DELIMITER ;

SHOW PROCEDURE STATUS WHERE Db = DATABASE();

