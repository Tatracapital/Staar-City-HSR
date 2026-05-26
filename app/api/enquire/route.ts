import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const gmailUser = process.env.GMAIL_USER;
const gmailPassword = process.env.GMAIL_PASSWORD;
const adminEmail = process.env.ADMIN_EMAIL;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

if (!gmailUser || !gmailPassword) {
  throw new Error('Missing Gmail SMTP credentials');
}

if (!adminEmail) {
  throw new Error('Missing admin email');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailUser,
    pass: gmailPassword,
  },
});

interface EnquiryData {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
}

function validateEnquiry(data: EnquiryData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name?.trim()) errors.push('Name is required');
  if (!data.email?.trim()) errors.push('Email is required');
  if (!data.phone?.trim()) errors.push('Phone is required');
  if (!data.interest?.trim()) errors.push('Interest field is required');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRegex.test(data.email)) {
    errors.push('Invalid email format');
  }

  const phoneRegex = /^[0-9\s\-()+]{10,}$/;
  if (data.phone && !phoneRegex.test(data.phone.replace(/\s/g, ''))) {
    errors.push('Phone must be at least 10 digits');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

async function saveToDatabase(data: EnquiryData) {
  const { data: result, error } = await supabase.from('enquiries').insert([
    {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      interest: data.interest.trim(),
      message: data.message?.trim() || null,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error('Database error:', error);
    throw new Error(`Database error: ${error.message}`);
  }

  return result;
}

async function sendAdminEmail(data: EnquiryData) {
  const mailOptions = {
    from: gmailUser,
    to: adminEmail,
    replyTo: data.email,
    subject: `New Enquiry from ${data.name} - TATRA STAAR CITY`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', Trebuchet MS, sans-serif;
              line-height: 1.6;
              color: #2c2c2c;
              margin: 0;
              padding: 0;
              background-color: #f5f3f0;
            }
            .wrapper {
              background-color: #f5f3f0;
              padding: 40px 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            }
            .header {
              background: linear-gradient(135deg, #2c2c2c 0%, #3d3d3d 100%);
              color: #f5f3f0;
              padding: 40px 30px;
              text-align: center;
              border-bottom: 4px solid #b8893a;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 300;
              letter-spacing: 1px;
            }
            .header p {
              margin: 8px 0 0 0;
              font-size: 13px;
              letter-spacing: 0.5px;
              opacity: 0.9;
            }
            .content {
              padding: 40px 30px;
            }
            .section-title {
              font-size: 12px;
              letter-spacing: 1.5px;
              color: #b8893a;
              font-weight: 600;
              text-transform: uppercase;
              margin: 25px 0 15px 0;
              padding-bottom: 10px;
              border-bottom: 1px solid #e8e6e3;
            }
            .field-group {
              margin-bottom: 20px;
            }
            .field-label {
              font-size: 11px;
              letter-spacing: 0.8px;
              color: #999;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 6px;
            }
            .field-value {
              font-size: 14px;
              color: #2c2c2c;
              line-height: 1.5;
            }
            .field-value a {
              color: #b8893a;
              text-decoration: none;
              border-bottom: 1px solid #b8893a;
            }
            .field-value a:hover {
              color: #9a7635;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #b8893a 0%, #9a7635 100%);
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 4px;
              font-size: 12px;
              letter-spacing: 0.8px;
              text-transform: uppercase;
              margin-top: 25px;
              font-weight: 600;
              transition: all 0.3s ease;
            }
            .cta-button:hover {
              background: linear-gradient(135deg, #9a7635 0%, #7a5a2a 100%);
              box-shadow: 0 4px 12px rgba(184, 137, 58, 0.3);
            }
            .divider {
              height: 1px;
              background-color: #e8e6e3;
              margin: 30px 0;
            }
            .footer {
              padding: 20px 30px;
              background-color: #f9f7f4;
              border-top: 1px solid #e8e6e3;
              text-align: center;
              font-size: 11px;
              color: #999;
              letter-spacing: 0.3px;
            }
            .timestamp {
              font-size: 10px;
              color: #bbb;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <h1>TATRA STAAR CITY</h1>
                <p>INVESTMENT ENQUIRY</p>
              </div>

              <div class="content">
                <p style="margin: 0 0 25px 0; color: #666; font-size: 14px;">A prospective investor has submitted an enquiry. Details are provided below.</p>

                <div class="section-title">Enquiry Details</div>

                <div class="field-group">
                  <div class="field-label">Full Name</div>
                  <div class="field-value">${escapeHtml(data.name)}</div>
                </div>

                <div class="field-group">
                  <div class="field-label">Email Address</div>
                  <div class="field-value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
                </div>

                <div class="field-group">
                  <div class="field-label">Phone Number</div>
                  <div class="field-value"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></div>
                </div>

                <div class="field-group">
                  <div class="field-label">Area of Interest</div>
                  <div class="field-value">${escapeHtml(data.interest)}</div>
                </div>

                ${
                  data.message
                    ? `
                    <div class="divider"></div>
                    <div class="section-title">Additional Message</div>
                    <div class="field-group">
                      <div class="field-value">${escapeHtml(data.message).replace(/\n/g, '<br>')}</div>
                    </div>
                  `
                    : ''
                }

                <div class="divider"></div>

                <div style="text-align: center;">
                  <a href="mailto:${escapeHtml(data.email)}" class="cta-button">Reply to Enquiry</a>
                </div>
              </div>

              <div class="footer">
                <p style="margin: 0; padding: 0;">Automated enquiry notification from TATRA STAAR CITY portal</p>
                <div class="timestamp">Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Admin email error:', error);
    throw new Error(`Failed to send admin email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function sendUserConfirmationEmail(data: EnquiryData) {
  const mailOptions = {
    from: gmailUser,
    to: data.email,
    subject: 'Enquiry Confirmation - TATRA STAAR CITY',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', Trebuchet MS, sans-serif;
              line-height: 1.6;
              color: #2c2c2c;
              margin: 0;
              padding: 0;
              background-color: #f5f3f0;
            }
            .wrapper {
              background-color: #f5f3f0;
              padding: 40px 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            }
            .header {
              background: linear-gradient(135deg, #2c2c2c 0%, #3d3d3d 100%);
              color: #f5f3f0;
              padding: 40px 30px;
              text-align: center;
              border-bottom: 4px solid #b8893a;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 300;
              letter-spacing: 1px;
            }
            .header p {
              margin: 8px 0 0 0;
              font-size: 13px;
              letter-spacing: 0.5px;
              opacity: 0.9;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 18px;
              margin: 0 0 20px 0;
              line-height: 1.4;
            }
            .intro-text {
              font-size: 14px;
              color: #666;
              margin-bottom: 30px;
              line-height: 1.6;
            }
            .section-title {
              font-size: 12px;
              letter-spacing: 1.5px;
              color: #b8893a;
              font-weight: 600;
              text-transform: uppercase;
              margin: 30px 0 20px 0;
              padding-bottom: 10px;
              border-bottom: 1px solid #e8e6e3;
            }
            .timeline-item {
              margin-bottom: 18px;
              padding-left: 0;
              border-left: 3px solid #b8893a;
              padding-left: 20px;
              position: relative;
            }
            .timeline-item::before {
              content: '';
              position: absolute;
              left: -7px;
              top: 6px;
              width: 10px;
              height: 10px;
              background-color: #b8893a;
              border-radius: 50%;
            }
            .timeline-title {
              font-weight: 600;
              color: #2c2c2c;
              margin-bottom: 4px;
              font-size: 13px;
            }
            .timeline-desc {
              font-size: 12px;
              color: #888;
              line-height: 1.5;
            }
            .details-box {
              background-color: #f9f7f4;
              padding: 20px;
              border-radius: 8px;
              margin: 30px 0;
              border-left: 4px solid #b8893a;
            }
            .details-box-label {
              font-size: 11px;
              letter-spacing: 0.8px;
              color: #999;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 12px;
            }
            .details-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
              font-size: 13px;
            }
            .details-row:last-child {
              margin-bottom: 0;
            }
            .details-key {
              color: #888;
            }
            .details-value {
              color: #2c2c2c;
              font-weight: 500;
            }
            .divider {
              height: 1px;
              background-color: #e8e6e3;
              margin: 30px 0;
            }
            .contact-section {
              background-color: #f9f7f4;
              padding: 20px;
              border-radius: 8px;
            }
            .contact-title {
              font-size: 12px;
              letter-spacing: 0.8px;
              color: #999;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 12px;
            }
            .contact-item {
              font-size: 13px;
              color: #2c2c2c;
              margin-bottom: 8px;
            }
            .contact-item a {
              color: #b8893a;
              text-decoration: none;
              border-bottom: 1px solid #b8893a;
            }
            .contact-item a:hover {
              color: #9a7635;
            }
            .footer {
              padding: 20px 30px;
              background-color: #f9f7f4;
              border-top: 1px solid #e8e6e3;
              text-align: center;
              font-size: 11px;
              color: #999;
              letter-spacing: 0.3px;
              line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <h1>TATRA STAAR CITY</h1>
                <p>Where Vision Meets Value</p>
              </div>

              <div class="content">
                <p class="greeting">Thank you for your interest, <strong>${escapeHtml(data.name.split(' ')[0])}</strong>.</p>

                <p class="intro-text">We have received your enquiry regarding <strong>${escapeHtml(data.interest)}</strong> at TATRA STAAR CITY. Your request has been registered and our senior investment team has begun the review process.</p>

                <div class="section-title">What Comes Next</div>

                <div class="timeline-item">
                  <div class="timeline-title">Initial Review</div>
                  <div class="timeline-desc">Your enquiry is being reviewed by our senior team</div>
                </div>

                <div class="timeline-item">
                  <div class="timeline-title">Personal Contact</div>
                  <div class="timeline-desc">We will reach out within 24 business hours to discuss your requirements</div>
                </div>

                <div class="timeline-item">
                  <div class="timeline-title">Private Consultation</div>
                  <div class="timeline-desc">A dedicated advisor will schedule a consultation at your convenience</div>
                </div>

                <div class="timeline-item">
                  <div class="timeline-title">Exclusive Materials</div>
                  <div class="timeline-desc">Receive detailed project information, pricing, and investment documentation</div>
                </div>

                <div class="details-box">
                  <div class="details-box-label">Your Enquiry Summary</div>
                  <div class="details-row">
                    <span class="details-key">Interest:</span>
                    <span class="details-value">${escapeHtml(data.interest)}</span>
                  </div>
                  <div class="details-row">
                    <span class="details-key">Contact:</span>
                    <span class="details-value">${escapeHtml(data.phone)}</span>
                  </div>
                </div>

                <div class="contact-section">
                  <div class="contact-title">Questions in the Meantime</div>
                  <div class="contact-item">Email: <a href="mailto:investors@tatracapital.com">investors@tatracapital.com</a></div>
                  <div class="contact-item">Website: <a href="https://www.tatraprojects.com">www.tatraprojects.com</a></div>
                </div>

                <div class="divider"></div>

                <p style="font-size: 13px; color: #666; margin: 0; text-align: center;">We look forward to connecting with you soon and exploring this exceptional investment opportunity together.</p>
              </div>

              <div class="footer">
                <p style="margin: 0; padding: 0;">This is an automated confirmation. Your information is secure and confidential, used solely by TATRA Capital for your enquiry follow-up.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('User confirmation email error:', error);
  }
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export async function POST(request: NextRequest) {
  try {
    // Validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    // Parse request body
    let body: EnquiryData;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate enquiry data
    const validation = validateEnquiry(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 422 }
      );
    }

    // Save to database
    await saveToDatabase(body);

    // Send emails in parallel
    await Promise.all([
      sendAdminEmail(body),
      sendUserConfirmationEmail(body),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: 'Enquiry submitted successfully. Check your email for confirmation.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Enquiry submission error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        error: 'Failed to submit enquiry',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
