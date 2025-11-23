interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private apiKey: string;
  private apiUrl = 'https://api.brevo.com/v3/smtp/email';

  constructor() {
    this.apiKey = process.env.BREVO_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('BREVO_API_KEY is required');
    }
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const payload = {
        sender: {
          name: 'Jain Foam & Furnishing',
          email: 'jainfoamf@gmail.com' // Must be verified in Brevo
        },
        to: [{
          email: options.to,
          name: 'Recipient'
        }],
        subject: options.subject,
        htmlContent: options.html,
        textContent: options.text
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Brevo API error: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
    } catch (error) {
      console.error('Error sending email via Brevo:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendContactInquiryEmail(inquiry: {
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
  }): Promise<void> {
    const subject = `New Contact Inquiry - ${inquiry.service}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          New Contact Inquiry Received
        </h2>

        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="color: #007bff; margin-top: 0;">Customer Details:</h3>
          <p><strong>Name:</strong> ${inquiry.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${inquiry.email}">${inquiry.email}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${inquiry.phone}">${inquiry.phone}</a></p>
          <p><strong>Service Interested:</strong> ${inquiry.service}</p>
        </div>

        <div style="background-color: #fff; padding: 20px; margin: 20px 0; border: 1px solid #dee2e6; border-radius: 5px;">
          <h3 style="color: #333; margin-top: 0;">Message:</h3>
          <p style="line-height: 1.6; white-space: pre-wrap;">${inquiry.message}</p>
        </div>

        <div style="background-color: #e9ecef; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <p style="margin: 0; font-size: 14px; color: #6c757d;">
            <strong>Please respond to this inquiry as soon as possible.</strong><br>
            Contact the customer directly or reply to this email.
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
        <p style="font-size: 12px; color: #6c757d; text-align: center;">
          This email was sent from the Jain Foam & Furnishing website contact form.
        </p>
      </div>
    `;

    const text = `
New Contact Inquiry Received

Customer Details:
Name: ${inquiry.name}
Email: ${inquiry.email}
Phone: ${inquiry.phone}
Service: ${inquiry.service}

Message:
${inquiry.message}

Please respond to this inquiry as soon as possible.
    `;

    await this.sendEmail({
      to: process.env.CONTACT_EMAIL || 'raiv5253@gmail.com',
      subject,
      html,
      text,
    });
  }
}

export const emailService = new EmailService();