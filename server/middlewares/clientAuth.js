const createAuthSession = require('./createAuthSession');
const pool = require('../database/db');

const clientAuth = createAuthSession({
    cookie_name: "my-client-cookie-name.sid",
    secret: "my-client-secret-key",
    primary_key: "id_client"
});

/// NOTE: Usar 'req.session.variable' para guardar una 'variable' en la session

clientAuth.register = async (req, res) => {
    const { mail, password } = req.body;

    if (!mail || mail.trim() === '' || !password || password.trim() === '') {
        return res.status(400).json({ error: 'Datos inválidos' });
    }

    try {
        const [result] = await pool.query(
            `CALL agregar_cliente(?, ?)`,
            [mail.trim(), password]
        );
        const [rows] = await pool.query('SELECT * FROM Client WHERE mail = ?', [mail.trim()]);
        if (rows.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
        req.session.id_client = rows[0].id_client;
        res.status(201).json({ message: 'Cliente registrado correctamente', loggedIn: true});
    } catch (error) {
        if (error?.sqlState === '45000') {
            console.error('Error en <cliente.register>:', error);
            res.status(500).json({ error: 'No se pudo crear el cliente: ' + error.sqlMessage});
        }
        else {
            console.error('Error en <cliente.register>:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

clientAuth.login = async (req, res) => {
    const { mail, password } = req.body;

    if (!mail || mail.trim() === '' || !password || password.trim() === '') {
        return res.status(400).json({ error: 'Datos inválidos' });
    }

    try {
        await pool.query(
            `CALL login_cliente(?, ?)`,
            [mail.trim(), password]
        );
        const [rows] = await pool.query('SELECT * FROM Client WHERE mail = ?', [mail.trim()]);
        req.session.id_client = rows[0].id_client;
        res.status(201).json({ message: 'Login exitoso', loggedIn: true});
    } catch (error) {
        if (error?.sqlState === '45000') {
            console.error('Error en <cliente.login>:', error);
            res.status(500).json({ error: 'Error en login: ' + error.sqlMessage});
        }
        else {
            console.error('Error en <cliente.login>:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = clientAuth;

