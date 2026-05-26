# ✅ Enquiry System - Complete Setup Guide

## 🎯 Status: API Working! 

The API endpoint is now responding correctly at `/api/enquire`. Just need to configure Supabase RLS policies.

---

## 📋 Complete Setup Checklist

### ✅ Step 1: Environment Variables
- [x] `.env.local` created with all credentials
  - Supabase URL & API Key
  - Resend API Key
  - Admin Email

### ✅ Step 2: Dependencies Installed
- [x] `@supabase/supabase-js`
- [x] `resend`

### ✅ Step 3: API Route Created
- [x] `/app/api/enquire/route.ts` implemented
  - Validation (name, email, phone, interest)
  - Email format validation
  - Phone number validation (10+ digits)
  - Supabase database integration
  - Email sending (admin + user confirmation)
  - Error handling

### ✅ Step 4: Form Updated
- [x] Enhanced enquiry form with API integration
  - Loading state with spinner
  - Client-side validation
  - Error handling
  - Auto-form reset after submission

### ⏳ Step 5: Supabase Configuration (NEXT)

---

## 🚨 Current Issue: RLS Policy

**Error:** "new row violates row-level security policy for table "enquiries""

**Solution:** Disable or configure RLS policies for the `enquiries` table

### Fix: Disable RLS for Development

1. **Go to Supabase Dashboard**
   - Project URL: `https://nlmwqqiwnyjwvbojtfxh.supabase.co`
   - Login with your credentials

2. **Navigate to Authentication → Policies**
   - Or: Database → enquiries table → Security

3. **Disable RLS for `enquiries` table** (Development approach)
   ```
   Click on "enquiries" table
   → Security tab
   → Toggle "RLS Enabled" OFF
   ```

   **OR**

### Fix: Configure RLS Policies (Production approach)

Create a policy that allows authenticated inserts:

```sql
-- In Supabase SQL Editor, run:

-- Allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON enquiries
FOR INSERT
WITH CHECK (true);

-- Allow anonymous selects (for admin dashboard later)
CREATE POLICY "Allow anonymous selects" ON enquiries
FOR SELECT
USING (true);
```

---

## 🧪 Test the Complete Flow

### Test 1: Valid Submission

```bash
curl -X POST http://localhost:3000/api/enquire \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "phone": "9876543210",
    "interest": "Plotted Development",
    "message": "Interested in a 2-acre plot."
  }'
```

**Expected Response (HTTP 201):**
```json
{
  "success": true,
  "message": "Enquiry submitted successfully. Check your email for confirmation."
}
```

### Test 2: Validation Error (Missing Email)

```bash
curl -X POST http://localhost:3000/api/enquire \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "",
    "phone": "9876543210",
    "interest": "Investment Opportunity"
  }'
```

**Expected Response (HTTP 422):**
```json
{
  "error": "Validation failed",
  "details": ["Email is required"]
}
```

### Test 3: Invalid Email Format

```bash
curl -X POST http://localhost:3000/api/enquire \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "invalid-email",
    "phone": "9876543210",
    "interest": "Plotted Development"
  }'
```

**Expected Response (HTTP 422):**
```json
{
  "error": "Validation failed",
  "details": ["Invalid email format"]
}
```

---

## 📊 What Gets Stored & Sent

### Database Entry (Supabase enquiries table)
```
id:         Auto-generated
name:       User's full name
email:      Lowercase email
phone:      Phone number
interest:   Selected interest type
message:    Optional custom message
created_at: Timestamp in UTC
```

### Admin Email
- **To:** sales@tatraprojects.com
- **From:** TATRA STAAR CITY <onboarding@resend.dev>
- **Reply-To:** User's email
- **Content:** Professional HTML with all enquiry details

### User Confirmation Email
- **To:** User's email
- **Subject:** ✅ We Received Your Enquiry - TATRA STAAR CITY
- **Content:** Personalized welcome with next steps

---

## 🔄 Complete User Flow

```
1. User fills form
   ↓
2. Client-side validation
   ↓
3. Submit to /api/enquire
   ↓
4. Server-side validation
   ↓
5. Save to Supabase database
   ↓
6. Send admin email
   ↓
7. Send user confirmation email
   ↓
8. Return success response
   ↓
9. Form clears, user sees success toast
```

---

## 📱 Form Field Validation Rules

| Field | Required | Rules | Example |
|-------|----------|-------|---------|
| Name | Yes | Non-empty, trim whitespace | "Rajesh Kumar" |
| Email | Yes | Valid email format with @ and domain | "rajesh@example.com" |
| Phone | Yes | 10+ digits, allows +, -, (), spaces | "+91-9876543210" |
| Interest | Yes | One of: Plotted Development, Investment Opportunity, Site Visit, Brochure & Pricing | "Plotted Development" |
| Message | No | Optional, any text | "I am interested in..." |

---

## 🚀 Next Steps

### 1. Configure Supabase RLS (CRITICAL)
   - [ ] Go to Supabase Dashboard
   - [ ] Disable RLS on `enquiries` table OR
   - [ ] Create insert policy (SQL provided above)

### 2. Test the Full Flow
   - [ ] Open http://localhost:3000
   - [ ] Fill the enquiry form with valid data
   - [ ] Click "Request a Consultation"
   - [ ] Check for success notification
   - [ ] Check admin email at sales@tatraprojects.com
   - [ ] Check user email inbox for confirmation

### 3. Verify Database
   - [ ] Go to Supabase Dashboard
   - [ ] Check `enquiries` table
   - [ ] Verify new entry is created

### 4. Monitor in Production
   - [ ] Set up email notifications
   - [ ] Create admin dashboard (optional)
   - [ ] Set up CRM integration (optional)

---

## 🐛 Troubleshooting

### API Returning 500 Error
**Check:**
- [ ] Supabase RLS policy configured
- [ ] Supabase table exists and is named "enquiries"
- [ ] Column names match: id, name, email, phone, interest, message, created_at
- [ ] Server logs for detailed error

**View Logs:**
```bash
# Terminal where `npm run dev` is running
# Shows real-time error messages
```

### Emails Not Being Sent
**Check:**
- [ ] Resend API key is valid
- [ ] Domain verified in Resend (or use `onboarding@resend.dev`)
- [ ] No rate limit hit (100 emails/day on free tier)

### Form Not Submitting
**Check:**
- [ ] API endpoint returns 201 status
- [ ] No JavaScript errors (Check browser console)
- [ ] Network tab shows request completed
- [ ] .env.local has correct API keys

---

## 📞 Quick Reference

**API Endpoint:** `POST /api/enquire`

**Success Response:**
```json
{
  "success": true,
  "message": "Enquiry submitted successfully..."
}
```

**Error Response:**
```json
{
  "error": "Error description",
  "message": "Detailed message",
  "details": ["Validation error 1", "Validation error 2"]
}
```

**Supabase Credentials:**
- URL: `https://nlmwqqiwnyjwvbojtfxh.supabase.co`
- Key: In .env.local

**Resend Credentials:**
- API Key: In .env.local
- Dashboard: https://resend.com

---

## ✨ You're Almost Done!

**Just one more step:** Configure Supabase RLS and you'll be live! 🚀

All the hard work is done:
- ✅ API fully implemented
- ✅ Validation in place
- ✅ Email templates created
- ✅ Form integrated
- ✅ Error handling complete

Just configure RLS and test! 🎉
