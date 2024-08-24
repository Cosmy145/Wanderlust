const listing = require("./models/listing");
const expressError = require("./utilities/expressError");
const { listingSchema, reviewSchema } = require("./schema");
const review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a new listing.");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let chosenOne = await listing.findById(id);
  if (!res.locals.currUser) {
    req.flash("error", "You must be logged in to view this listing.");
    return res.redirect(`/login`);
  }
  if (!chosenOne.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You dont have any permissions for this listing.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); // map to message, not join
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const chosenOne = await review.findById(reviewId);
  if (!res.locals.currUser) {
    req.flash("error", "You must be logged in to delete this review.");
    return res.redirect(`/login`);
  }
  if (!chosenOne.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
