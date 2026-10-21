import Enquiry from "../models/Enquiry.js";
import { sendEnquiryNotification } from "../services/emailService.js";

export const createEnquiry = async (req, res) => {
  try {
    console.log("Received enquiry:", req.body);

    const {
      name,
      phone,
      email = "",
      services = [],
      message = ""
    } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required"
      });
    }

    // -----------------------------
    // Prepare services
    // -----------------------------

    const selectedServices = Array.isArray(services)
      ? services
      : [];

    // -----------------------------
    // Create enquiry
    // -----------------------------

    const enquiry = new Enquiry({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      services: selectedServices,
      message: message.trim()
    });

    // -----------------------------
    // SAVE TO MONGODB
    // -----------------------------

    const savedEnquiry = await enquiry.save();

    console.log("Enquiry saved successfully!");
    console.log("MongoDB ID:", savedEnquiry._id);

    // -----------------------------
    // EMAIL NOTIFICATION
    // -----------------------------
    // Do not fail the enquiry submission if the email provider is unavailable.
    try {
      await sendEnquiryNotification(savedEnquiry);
      console.log("Enquiry notification email sent successfully.");
    } catch (emailError) {
      console.error("ERROR SENDING ENQUIRY NOTIFICATION:");
      console.error(emailError);
    }

    // -----------------------------
    // Response
    // -----------------------------

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      enquiry: savedEnquiry
    });

  } catch (error) {
    console.error("ERROR SAVING ENQUIRY:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to save enquiry",
      error: error.message
    });
  }
};


export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry
      .find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries
    });

  } catch (error) {
    console.error("ERROR FETCHING ENQUIRIES:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
      error: error.message
    });
  }
};