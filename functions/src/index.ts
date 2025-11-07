import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import {onCall} from "firebase-functions/v2/https";
import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {defineString} from "firebase-functions/params";

// Initialize Firebase Admin
admin.initializeApp();

// Define email configuration parameters
const emailUser = defineString("EMAIL_USER", {
  default: "stephen.cantoria@stjo.farm",
});
const emailPassword = defineString("EMAIL_PASSWORD", {
  default: "your-app-password-here",
});

// Create transporter function
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser.value(),
      pass: emailPassword.value(),
    },
  });
};

// Send Contact Email
export const sendContactEmail = onCall(async (request) => {
  try {
    const {name, email, phone, subject, message, imageUrls} = request.data;
    const transporter = createTransporter();

    const mailOptions = {
      from: emailUser.value(),
      to: "stephen.cantoria@stjo.farm",
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p>${message}</p>
        ${imageUrls && imageUrls.length > 0 ? `
          <h3>Attachments:</h3>
          ${imageUrls.map((url: string) => `<p><a href="${url}">View Image</a></p>`).join("")}
        ` : ""}
        <hr>
        <p><small>This email was sent from the StJo Farm contact form.</small></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return {success: true, message: "Email sent successfully"};
  } catch (error) {
    console.error("Error sending contact email:", error);
    throw new Error("Failed to send email");
  }
});

// Send Calf Adoption Email
export const sendCalfAdoptionEmail = onCall(async (request) => {
  try {
    const {
      ownerName,
      ownerEmail,
      ownerPhone,
      calfAge,
      calfBreed,
      reason,
      additionalInfo,
      imageUrls,
    } = request.data;

    const transporter = createTransporter();

    const mailOptions = {
      from: emailUser.value(),
      to: "stephen.cantoria@stjo.farm",
      subject: "New Calf Adoption Request",
      html: `
        <h2>New Calf Adoption Request</h2>

        <h3>Owner Information:</h3>
        <p><strong>Name:</strong> ${ownerName}</p>
        <p><strong>Email:</strong> ${ownerEmail}</p>
        <p><strong>Phone:</strong> ${ownerPhone}</p>

        <h3>Calf Information:</h3>
        <p><strong>Age:</strong> ${calfAge}</p>
        <p><strong>Breed:</strong> ${calfBreed}</p>

        <h3>Reason for Rehoming:</h3>
        <p>${reason}</p>

        ${additionalInfo ? `
          <h3>Additional Information:</h3>
          <p>${additionalInfo}</p>
        ` : ""}

        ${imageUrls && imageUrls.length > 0 ? `
          <h3>Calf Photos:</h3>
          ${imageUrls.map((url: string) => `<p><a href="${url}">View Photo</a></p>`).join("")}
        ` : ""}

        <hr>
        <p><small>This email was sent from the StJo Farm calf adoption form.</small></p>
        <p><small>Please respond to ${ownerEmail} to discuss the adoption.</small></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Also send confirmation to the requester
    const confirmationMailOptions = {
      from: emailUser.value(),
      to: ownerEmail,
      subject: "Calf Adoption Request Received - StJo Farm",
      html: `
        <h2>Thank You for Your Submission</h2>
        <p>Dear ${ownerName},</p>
        <p>We've received your calf adoption request and will review it shortly.</p>
        <p>We typically respond within 24-48 hours. If your situation is urgent,
           please feel free to call us directly.</p>

        <h3>Your Submission Summary:</h3>
        <p><strong>Calf Age:</strong> ${calfAge}</p>
        <p><strong>Breed:</strong> ${calfBreed}</p>

        <p>Thank you for thinking of StJo Farm.</p>
        <p>Best regards,<br>StJo Farm Team</p>

        <hr>
        <p><small>StJo Farm | stjo.farm | stephen.cantoria@stjo.farm</small></p>
      `,
    };

    await transporter.sendMail(confirmationMailOptions);

    return {success: true, message: "Emails sent successfully"};
  } catch (error) {
    console.error("Error sending adoption email:", error);
    throw new Error("Failed to send email");
  }
});

// Optional: Function to send notification when new listing is added
export const onNewListing = onDocumentCreated("listings/{listingId}", async (event) => {
  const listing = event.data?.data();

  if (!listing) {
    return;
  }

  // You could send yourself a notification email here
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: emailUser.value(),
      to: "stephen.cantoria@stjo.farm",
      subject: "New Listing Added - StJo Farm",
      html: `
        <h2>New Listing Added to Website</h2>
        <p><strong>Title:</strong> ${listing.title}</p>
        <p><strong>Category:</strong> ${listing.category}</p>
        <p><strong>Price:</strong> ${listing.price}</p>
        <p><strong>Description:</strong> ${listing.description}</p>
        <p><a href="https://stjo.farm/admin/dashboard">View in Dashboard</a></p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending listing notification:", error);
  }
});
