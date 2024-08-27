const listing = require("../models/listing");
const expressError = require("../utilities/expressError");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

module.exports.index = async (req, res) => {
  let listings = await listing.find({});
  res.render("listings/index.ejs", { listings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const chosenOne = await listing
    .findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!chosenOne) {
    req.flash("error", "Listing does not exist.");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { chosenOne });
};

module.exports.createListing = async (req, res) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 2
  })
    .send()

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url ,filename};
  newListing.geometry = response.body.features[0].geometry;
  newListing.save();
  
  req.flash("success", "New Listing Created.");
  res.redirect("/listings");
  //   let { title, description, price, location, country } = req.body;
  //   let newListing = new listing({
  //     title: title,
  //     description: description,
  //     price: price,
  //     location: location,
  //     country: country,
  //   });
  //   newListing
  //     .save()
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const chosenOne = await listing.findById(id);
  req.flash("success", "Listing Edited.");
  if (!chosenOne) {
    req.flash("error", "Listing does not exist.");
    res.redirect("/listings");
  }
  let originalImage = chosenOne.image.url;
  originalImage = originalImage.replace('/upload', '/upload/w_250');
  res.render("listings/edit.ejs", { chosenOne, originalImage });
};

module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new expressError(400, "Please enter a valid listing.");
  }
  let { id } = req.params;
  let chosenOne = await listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { runValidators: true, new: true }
  );
  if (typeof req.file !== 'undefined') {
    let url = req.file.path;
    let filename = req.file.filename;
    chosenOne.image = {url, filename}
    await chosenOne.save();
  }
  req.flash("success", "Listing Updated.");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted.");
  res.redirect("/listings");
};
