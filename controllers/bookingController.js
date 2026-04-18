const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { gmeetLink, status } = req.body;
    
    // update status to 'Replied' if gmeetLink is provided and no specific status is set
    const updateData = { ...req.body };
    if (gmeetLink && (!status || status === 'Pending' || status === 'New')) {
      updateData.status = 'Replied';
    }

    const updated = await Booking.findByIdAndUpdate(id, updateData, { new: true });
    
    if (gmeetLink && updated.email) {
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { 
          user: 'vasanthkumar52itskct@gmail.com', 
          pass: 'tixy zeowoxqyrgan' 
        }
      });
      
      let emailSubject = 'Confirmation: Your Discovery Call with Zeninworks';
      if (updated.message && updated.message.trim() !== '') {
        let snippet = updated.message.trim().substring(0, 40);
        if (updated.message.length > 40) snippet += '...';
        emailSubject = `Zeninworks Discovery Call: Discussing "${snippet}"`;
      }

      const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; color: #333333; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
          .wrapper { width: 100%; background-color: #f4f7f6; padding: 40px 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); }
          .header { background-color: #1a1a1a; padding: 35px 40px; text-align: center; border-bottom: 4px solid #3b82f6; }
          .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px; }
          .content { padding: 40px; }
          .greeting { font-size: 22px; font-weight: 600; margin-bottom: 20px; color: #1a1a1a; }
          .message { font-size: 16px; line-height: 1.7; color: #555555; margin-bottom: 30px; }
          .details-card { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px; margin-bottom: 35px; }
          .detail-row { margin-bottom: 15px; font-size: 16px; }
          .detail-row:last-child { margin-bottom: 0; }
          .detail-label { font-weight: 600; color: #4b5563; display: inline-block; width: 90px; }
          .detail-value { color: #111827; font-weight: 500; }
          .cta-container { text-align: center; margin: 40px 0; }
          .cta-button { display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-weight: 600; font-size: 16px; }
          .agenda-section { margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb; }
          .agenda-title { font-size: 18px; font-weight: 600; color: #1a1a1a; margin-bottom: 15px; }
          .agenda-content { font-size: 16px; line-height: 1.6; color: #4b5563; font-style: italic; background-color: #f3f4f6; padding: 20px; border-radius: 6px; border-left: 4px solid #9ca3af; margin: 0; }
          .footer { text-align: center; padding: 30px 40px; background-color: #f9fafb; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
          .footer p { margin: 5px 0; }
          .footer a { color: #3b82f6; text-decoration: none; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>Zeninworks Discovery Call</h1>
            </div>
            <div class="content">
              <div class="greeting">Hello ${updated.name},</div>
              <div class="message">
                Your discovery call has been successfully scheduled. We are looking forward to our conversation and exploring how Zeninworks can help you achieve your goals.
              </div>
              
              <div class="details-card">
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">${updated.date}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span>
                  <span class="detail-value">${updated.time}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Platform:</span>
                  <span class="detail-value">Google Meet</span>
                </div>
              </div>

              <div class="cta-container">
                <a href="${gmeetLink}" class="cta-button" target="_blank" rel="noopener">Join Google Meet Session</a>
              </div>

              ${updated.message && updated.message.trim() !== '' ? `
              <div class="agenda-section">
                <div class="agenda-title">Discussion Agenda:</div>
                <blockquote class="agenda-content">
                  "${updated.message}"
                </blockquote>
              </div>
              ` : ''}
              
              <div class="message" style="margin-top: 35px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                Please ensure you are in a quiet environment with a stable internet connection. If you need to reschedule, kindly reply directly to this email at your earliest convenience.
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Zeninworks. All rights reserved.</p>
              <p><a href="https://zeninworks.vercel.app">zeninworks.vercel.app</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
      `;

      try {
        await transporter.sendMail({
          from: '"Zeninworks" <vasanthkumar52itskct@gmail.com>',
          to: updated.email,
          replyTo: 'vasanthkumar52itskct@gmail.com',
          subject: emailSubject,
          html: emailHtml,
          text: `Hello ${updated.name},\n\nYour discovery call has been scheduled.\nDate: ${updated.date}\nTime: ${updated.time}\nLink: ${gmeetLink}\n\nBest,\nZeninworks`
        });
        console.log('Email sent successfully to', updated.email);
      } catch (emailErr) {
        console.error('Error sending email:', emailErr);
      }
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('Update booking error:', err);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};
