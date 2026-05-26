import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const resendKey = process.env.RESEND_API_KEY;
const adminEmail = process.env.ADMIN_EMAIL;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

if (!resendKey) {
  throw new Error('Missing Resend API key');
}

if (!adminEmail) {
  throw new Error('Missing admin email');
}

const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(resendKey);

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

  const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
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
  const { error } = await resend.emails.send({
    from: 'TATRA STAAR CITY <onboarding@resend.dev>',
    to: adminEmail,
    replyTo: data.email,
    subject: `🏠 New Enquiry from ${data.name} - TATRA STAAR CITY`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8b7355 0%, #5c4a3d 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f7f4; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin: 15px 0; border-left: 4px solid #b8893a; padding-left: 15px; }
            .label { font-weight: bold; color: #8b7355; }
            .value { color: #555; margin-top: 5px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
            .cta { background: #b8893a; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; text-decoration: none; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📧 New Enquiry Received</h2>
              <p>A potential investor has shown interest in TATRA STAAR CITY</p>
            </div>

            <div class="content">
              <div class="field">
                <div class="label">👤 Name</div>
                <div class="value">${escapeHtml(data.name)}</div>
              </div>

              <div class="field">
                <div class="label">📧 Email</div>
                <div class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
              </div>

              <div class="field">
                <div class="label">📱 Phone</div>
                <div class="value"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></div>
              </div>

              <div class="field">
                <div class="label">🎯 Interested In</div>
                <div class="value">${escapeHtml(data.interest)}</div>
              </div>

              ${
                data.message
                  ? `
                <div class="field">
                  <div class="label">💬 Message</div>
                  <div class="value">${escapeHtml(data.message)}</div>
                </div>
              `
                  : ''
              }

              <div style="margin-top: 30px;">
                <a href="mailto:${escapeHtml(data.email)}" class="cta">Reply to Enquiry</a>
              </div>
            </div>

            <div class="footer">
              <p>This is an automated email from TATRA STAAR CITY enquiry system. Please reply to the customer's email to follow up on their interest.</p>
              <p>Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error('Admin email error:', error);
    throw new Error(`Failed to send admin email: ${error.message}`);
  }
}

async function sendUserConfirmationEmail(data: EnquiryData) {
  const { error } = await resend.emails.send({
    from: 'TATRA STAAR CITY <onboarding@resend.dev>',
    to: data.email,
    subject: '✅ We Received Your Enquiry - TATRA STAAR CITY',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8b7355 0%, #5c4a3d 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9f7f4; padding: 30px 20px; border-radius: 0 0 8px 8px; text-align: center; }
            .heading { color: #8b7355; margin: 20px 0; }
            .subtext { color: #666; margin: 15px 0; }
            .benefits { list-style: none; padding: 0; margin: 20px 0; }
            .benefits li { padding: 10px 0; border-bottom: 1px solid #ddd; }
            .benefits li:before { content: "✓ "; color: #b8893a; font-weight: bold; }
            .footer { color: #999; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>TATRA STAAR CITY</h1>
              <p>Where Vision Meets Value</p>
            </div>

            <div class="content">
              <h2 class="heading">Thank You for Your Interest! 🙏</h2>

              <p class="subtext">Hi <strong>${escapeHtml(data.name.split(' ')[0])}</strong>,</p>

              <p>We've received your enquiry and appreciate your interest in TATRA STAAR CITY. Our senior investment team is reviewing your details right now.</p>

              <h3 style="color: #8b7355; margin-top: 30px;">What Happens Next:</h3>
              <ul class="benefits">
                <li>Our team will contact you within 24 business hours</li>
                <li>We'll provide detailed information about your interest</li>
                <li>Schedule a private consultation at your convenience</li>
                <li>Share exclusive project updates and pricing</li>
              </ul>

              <p style="margin-top: 30px; color: #666;">
                <strong>Your Enquiry Details:</strong><br>
                Interest: ${escapeHtml(data.interest)}<br>
                Phone: ${escapeHtml(data.phone)}
              </p>

              <div style="margin-top: 30px; padding: 20px; background: white; border-left: 4px solid #b8893a; text-align: left;">
                <p><strong>Contact Information:</strong></p>
                <p>📧 sales@tatracapital.com</p>
                <p>🌍 www.tatraprojects.com</p>
              </div>
            </div>

            <div class="footer">
              <p>This is an automated confirmation email. Your information is secure and will only be used by TATRA Capital for your enquiry follow-up.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error('User confirmation email error:', error);
    // Don't throw - this is less critical than admin email
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
