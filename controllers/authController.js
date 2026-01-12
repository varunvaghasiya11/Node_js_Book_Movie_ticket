const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const getLogin = (req, res) => {
    if (req.cookies.auth_token) {
        return res.redirect('/');
    }
    res.render('login', {
        title: 'Login',
        error: null
    });
};

const postLogin = async (req, res) => {

    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.render('login', {
                title: 'Login',
                error: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            return res.render('login', {
                title: 'Login',
                error: 'Invalid email or password'
            });
        }

        if (!user.role) {
            user.role = 'user';
            await user.save();
        }

        res.cookie('auth_token', user._id, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        if (user.role === 'admin') {
            return res.redirect('/admin');
        }

        return res.redirect('/user');

    } catch (err) {
        console.error(err);
        return res.render('login', {
            title: 'Login',
            error: 'An error occurred during login.'
        });
    }
};

const getRegister = (req, res) => {
    if (req.cookies.auth_token) {
        return res.redirect('/');
    }
    res.render('register', {
        title: 'Register',
        error: null
    });
};

const postRegister = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.render('register', {
                title: 'Register',
                error: 'Email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.render('register', {
            title: 'Register',
            error: 'Error registering user.'
        });
    }
};

const logout = (req, res) => {
    res.clearCookie('auth_token');
    res.redirect('/login');
};

const getForgetPassword = (req, res) => {
    res.render('forget-password', {
        title: 'Forget Password',
        error: null
    });
};

const postForgetPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.render('forget-password', {
                title: 'Forget Password',
                error: 'User not found'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.render('forget-password', {
            title: 'Forget Password',
            error: 'An error occurred'
        });
    }
};

module.exports = { getLogin, postLogin, getRegister, postRegister, logout, getForgetPassword, postForgetPassword };
