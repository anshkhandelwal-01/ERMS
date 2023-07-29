const passport = require('passport');
const User = require('../models/user');
const MyReview = require('../models/selfReview');
const AssignedReview = require('../models/otherEmployeeReview');
const fs = require('fs');
const path = require('path');

module.exports.profile = async function (req, res) {
    try {
        let user = await User.findById(req.params.id).populate({path: 'assignedReviews', populate: {path: 'to'}}).populate({path: 'myReviews', populate: {path: 'message'}, populate: 'from'});
        console.log(user.assignedReviews);
        console.log(user.myReviews)

        return res.render('profile', {
            title: "User Profile",
            profile_user: user,
            user_assignedReviews: user.assignedReviews,
            user_reviews: user.myReviews
        });
        user.save();
    }
    catch (error) {
        console.log('Error', error);
        return;
    }
}

module.exports.edit = async function (req, res) {
    try {
        let user = await User.findById(req.params.id);
        // console.log(user);
        return res.render('edit', {
            title: "Edit Profile",
            profile_user: user
        });
    }
    catch (error) {
        console.log('Error', error);
        return;
    }
}

module.exports.remove = async function (req, res) {
    try {
        let user = await User.findByIdAndDelete(req.params.id);
        return res.redirect('back');
    }
    catch (error) {
        console.log('Error', error);
        return;
    }
}

module.exports.employee = async function (req, res) {
    try {
        let user = await User.find({});
        // console.log(user);
        return res.render('employee', {
            title: "Employee",
            user: user
        });
    }
    catch (error) {
        console.log('Error', error);
        return;
    }
}

module.exports.update = async function (req, res) {
    try {
        if (req.user.id == req.params.id || req.user.user_type == 'admin') {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function (err) {
                if (err) { console.log('Error', err); };

                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file) {
                    if (user.avatar) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            })
        } else {
            return res.status(401).send('Unauthorized');
        }
    } catch (error) {
        console.log('Error', error);
        return;
    }
}

module.exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    try {
        return res.render('sign_in', {
            title: "ERMS | Login",
        });
    } catch (error) {
        console.log('Error', error);
        return;
    }
}

module.exports.signUp = function (req, res) {
    if (req.isAuthenticated() && req.user.user_type == 'employee') {
        return res.redirect('/users/profile');
    }
    return res.render('sign_up', {
        title: "Sign-Up"
    });
}

module.exports.createAdmin = async function (req, res) {
    try {
        let user = await User.findById(req.params.id);
        console.log(user);
        console.log(user.user_type);
        user.user_type = 'admin';
        user.save();
        return res.redirect('back');
    }
    catch (error) {
        console.log('Error', error);
        return;
    }
}

module.exports.removeAdmin = async function (req, res) {
    try {
        let user = await User.findById(req.params.id);
        console.log(user);
        console.log(user.user_type);
        user.user_type = 'employee';
        user.save();
        return res.redirect('back');
    }
    catch (error) {
        console.log('Error', error);
        return;
    }
}

module.exports.create = async function (req, res) {
    try {
        if (req.body.password != req.body.confirm_password) {
            return res.redirect('back');
        }
        let user = await User.findOne({ email: req.body.email });
        if (user == null) {
            await User.create(req.body);
            if (req.user.user_type == 'admin') {
                return res.redirect('/dashboard');
            }
            return res.redirect('/');
        }
        else {
            return res.redirect('back');
        }
    } catch (error) {
        console.log('Error', error);
        return;
    }
}

module.exports.createSession = async function (req, res) {
    if (req.user.user_type == 'admin') {
        return res.redirect('/dashboard');
    }
    return res.redirect(`/users/profile/${req.user.id}`);
}

module.exports.destroySession = function (req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
        return res.redirect('/');
    });
}

module.exports.createReview = async function (req, res) {
    try {

        let review = await AssignedReview.findOne({ from: req.body.reviewer, to: req.body.recipient });

        if (review) {
            return res.redirect('back');
        }

        review = await AssignedReview.create({
            fromUser: req.body.reviewer,
            toUser: req.body.recipient
        })

        let user = await User.findById(req.body.reviewer);

        user.assignedReviews.push(review);
        user.save();

        return res.redirect('back');


    } catch (error) {
        console.log('Error', error);
    }
}

module.exports.createReview = async function (req, res) {
    try {

        let review = await AssignedReview.findOne({ from: req.body.reviewer, to: req.body.recipient });

        if (review) {
            return res.redirect('back');
        }

        review = await AssignedReview.create({
            from: req.body.reviewer,
            to: req.body.recipient
        })

        let user = await User.findById(req.body.reviewer);

        user.assignedReviews.push(review);
        user.save();

        return res.redirect('back');

    } catch (error) {
        console.log('Error', error);
    }
}

module.exports.completeReview = async function (req, res) {
    try {

        let review = await AssignedReview.findOne({ from: req.user, to: req.body.to });

        await User.findByIdAndUpdate(req.user, { $pull: { assignedReviews: review.id } });

        await AssignedReview.findByIdAndDelete(review.id);

        review = await MyReview.create({
            from: req.user,
            to: req.body.to,
            message: req.body.message
        })

        let user = await User.findById(req.body.to);

        user.myReviews.push(review);
        user.save();

        return res.redirect('back');


    } catch (error) {
        console.log('Error', error);
    }
}