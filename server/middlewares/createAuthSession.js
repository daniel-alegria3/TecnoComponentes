const session = require('express-session');
// TODO: averiguar e implementar 'Redis' en conjunto con express-session (easy)

function createAuthSession({ cookie_name, secret, primary_key }) {
    const auth = {};

    auth.cookie_name = cookie_name;
    auth.secret = secret;
    auth.primary_key = primary_key; // la presensia de esta llave en req.session
                                    // indica si el login fue exitoso

    /// Permite que router use express-session
    auth.init = (router) => {
        router.use(session({
            name: auth.cookie_name,
            secret: auth.secret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false, // set to true in production with HTTPS
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60 // 1 hour
            }
        }));
    };


    /// METODOS
    // Placeholder to override
    auth.register = (req, res) => {
        res.status(501).json({ error: 'Metodo de register no implementado' });
    };

    // Placeholder to override
    auth.login = (req, res) => {
        res.status(501).json({ error: 'Metodo de login no implementado' });
    };

    auth.requireLogin = (req, res, next) => {
        if (!req.session[auth.primary_key]) {
            return res.status(401).json({ error: 'No ha iniciado sesión.' });
        }
        next();
    };

    auth.isLoggedIn = (req, res) => {
        if (req.session[auth.primary_key]) {
            res.json({ loggedIn: true, [primary_key]: req.session[auth.primary_key] });
        } else {
            res.json({ loggedIn: false });
        }
    };

    auth.logout = (req, res) => {
        req.session.destroy(() => {
            res.clearCookie(auth.cookie_name);
            res.json({ success: true });
        });
    };

    return auth;
}

module.exports = createAuthSession;

