const mongoose = require("mongoose");
//1-create Schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand required"],
      unique: [true, "brand must be unique"],
      minLength: [3, "Too short brand name"],
      maxLength: [32, "Too long brand name"],
    },
    image: String,
    // A and B => shopping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true },
);
const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};
brandSchema.post("init", (doc) => {
  setImageURL(doc);
});
brandSchema.post("save", (doc) => {
  setImageURL(doc);
});
//2-Create model on dataBase
module.exports = mongoose.model("brands", brandSchema);
