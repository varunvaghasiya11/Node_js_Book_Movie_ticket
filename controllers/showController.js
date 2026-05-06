const Movie = require('../models/movieModel');
const Screen = require('../models/screen');
const Show = require('../models/show');
const Ticket = require('../models/ticket');

const getAddShow = async (req, res) => {
    try {
        const movies = await Movie.find({});
        const screens = await Screen.find({}).populate('theaterId');

        res.render('addshow', {
            title: 'Add Show',
            movies: movies,
            screens: screens
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const postAddShow = async (req, res) => {
    try {
        const { movieId, screenId, showDate, showTime } = req.body;

        const screen = await Screen.findById(screenId);
        if (!screen) {
            return res.status(404).send('Screen not found');
        }

        await Show.create({
            movieId,
            screenId,
            showDate,
            showTime,
            availableSeats: screen.capacity
        });

        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const nodemailer = require('nodemailer');

const postConfirmSeat = async (req, res) => {
    try {
        const { movieTitle, movieImage, showTime, seats, totalPrice, screen, showId } = req.body;
        const userEmail = res.locals.currentUser ? res.locals.currentUser.email : null;

        if (!userEmail) {
            console.error('User email not found');
            return res.redirect('/login');
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'varunvaghasiya72@gmail.com',
                pass: 'brldpmqphcnuvbqn'
            }
        });

        const mailOptions = {
            from: 'varunvaghasiya72@gmail.com',
            to: userEmail,
            subject: `Ticket Confirmation for ${movieTitle}`,
            html: `
               <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #e0e0e0;">
                    <!-- Header Image -->
                    <div style="width: 100%; height: 200px; background-color: #000; overflow: hidden; position: relative;">
                        <!-- Fallback color or background if image doesn't load -->
                       <img src="${movieImage}" alt="${movieTitle}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8;">
                       <div style="position: absolute; bottom: 0; left: 0; width: 100%; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); padding: 20px;">
                           <h1 style="margin: 0; color: #fff; font-size: 24px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${movieTitle}</h1>
                       </div>
                    </div>

                    <div style="padding: 30px;">
                        <h2 style="color: #e50914; margin-top: 0; margin-bottom: 20px; text-align: center; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
                            Booking Confirmed!
                        </h2>
                        <p style="color: #555; font-size: 16px; line-height: 1.5; text-align: center;">
                            Thank you for booking with MovieTicket. Your seats are reserved.
                        </p>

                        <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin: 25px 0;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 14px;">Theater & Screen</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333; font-weight: bold; text-align: right;">${screen}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 14px;">Show Time</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333; font-weight: bold; text-align: right;">${showTime}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 14px;">Seats</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333; font-weight: bold; text-align: right;">${seats}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 0 5px 0; color: #333; font-weight: bold; font-size: 16px;">Total Price</td>
                                    <td style="padding: 15px 0 5px 0; color: #e50914; font-weight: bold; font-size: 20px; text-align: right;">₹${totalPrice}</td>
                                </tr>
                            </table>
                        </div>

                        <div style="text-align: center;">
                            <a href="#" style="display: inline-block; background-color: #e50914; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: bold; font-size: 16px;">View My Tickets</a>
                        </div>
                        
                        <p style="margin-top: 30px; font-size: 12px; color: #999; text-align: center;">
                            Please arrive 15 minutes before showtime.<br>
                            This is an automated message.
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${userEmail}`);

        const ticket = await Ticket.create({
            showId: showId,
            userId: res.locals.currentUser._id,
            seatNumber: seats,
            bookingDate: new Date(),
            price: parseFloat(totalPrice)
        });

        const User = require('../models/userModel');
        await User.findByIdAndUpdate(res.locals.currentUser._id, { $push: { tickets: ticket._id } });

        res.redirect('/user');


    } catch (err) {
        console.error('Error sending email:', err);
        res.status(500).send('Error sending confirmation email. Please check server logs.');
    }
};

const getEditShow = async (req, res) => {
    try {
        const show = await Show.findById(req.params.id);
        const movies = await Movie.find({});
        const screens = await Screen.find({}).populate('theaterId');
        if (!show) {
            return res.status(404).send('Show not found');
        }
        res.render('editshow', {
            title: 'Edit Show',
            show: show,
            movies: movies,
            screens: screens
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const postEditShow = async (req, res) => {
    try {
        const { movieId, screenId, showDate, showTime } = req.body;
        await Show.findByIdAndUpdate(req.params.id, {
            movieId,
            screenId,
            showDate,
            showTime
        });
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const deleteShow = async (req, res) => {
    try {
        await Show.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

module.exports = { getAddShow, postAddShow, postConfirmSeat, getEditShow, postEditShow, deleteShow };
