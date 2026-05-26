# 🔧 DEBUGGING & FIXES - Enquiry System

## 🚨 Issues Found

### Issue #1: Supabase RLS Policy Blocking Inserts
**Error:** `new row violates row-level security policy for table "enquiries"`

**Root Cause:** Row-Level Security (RLS) is enabled on the `enquiries` table but no policy allows anonymous inserts.

**Fix:** Disable RLS or create an insert policy

---

### Issue #2: Network Timeout to Supabase
**Error:** `Connect Timeout Error (attempted address: nlmwqqiwnyjwvbojtfxh.supabase.co:443, timeout: 10000ms)`

**Root Cause:** Network connectivity issue or Supabase service unavailable

**Fix:** Check connection, verify API key, ensure Supabase is running

---

## ✅ STEP-BY-STEP FIX

### **FIX #1: Disable RLS in Supabase (IMMEDIATE)**

1. **Go to Supabase Dashboard**
   - URL: https://nlmwqqiwnyjwvbojtfxh.supabase.co
   - Login with your account

2. **Navigate to the enquiries table**
   - Left sidebar → **Database**
   - Find **enquiries** table
   - Click on it

3. **Disable RLS**
   - Click **Security** tab
   - Look for **RLS Enabled** toggle
   - **Click to TURN OFF** (disable)
   - Confirm the change

OR **Create Insert Policy**:

Go to **Policies** tab and click **New Policy**

```sql
-- Policy Name: Allow anonymous insert

CREATE POLICY "Allow anonymous inserts" ON public.enquiries
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow anonymous selects" ON public.enquiries
FOR SELECT
USING (true);
```

---

### **FIX #2: Verify Supabase Connection**

Check that your credentials are correct:

```bash
# Test with curl
curl -X POST https://nlmwqqiwnyjwvbojtfxh.supabase.co/rest/v1/enquiries \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_ANON_KEY" \
  -d '{"name":"Test","email":"test@test.com","phone":"9876543210","interest":"Test","message":null}'
```

**Your Credentials (from .env.local):**
```
URL: https://nlmwqqiwnyjwvbojtfxh.supabase.co
ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sbXdxcWl3bnlqd3Zib2p0ZnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NDM0NDksImV4cCI6MjA5NTIxOTQ0OX0.5JEUURe11dRAriK8tt1rTnM_E3TjoiuwcxmPzTCBGZc
```

---

### **FIX #3: Test API Step by Step**

**Step 1: Check Server is Running**
```bash
curl -s http://localhost:3000/api/enquire -X OPTIONS -w "\nStatus: %{http_code}\n"
```

Expected: `Status: 200`

---

**Step 2: Test with Valid Data**
```bash
curl -X POST http://localhost:3000/api/enquire \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rajesh Kumar",
    "email": "rajesh@test.com",
    "phone": "9876543210",
    "interest": "Plotted Development",
    "message": "Test message"
  }' | jq .
```

Expected Response (HTTP 201):
```json
{
  "success": true,
  "message": "Enquiry submitted successfully. Check your email for confirmation."
}
```

---

**Step 3: Test with Invalid Email**
```bash
curl -X POST http://localhost:3000/api/enquire \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "invalid-email",
    "phone": "9876543210",
    "interest": "Plotted Development"
  }' | jq .
```

Expected Response (HTTP 422):
```json
{
  "error": "Validation failed",
  "details": ["Invalid email format"]
}
```

---

**Step 4: Test with Missing Field**
```bash
curl -X POST http://localhost:3000/api/enquire \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@test.com",
    "phone": "9876543210"
  }' | jq .
```

Expected Response (HTTP 422):
```json
{
  "error": "Validation failed",
  "details": ["Interest field is required"]
}
```

---

## 📊 Full Test Suite

### Test 1: Valid Complete Submission
```bash
curl -s -X POST http://localhost:3000/api/enquire \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "phone": "+91-9876543210",
    "interest": "Plotted Development",
    "message": "I am interested in a 2-acre plot."
  }' | jq .
```

**Expected:** HTTP 201 ✅

---

### Test 2: Missing Name
```bash
curl -s -X POST http://localhost:3000/api/enquire \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "email": "test@test.com",
    "phone": "9876543210",
    "interest": "Plotted Development"
  }' | jq .
```

**Expected:** HTTP 422 with error ❌

---

### Test 3: Invalid Email Format
```bash
curl -s -X POST http://localhost:3000/api/enquire \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "invalid.email",
    "phone": "9876543210",
    "interest": "Plotted Development"
  }' | jq .
```

**Expected:** HTTP 422 ❌

---

### Test 4: Phone Too Short
```bash
curl -s -X POST http://localhost:3000/api/enquire \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@test.com",
    "phone": "123",
    "interest": "Plotted Development"
  }' | jq .
```

**Expected:** HTTP 422 ❌

---

### Test 5: Different Interest Types
```bash
# Interest Option 1
curl -s -X POST http://localhost:3000/api/enquire \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@test.com",
    "phone": "9876543210",
    "interest": "Investment Opportunity"
  }' | jq .

# Interest Option 2
curl -s -X POST http://localhost:3000/api/enquire \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@test.com",
    "phone": "9876543210",
    "interest": "Site Visit"
  }' | jq .
```

**Expected:** HTTP 201 ✅

---

## 🔍 Email Testing

### Check Admin Email Received
1. Go to: **sales@tatracapital.com**
2. Check inbox for "🏠 New Enquiry from [Name]"
3. Verify content includes:
   - ✅ Name, Email, Phone
   - ✅ Interest type
   - ✅ Message (if provided)
   - ✅ Reply-To header
   - ✅ Timestamp in IST

### Check User Confirmation Email
1. Check email used in form submission
2. Look for "✅ We Received Your Enquiry"
3. Verify content includes:
   - ✅ Personalized greeting
   - ✅ Confirmation message
   - ✅ "Contact within 24 hours"
   - ✅ What Happens Next list
   - ✅ Contact information

---

## 💾 Database Verification

### Check Data in Supabase

1. Go to **Supabase Dashboard**
2. Click **Database** → **enquiries**
3. Verify new row exists with:
   - ✅ Name populated
   - ✅ Email stored (lowercase)
   - ✅ Phone number correct
   - ✅ Interest field set
   - ✅ Message (if provided)
   - ✅ created_at timestamp

---

## 🐛 Troubleshooting Checklist

### If Getting "RLS Policy" Error

- [ ] Go to Supabase Dashboard
- [ ] Select enquiries table
- [ ] Click Security tab
- [ ] Toggle RLS to OFF
- [ ] Retry form submission

### If Getting "Network Timeout" Error

- [ ] Check internet connection
- [ ] Verify Supabase URL is correct
- [ ] Verify API Key is correct
- [ ] Check Supabase status page
- [ ] Restart dev server

### If Getting "Email Not Sent" Error

- [ ] Check Resend API key in .env.local
- [ ] Verify you haven't hit 100/day rate limit
- [ ] Check spam/junk folder
- [ ] Verify domain is verified in Resend

### If Form Not Submitting

- [ ] Open browser console (F12)
- [ ] Look for JavaScript errors
- [ ] Check Network tab for API response
- [ ] Verify .env.local has all keys
- [ ] Restart dev server

---

## 📋 Complete Verification Workflow

### 1. **Pre-Flight Checks**
```
✓ Server running: http://localhost:3000
✓ .env.local has Supabase credentials
✓ .env.local has Resend API key
✓ Supabase RLS is disabled or policy exists
✓ Resend API key is active
```

### 2. **API Endpoint Tests**
```
✓ OPTIONS request returns 200
✓ Valid submission returns 201
✓ Invalid email returns 422
✓ Missing field returns 422
✓ Short phone returns 422
```

### 3. **Email Tests**
```
✓ Admin email received in sales@tatracapital.com
✓ User confirmation email in user inbox
✓ Both emails have correct content
✓ Both emails are professionally formatted
```

### 4. **Database Tests**
```
✓ New entry appears in Supabase
✓ Data is correctly formatted
✓ Timestamp is recorded
✓ Email is stored as lowercase
```

### 5. **Form UI Tests**
```
✓ Form shows loading spinner
✓ Button disabled during submission
✓ Success notification appears
✓ Form clears after submission
✓ Error notifications work
```

---

## 🚀 Once All Tests Pass

When everything works:

1. ✅ Save this testing checklist
2. ✅ Celebrate - System is LIVE!
3. ✅ Monitor first few submissions
4. ✅ Check admin email for new enquiries
5. ✅ Verify database entries
6. ✅ Ready for production!

---

## 📞 Quick Reference

**API Endpoint:** `POST http://localhost:3000/api/enquire`

**Supabase:** https://nlmwqqiwnyjwvbojtfxh.supabase.co

**Admin Email:** sales@tatracapital.com

**Test Timeout:** 10 seconds per request

---

**Start with FIX #1 above and let me know what happens!**
