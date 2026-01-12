const User = require('../models/userModel');

const authentication = async (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) {
        return res.redirect('/login');
    }

    try {
        const user = await User.findById(token);
        if (!user) {
            return res.redirect('/login');
        }

        if (user.role === 'admin') {
            return res.redirect('/admin');
        }

        res.locals.user = user;
        next();
    } catch (err) {
        console.error('Auth Middleware Error:', err);
        return res.redirect('/login');
    }
};

const authenticationAdmin = async (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) {
        return res.redirect('/login');
    }

    try {
        const user = await User.findById(token);
        if (!user) {
            return res.redirect('/login');
        }

        if (user.role !== 'admin') {
            return res.redirect('/user');
        }

        res.locals.isAdmin = true;
        res.locals.user = user;
        next();
    } catch (err) {
        console.error('Auth Admin Middleware Error:', err);
        return res.redirect('/login');
    }
};

module.exports = { authentication, authenticationAdmin };
