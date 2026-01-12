const Theater = require('../models/theater');
const Screen = require('../models/screen');

const getAddScreen = async (req, res) => {
    try {
        const theaters = await Theater.find({});
        res.render('addscreen', {
            title: 'Add Screen',
            theaters: theaters
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const postAddScreen = async (req, res) => {
    try {
        const { theaterId, screenName, capacity, screenType } = req.body;

        await Screen.create({
            theaterId,
            screenName,
            capacity: parseInt(capacity),
            screenType
        });

        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const getEditScreen = async (req, res) => {
    try {
        const screen = await Screen.findById(req.params.id);
        const theaters = await Theater.find({});
        if (!screen) {
            return res.status(404).send('Screen not found');
        }
        res.render('editscreen', {
            title: 'Edit Screen',
            screen: screen,
            theaters: theaters
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const postEditScreen = async (req, res) => {
    try {
        const { theaterId, screenName, capacity, screenType } = req.body;
        await Screen.findByIdAndUpdate(req.params.id, {
            theaterId,
            screenName,
            capacity: parseInt(capacity),
            screenType
        });
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const deleteScreen = async (req, res) => {
    try {
        await Screen.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

module.exports = { getAddScreen, postAddScreen, getEditScreen, postEditScreen, deleteScreen };
