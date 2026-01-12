const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const authController = require('../controllers/authController');

const User = require('../models/userModel');
const { authenticationAdmin, authentication } = require('../middlewares/authentication');

const checkAuth = async (req, res, next) => {
    const token = req.cookies.auth_token;
    res.locals.isAuthenticated = !!token;
    res.locals.isAdmin = false;
    res.locals.currentUser = null;

    if (token) {
        if (token === 'admin') {
            res.locals.isAdmin = true;
        } else {
            try {
                const user = await User.findById(token);
                if (user) {
                    res.locals.currentUser = user;
                    res.locals.isAdmin = user.role === 'admin';
                }
            } catch (err) {
                console.error('Error fetching user in middleware:', err);
            }
        }
    }

    if (!token && req.path === '/') {
        return res.redirect('/login');
    }

    const adminRoutes = ['/admin', '/addmovie', '/editmovie', '/deletemovie', '/addtheater'];
    const isProtected = adminRoutes.some(route => req.path.startsWith(route));

    if (isProtected && !res.locals.isAdmin) {
        if (!token) return res.redirect('/login');
        return res.redirect('/user');
    }

    next();
};

router.use(checkAuth);


router.get('/', (req, res) => {
    if (res.locals.isAdmin) {
        return res.redirect('/admin');
    }
    return res.redirect('/user');
});

router.get('/user', authentication, movieController.getUser);
router.get('/admin', authenticationAdmin, movieController.getHome);
router.get('/movie/:id', movieController.getMovie);

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
router.get('/logout', authController.logout);

router.get('/addmovie', authenticationAdmin, movieController.getAddMovie);
router.post('/addmovie', authenticationAdmin, movieController.postAddMovie);

router.get('/forget-password', authController.getForgetPassword);
router.post('/forget-password', authController.postForgetPassword);

router.get('/editmovie/:id', authenticationAdmin, movieController.getEditMovie);
router.post('/editmovie/:id', authenticationAdmin, movieController.postEditMovie);

router.get('/deletemovie/:id', authenticationAdmin, movieController.deleteMovie);

router.get('/addtheater', authenticationAdmin, movieController.getAddTheater);
router.post('/addtheater', authenticationAdmin, movieController.postAddTheater);

router.get('/admin_movie/:id', authenticationAdmin, movieController.adminMovie);

router.get('/edittheater/:id', authenticationAdmin, movieController.getEditTheater);
router.post('/edittheater/:id', authenticationAdmin, movieController.postEditTheater);
router.get('/deletetheater/:id', authenticationAdmin, movieController.deleteTheater);

const screenController = require('../controllers/screenController');
const showController = require('../controllers/showController');

router.get('/addscreen', authenticationAdmin, screenController.getAddScreen);
router.post('/addscreen', authenticationAdmin, screenController.postAddScreen);

router.get('/editscreen/:id', authenticationAdmin, screenController.getEditScreen);
router.post('/editscreen/:id', authenticationAdmin, screenController.postEditScreen);
router.get('/deletescreen/:id', authenticationAdmin, screenController.deleteScreen);

router.get('/addshow', authenticationAdmin, showController.getAddShow);
router.post('/addshow', authenticationAdmin, showController.postAddShow);

router.post('/confirmseat', authentication, showController.postConfirmSeat);

router.get('/editshow/:id', authenticationAdmin, showController.getEditShow);
router.post('/editshow/:id', authenticationAdmin, showController.postEditShow);
router.get('/deleteshow/:id', authenticationAdmin, showController.deleteShow);

module.exports = router;
