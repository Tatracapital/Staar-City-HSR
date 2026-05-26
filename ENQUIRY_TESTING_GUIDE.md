# Enquiry Form Testing Guide

## 🎯 Overview

This guide covers comprehensive testing of the enquiry form submission system, including:
- ✅ Successful submissions
- ❌ Validation failures
- 🔒 Error handling
- 📧 Email delivery
- 💾 Database storage

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- Environment variables configured (.env.local)
- Supabase project created with `enquiries` table
- Resend API key configured

### Start the Development Server

```bash
cd "c:/Users/gouth/Desktop/template/TATRA Capital"
npm run dev
```

Server will run on: `http://localhost:3002`

---

## 📋 Test Cases

### ✅ **1. Valid Submission - Full Details**

**Test Data:**
```
Name:      Rajesh Kumar
Email:     rajesh@example.com
Phone:     +91-9800000001
Interest:  Plotted Development
Message:   I am interested in a 2-acre plot in STAAR CITY.
```

**Expected Results:**
- ✅ Form submits successfully (HTTP 201)
- ✅ Toast notification: "Request received..."
- ✅ Form clears after 2 seconds
- ✅ Admin receives email at sales@tatraprojects.com
- ✅ User receives confirmation email
- ✅ Data stored in Supabase `enquiries` table

**How to Test:**
1. Open http://localhost:3002 in browser
2. Scroll to "Request a Consultation" section
3. Fill in all fields
4. Click "Request a Consultation" button
5. Check email inbox for confirmation

---

### ✅ **2. Valid Submission - Minimal Details**

**Test Data:**
```
Name:     Priya Sharma
Email:    priya.sharma@business.com
Phone:    9876543210
Interest: Investment Opportunity
Message:  (leave empty)
```

**Expected Results:**
- ✅ Form submits successfully
- ✅ Works without optional message field
- ✅ Both emails sent
- ✅ Database entry created

---

### ✅ **3. Valid Submission - Different Interest Option**

**Test Data:**
```
Name:     Amit Patel
Email:    amit@company.in
Phone:    (+91) 98-0000-0002
Interest: Site Visit
Message:  Would like to visit this weekend.
```

**Expected Results:**
- ✅ Different interest type handled correctly
- ✅ Phone with special characters accepted
- ✅ Complete flow works

---

## ❌ **Validation Tests**

### ❌ **4. Missing Name**

**Test Data:**
```
Name:     (empty)
Email:    test@example.com
Phone:    9876543210
Interest: Plotted Development
```

**Expected Results:**
- ❌ Error toast: "Please enter your name."
- ❌ Form NOT submitted
- ❌ No emails sent
- ❌ No database entry

---

### ❌ **5. Missing Email**

**Test Data:**
```
Name:     John Doe
Email:    (empty)
Phone:    9876543210
Interest: Plotted Development
```

**Expected Results:**
- ❌ Error toast: "Please enter your email."
- ❌ Form NOT submitted

---

### ❌ **6. Missing Phone**

**Test Data:**
```
Name:     John Doe
Email:    john@example.com
Phone:    (empty)
Interest: Plotted Development
```

**Expected Results:**
- ❌ Error toast: "Please enter your phone number."
- ❌ Form NOT submitted

---

### ❌ **7. Invalid Email Format**

**Test Data:**
```
Name:     John Doe
Email:    invalid-email (no @ symbol)
Phone:    9876543210
Interest: Plotted Development
```

**Expected Results:**
- ❌ Client-side error: "Please enter a valid email address."
- ❌ Form NOT submitted

**Additional Email Tests:**
- `test@` → Invalid (no domain)
- `test.com` → Invalid (no @)
- `test@@example.com` → Invalid (double @)
- `test@example` → Invalid (no TLD)

---

### ❌ **8. Invalid Phone Number**

**Test Data:**
```
Name:     John Doe
Email:    john@example.com
Phone:    12345 (less than 10 digits)
Interest: Plotted Development
```

**Expected Results:**
- ❌ Error toast: "Please enter a valid phone number (at least 10 digits)."
- ❌ Form NOT submitted

**Additional Phone Tests:**
- `123` → Invalid (too short)
- `9876543210` ✅ Valid
- `+91-9876543210` ✅ Valid
- `(+91) 98765 43210` ✅ Valid (with spaces)

---

### ❌ **9. Whitespace-Only Name**

**Test Data:**
```
Name:     "   " (only spaces)
Email:    john@example.com
Phone:    9876543210
Interest: Plotted Development
```

**Expected Results:**
- ❌ Error toast: "Please enter your name."
- ❌ Form NOT submitted

---

## 🔒 **Error Handling Tests**

### 🔒 **10. Network Timeout**

**How to Test:**
1. Fill in valid form
2. Disconnect internet or block API request
3. Submit form

**Expected Results:**
- ❌ Error toast: "Network error. Please try again."
- ❌ Retry possible

**How to Block API:**
- Use browser DevTools → Network tab → Offline mode
- Or disable network connection

---

### 🔒 **11. Server Error (500)**

**Simulated by:** Disabling Supabase/Resend temporarily

**Expected Results:**
- ❌ Error toast: "Failed to submit enquiry"
- ❌ Form resets to allow retry
- ❌ Server logs error details

---

### 🔒 **12. Button Disabled During Submission**

**How to Test:**
1. Fill in valid form
2. Click "Request a Consultation"
3. Quickly try to click button again

**Expected Results:**
- ✅ Button shows "Submitting..." with spinner
- ✅ Button disabled (not clickable)
- ✅ Cannot double-submit

---

## 📧 **Email Verification Tests**

### 📧 **13. Admin Email Receipt**

**Check:**
1. Open email at: sales@tatraprojects.com
2. Verify received email from TATRA STAAR CITY system
3. Check email contains:
   - ✅ Inquiry details (name, email, phone, interest, message)
   - ✅ Reply-To header set to user's email
   - ✅ Professional HTML formatting
   - ✅ Timestamp in IST timezone

---

### 📧 **14. User Confirmation Email**

**Check:**
1. Check submitted email inbox
2. Look for "We Received Your Enquiry" email
3. Verify content:
   - ✅ Personalized greeting with user's first name
   - ✅ Confirmation of enquiry receipt
   - ✅ Timeline: "contact within 24 hours"
   - ✅ Call-to-action button (Reply)
   - ✅ TATRA Capital contact info

---

## 💾 **Database Verification Tests**

### 💾 **15. Data Stored in Supabase**

**How to Check:**
1. Log into Supabase Dashboard
2. Navigate to: `Database` → `enquiries` table
3. Verify latest entries:
   - ✅ Name field populated
   - ✅ Email stored (lowercase)
   - ✅ Phone stored correctly
   - ✅ Interest field captured
   - ✅ Message (if provided)
   - ✅ created_at timestamp

**Expected Schema:**
```sql
id (BIGINT)
name (TEXT)
email (TEXT) - stored as lowercase
phone (TEXT)
interest (TEXT)
message (TEXT) - nullable
created_at (TIMESTAMP) - auto set to UTC
```

---

## 🔧 **Automated Testing**

### Run Test Suite

```bash
# Navigate to project
cd "c:/Users/gouth/Desktop/template/TATRA Capital"

# Make sure server is running in another terminal
npm run dev

# In new terminal, run tests
node __tests__/api/enquire.test.ts
```

**Expected Output:**
```
🚀 Starting Enquiry API Tests...

📍 Testing endpoint: http://localhost:3002/api/enquire

════════════════════════════════════════════════════════
✅ PASS: Valid enquiry with all fields
   └─ Complete enquiry with all required and optional fields
   └─ Status: 201, Response: Success

...

📊 Test Results Summary:

  Total Tests: 13
  ✅ Passed: 13
  ❌ Failed: 0
  Success Rate: 100.0%

🎉 All tests passed!
```

---

## 📊 **Manual Testing Checklist**

### Before Testing
- [ ] .env.local configured with Supabase & Resend keys
- [ ] Dev server running (`npm run dev`)
- [ ] Email accounts ready to check
- [ ] Browser DevTools open for network monitoring

### During Testing
- [ ] Valid submission completes successfully
- [ ] Validation errors show correct messages
- [ ] Button shows loading state during submission
- [ ] Form clears after successful submission
- [ ] Toast notifications appear correctly

### After Testing
- [ ] Check admin email received
- [ ] Check user confirmation email received
- [ ] Verify data in Supabase dashboard
- [ ] Check browser console for errors (F12)
- [ ] Check server logs for any warnings

---

## 🐛 **Troubleshooting**

### Email Not Received

**Possible Causes:**
1. Resend API key incorrect or expired
2. Email marked as spam (check spam folder)
3. Domain not verified in Resend
4. Rate limit exceeded (100/day on free tier)

**Solution:**
```bash
# Check server logs for email errors
# Look for "Failed to send email" messages
npm run dev  # Watch terminal output
```

### Database Not Storing Data

**Possible Causes:**
1. Supabase table doesn't exist
2. Supabase API key invalid
3. Table permissions not set

**Solution:**
```sql
-- Create table in Supabase SQL Editor
CREATE TABLE enquiries (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  interest TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Form Not Submitting

**Check:**
1. Network tab (DevTools → Network) - any 400/500 errors?
2. Console tab - JavaScript errors?
3. .env.local file - all variables present?
4. Server still running?

---

## ✅ **Final Sign-Off**

When all tests pass:
- ✅ Enquiry form fully functional
- ✅ Email notifications working
- ✅ Database storage operational
- ✅ Error handling robust
- ✅ Production ready

**Ready for deployment!** 🚀

---

## 📞 **Support**

For issues:
1. Check server logs (`npm run dev` output)
2. Review browser console errors (F12)
3. Verify .env.local configuration
4. Check Supabase/Resend dashboards for errors
