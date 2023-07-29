const User = require('../models/user');
const MyReview = require('../models/selfReview');

module.exports.dashboard = async function(req, res){
    try {
        const user = await User.find({});
        const myReview = await MyReview.find({}).populate('to');
        console.log(myReview);    
        return res.render('admin',{
            title: "ERMS | Admin",
            profile_user: user,
            myReviews: myReview
        });
    } catch (error) {
       console.log('Error', error); 
       return;
    }
}