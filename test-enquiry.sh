#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Testing Enquiry API Endpoint${NC}\n"

# Wait for server to be ready
echo "⏳ Waiting for server to be ready..."
for i in {1..30}; do
  if curl -s http://localhost:3002/api/enquire -X OPTIONS > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Server is ready!${NC}\n"
    break
  fi
  if [ $i -eq 30 ]; then
    echo -e "${RED}✗ Server failed to start${NC}"
    exit 1
  fi
  sleep 1
done

# Test 1: Valid submission
echo -e "${YELLOW}Test 1: Valid Complete Submission${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3002/api/enquire \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "interest": "Plotted Development",
    "message": "This is a test enquiry."
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "201" ]; then
  echo -e "${GREEN}✓ PASS: HTTP 201${NC}"
  echo "Response: $BODY"
else
  echo -e "${RED}✗ FAIL: Expected 201, got $HTTP_CODE${NC}"
  echo "Response: $BODY"
fi

echo -e "\n${YELLOW}Test 2: Missing Email (Validation Failure)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3002/api/enquire \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "",
    "phone": "9876543210",
    "interest": "Plotted Development"
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "422" ]; then
  echo -e "${GREEN}✓ PASS: HTTP 422 (Validation Error)${NC}"
  echo "Response: $BODY"
else
  echo -e "${RED}✗ FAIL: Expected 422, got $HTTP_CODE${NC}"
  echo "Response: $BODY"
fi

echo -e "\n${YELLOW}Test 3: Invalid Email Format${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3002/api/enquire \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid-email",
    "phone": "9876543210",
    "interest": "Plotted Development"
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "422" ]; then
  echo -e "${GREEN}✓ PASS: HTTP 422 (Invalid Email)${NC}"
  echo "Response: $BODY"
else
  echo -e "${RED}✗ FAIL: Expected 422, got $HTTP_CODE${NC}"
  echo "Response: $BODY"
fi

echo -e "\n${YELLOW}Test 4: Invalid Phone (Too Short)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3002/api/enquire \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "123",
    "interest": "Plotted Development"
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "422" ]; then
  echo -e "${GREEN}✓ PASS: HTTP 422 (Invalid Phone)${NC}"
  echo "Response: $BODY"
else
  echo -e "${RED}✗ FAIL: Expected 422, got $HTTP_CODE${NC}"
  echo "Response: $BODY"
fi

echo -e "\n${GREEN}✓ All API tests completed!${NC}\n"
