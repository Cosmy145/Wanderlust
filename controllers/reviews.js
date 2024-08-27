const listing = require("../models/listing");
const review = require("../models/review");

module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    let chosenOne = await listing.findById(id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    chosenOne.reviews.push(newReview);
    await newReview.save();
    await chosenOne.save();
    req.flash("success", 'New Review Created.')
    res.redirect(`/listings/${id}`);
  }

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash("success", 'Review Deleted.')
    res.redirect(`/listings/${id}`);
  }