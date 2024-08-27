const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middlewares");
const {
  index,
  renderNewForm,
  showListing,
  createListing,
  renderEditForm,
  updateListing,
  destroyListing,
} = require("../controllers/listings");

const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(createListing)
  );

// NEW ROUTE
router.get("/new", isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(destroyListing));
// EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));



module.exports = router;
