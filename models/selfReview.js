const mongoose = require('mongoose');

const selfReviewSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
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

const MyReview = mongoose.model('MyReview', selfReviewSchema);
module.exports = MyReview;