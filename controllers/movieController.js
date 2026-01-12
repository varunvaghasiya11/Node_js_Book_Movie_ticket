const Movie = require('../models/movieModel');
const Theater = require('../models/theater');

const Screen = require('../models/screen');

const getHome = async (req, res) => {
    const movies = await Movie.find();
    const theaters = await Theater.find();
    const screens = await Screen.find().populate('theaterId');
    const shows = await Show.find().populate('movieId').populate({
        path: 'screenId',
        populate: {
            path: 'theaterId',
            model: 'Theater'
        }
    });

    res.render('admin', {
        title: 'Home',
        movies: movies,
        theaters: theaters,
        screens: screens,
        shows: shows
    });
};

const Show = require('../models/show');

const getMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.send('Movie not found');
        }

        const shows = await Show.find({ movieId: movie._id })
            .populate({
                path: 'screenId',
                populate: {
                    path: 'theaterId',
                    model: 'Theater'
                }
            });

        res.render('movie', {
            title: movie.title,
            movie: movie,
            shows: shows
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const getAddMovie = (req, res) => {
    if (!req.cookies.auth_token) {
        return res.redirect('/login');
    }
    res.render('addmovie', { title: 'Add Movie' });
};

const postAddMovie = async (req, res) => {
    const { title, image, description, genre, rating, price, runtime_h, runtime_m } = req.body;

    try {
        const existingMovie = await Movie.findOne({ title });

        if (existingMovie) {
            return res.render('addmovie', { title: 'Add Movie' });
        }

        await Movie.create({
            title,
            image,
            description,
            genre,
            rating: parseFloat(rating),
            price: parseFloat(price),
            runtime_h: parseInt(runtime_h),
            runtime_m: parseInt(runtime_m)
        });

        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.render('addmovie');
    }
};

const getEditMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).send('Movie not found');
        }
        res.render('editmovie', {
            title: 'Edit Movie',
            movie: movie
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const postEditMovie = async (req, res) => {
    const { title, image, description, genre, rating, runtime_h, runtime_m, price } = req.body;

    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        movie.title = title;
        movie.image = image;
        movie.description = description;
        movie.genre = genre;
        movie.rating = parseFloat(rating);
        movie.runtime_h = parseInt(runtime_h);
        movie.runtime_m = parseInt(runtime_m);
        movie.price = parseFloat(price);

        await movie.save();

        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.send('Server Error');
    }
};

const deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.send('Movie not found');
        }

        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.send('Server Error');
    }
};

const getAddTheater = (req, res) => {

    if (!req.cookies.auth_token) {
        return res.redirect('/login');
    }
    res.render('addtheater', { title: 'Add Theater' });
}

const postAddTheater = async (req, res) => {
    if (!req.cookies.auth_token) {
        return res.redirect('/login');
    }
    try {
        const { title, location } = req.body;
        console.log(title, location);

        const theater = new Theater({
            name: title,
            location: location,
        });
        await theater.save();
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.render('addtheater', { title: 'Add Theater', error: 'Error adding theater' });
    }
}

const getUser = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.render('user', {
            title: 'User',
            movies: movies
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

const adminMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.send('Movie not found');
        }
        res.render('admin_movie_details', {
            title: movie.title,
            movie: movie
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

const getEditTheater = async (req, res) => {
    try {
        const theater = await Theater.findById(req.params.id);
        if (!theater) {
            return res.status(404).send('Theater not found');
        }
        res.render('edittheater', {
            title: 'Edit Theater',
            theater: theater
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const postEditTheater = async (req, res) => {
    try {
        const { title, location } = req.body;
        await Theater.findByIdAndUpdate(req.params.id, { name: title, location: location });
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const deleteTheater = async (req, res) => {
    try {
        await Theater.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

module.exports = { getHome, getMovie, getAddMovie, postAddMovie, getEditMovie, postEditMovie, deleteMovie, getAddTheater, postAddTheater, getUser, adminMovie, getEditTheater, postEditTheater, deleteTheater };
