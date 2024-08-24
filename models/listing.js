const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require('./review')
const user = require('./user')

const listingSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    filename: {
      type: String,
      default: "defaultlistingimage",
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1589419896452-b460b8b390a3?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      set: function (v) {
        if (v === "") {
          this.image.filename = "defaultlistingimage";
          return "https://images.unsplash.com/photo-1589419896452-b460b8b390a3?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
        }
        return v;
      },
    },
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

// this middleware if for when u wanna delete all the child after the parent got delete
listingSchema.post('findOneAndDelete', async (listing) => {
  if(listing){
    await review.deleteMany({_id : {$in : listing.reviews}})
  }
})

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;
