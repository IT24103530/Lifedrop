# LifeDrop AI Prompt Log

This document records AI tool interactions during the build session.

---

## Entry 01

### Team Member
Member A (Donor Registration Specialist)

### AI Tool
Gemini 3.6 Flash / GitHub Copilot

### Exact Prompt
> "Generate a React donor registration form component with MERN backend API integration for LifeDrop blood donation platform. Required fields: name, bloodType (enum), district (Sri Lankan districts), phone (SL regex validation), lastDonationDate (cannot be in future). Provide inline error messages without window.alert, disable submit button when invalid, and include indicative eligibility disclaimer."

### Purpose
To rapidly generate boilerplate form validation state and regex validation for Sri Lankan phone numbers.

### Output Used
Regex pattern `^(?:\+94|0)?7[0-9]{8}$` and controlled input state handling logic.

### What We Checked
Verified that phone validation allows common Sri Lankan formats (e.g. 0771234567, +94771234567) and tested future date validation with boundary conditions.

### What We Modified
Removed browser `alert()` popups, added custom inline helper text under inputs, and styled the success notification banner.

### What We Rejected
Rejected generic US phone format validation generated initially by the AI model.

### Security/Privacy Check
Confirmed no passwords, API keys, or private user credentials were present in prompt or output.

---

## Entry 02

### Team Member
Member B (Blood Request Specialist)

### AI Tool
ChatGPT (GPT-4)

### Exact Prompt
> "Create an Express router POST endpoint '/api/requests' using Mongoose Request schema with fields: patientHospital, bloodType, urgency ('Critical', 'Urgent', 'Normal'), and district. Include strict validation and JSON response."

### Purpose
To generate the Mongoose Request schema and server-side validation middleware.

### Output Used
Mongoose schema structure with enum restrictions on `bloodType` and `urgency`.

### What We Checked
Ran Postman tests with missing fields to ensure HTTP 400 response with informative error messages.

### What We Modified
Added default urgency level 'Normal' and formatted error responses to match frontend contract.

### What We Rejected
Rejected heavy third-party validation libraries (Joi/Zod) to avoid unnecessary package overhead during the 4-hour build window.

### Security/Privacy Check
Confirmed no API keys or environment secrets were included.

---

## Entry 03

### Team Member
Member C (Browse Donors & Eligibility Specialist)

### AI Tool
Claude 3.5 Sonnet

### Exact Prompt
> "Write a JavaScript function and React component to calculate blood donation eligibility based on last donation date. If less than 4 months ago, mark as ineligible; if 4 months or more, mark as eligible. Display mandatory medical disclaimer."

### Purpose
To enforce accurate 4-month donation interval calculation and mandatory medical disclaimers.

### Output Used
Date difference logic calculating months elapsed from `lastDonationDate`.

### What We Checked
Tested edge cases: exactly 4 months ago (eligible), 3 months and 29 days (ineligible), future dates (invalid input).

### What We Modified
Ensured the mandatory disclaimer wording: *"Indicative only, not medical advice. Final eligibility should be determined by qualified medical/blood-bank personnel."* is permanently visible.

### What We Rejected
Rejected complex medical algorithms for plasma vs red blood cells to keep scope realistic for 4 hours.

### Security/Privacy Check
Confirmed zero secret exposure.

---

## Entry 04

### Team Member
Member D (Active Requests & Landing Page Lead)

### AI Tool
Gemini 3.6 Flash

### Exact Prompt
> "Create an Express GET endpoint '/api/requests' that fetches requests from MongoDB and sorts them by custom urgency order: Critical first, Urgent second, Normal third."

### Purpose
To implement custom urgency priority sorting for active requests.

### Output Used
In-memory priority mapping `const urgencyPriority = { Critical: 1, Urgent: 2, Normal: 3 }` and sort function.

### What We Checked
Verified that Critical requests appear at the top of the UI list regardless of insertion timestamp.

### What We Modified
Added secondary sorting by `createdAt` timestamp (newest first within the same urgency level).

### What We Rejected
Rejected MongoDB `$facet` aggregation pipelines to keep code simple and readable.

### Security/Privacy Check
Verified clean codebase without secret leaks.
