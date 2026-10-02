import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ""
    },

    services: {
      type: [String],
      default: []
    },

    message: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);

export default Enquiry;