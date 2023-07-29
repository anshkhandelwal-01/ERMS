const mongoose = require('mongoose');

const otherEmployeeReviewSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
},

    {
        timestamps: true
    }
)

const AssignedReview = mongoose.model('AssignedReview', otherEmployeeReviewSchema);
module.exports = AssignedReview;