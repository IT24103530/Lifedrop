# LifeDrop 🩸
> **Voluntary Blood Donation Platform** | Sri Lanka Blood Donor-Request Connector Platform

LifeDrop is a streamlined MERN-stack web application designed to connect voluntary blood donors directly with urgent patient blood requests across Sri Lankan districts, addressing critical regional supply imbalances.

---

## 1. Project Overview

* **Project Name:** LifeDrop
* **Platform:** Voluntary Non-Profit Blood Donation Framework
* **Stack:** MERN (MongoDB Atlas, Express.js, React, Node.js)
* **Target Audience:** Patients, family members, and voluntary blood donors across Sri Lanka.

---

## 2. Selected Problem

Bridging regional and seasonal blood donation imbalances across Sri Lanka's 25 districts without relying on scattered, unstructured social media requests.

---

## 3. Accurate Sri Lankan Problem Framing

> **Important Framing:** Sri Lanka's overall blood supply is **adequate on paper** (466,061 units collected in 2023 vs. ~450,000 demand, operating a 100% voluntary system since 2014), but **severe regional and seasonal gaps persist** — e.g., the Jaffna cluster collected only 14,013 units (Kilinochchi just 1,332), national donation participation is ~1.5% vs. the WHO-recommended 2%, and donations dip sharply during the Sinhala/Tamil New Year.

---

## 4. Affected Users

> **Patients and families in low-donation districts who currently rely on scattered WhatsApp and Facebook posts to find donors urgently.**

---

## 5. Proposed Solution

LifeDrop provides a unified, real-time connector platform where:
* Voluntary donors register their blood type, district, and contact details.
* Patients and hospitals publish urgent blood requirements with priority tagging.
* Users can instantly filter donors by blood group and district.
* Active requests are automatically sorted by urgency level (Critical > Urgent > Normal).

---

## 6. Main Features

1. **Donor Registration:** Full form validation, valid Sri Lankan phone checking, last donation date validation.
2. **Blood Request Posting:** Instant publication of hospital requirements with urgency classification.
3. **Browse Donors:** Filterable list by blood type and district.
4. **Donor Eligibility Calculation:** Indicative eligibility based on whether last donation was ≥ 4 months ago.
5. **Active Requests Hub:** Live requests sorted by urgency level.
6. **Critical Need Districts View:** Highlighted district focus for regional awareness.

---

## 7. Critical Need Districts

> **Critical Need Districts**
>
> Jaffna and Kilinochchi are highlighted because regional donation participation can vary significantly. LifeDrop helps surface local donor/request information rather than relying on scattered social-media posts.

---

## 8. Technology Stack

* **Frontend:** React 18, React Router v6, Vite, Vanilla CSS (Glassmorphism & Custom Design System), Lucide Icons.
* **Backend:** Node.js, Express.js, Mongoose.
* **Database:** MongoDB (Local / MongoDB Atlas).

---

## 9. Why MERN?

* **Rapid Development:** Express and Node.js enable fast creation of REST APIs within the 4-hour window.
* **Schema Flexibility:** MongoDB Mongoose schema handles optional donor and request metadata easily.
* **Component Reusability:** React component architecture facilitates clear separation into vertical feature slices per team member.
* **Independent Deployment:** Simple decoupling into static Vercel/Netlify frontend and Render backend.

---

## 10. Repository Structure

```text
LifeDrop/
├── frontend/             # Root for Vercel/Netlify deployment
│   ├── package.json
│   ├── vite.config.js
│   ├── .env
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── app/          # App shell & router
│       ├── features/     # Vertical feature slices (Members A, B, C, D)
│       │   ├── donor-registration/
│       │   ├── blood-request/
│       │   ├── donor-browse/
│       │   └── requests/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Home landing page
│       └── styles/       # Design system & responsive styles
│
├── backend/              # Root for Render/Railway deployment
│   ├── package.json
│   ├── .env
│   └── src/
│       ├── server.js     # Express server
│       ├── config/       # MongoDB connection
│       ├── models/       # Mongoose Donor & Request schemas
│       ├── features/     # Backend route controllers per vertical slice
│       └── seed/         # Demo data seed script
│
├── README.md             # Project documentation
├── AI_PROMPT_LOG.md      # AI tool prompt log
└── .gitignore
```

---

## 11. Team Members & Contributions

### Member A: Donor Registration (Full-Stack Vertical Slice)
* **Frontend:** Built `DonorRegistration.jsx`, form state, inline validations, error states.
* **Backend:** Implemented `POST /api/donors` endpoint, Sri Lankan phone regex validation, and `Donor.js` Mongoose schema.

### Member B: Blood Request (Full-Stack Vertical Slice)
* **Frontend:** Built `BloodRequest.jsx`, request form validation, urgency selectors, success state.
* **Backend:** Implemented `POST /api/requests` endpoint and `Request.js` Mongoose schema.

### Member C: Browse Donors & Eligibility (Full-Stack Vertical Slice)
* **Frontend:** Built `DonorBrowse.jsx`, `EligibilityBadge.jsx` with 4-month rule logic & medical disclaimers.
* **Backend:** Implemented `GET /api/donors` with blood type and district query filtering.

### Member D: Active Requests & Landing/UI Shell (Full-Stack Vertical Slice)
* **Frontend:** Built `Home.jsx` landing page, `ActiveRequests.jsx`, `Navbar.jsx`, responsive CSS system, Critical Need Districts banner.
* **Backend:** Implemented `GET /api/requests` with custom urgency priority sorting (`Critical` > `Urgent` > `Normal`).

---

## 12. AI Tools Used

* **Gemini 3.6 Flash:** Form validation boilerplate, regex generation, responsive layout helpers.
* **ChatGPT (GPT-4):** Mongoose schema validation guidelines.
* **Claude 3.5 Sonnet:** Date math calculations for donor eligibility.

---

## 13. AI Prompt Log

Refer to [AI_PROMPT_LOG.md](./AI_PROMPT_LOG.md) for full prompt records, verification checks, and security audits.

---

## 14. Backend Setup

### Navigate to backend/
```bash
cd backend
```

### Install dependencies
```bash
npm install
```

### Environment variables
Create a `.env` file in `backend/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lifedrop
NODE_ENV=development
```

### Run development server
```bash
npm run dev
```

### Seed database
```bash
npm run seed
```

---

## 15. Frontend Setup

### Navigate to frontend/
```bash
cd frontend
```

### Install dependencies
```bash
npm install
```

### Environment variables
Create a `.env` file in `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Run development server
```bash
npm run dev
```

---

## 16. API Endpoints

| Method | Endpoint | Description | Query Params |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Health check endpoint | N/A |
| **POST** | `/api/donors` | Register a new donor | N/A |
| **GET** | `/api/donors` | Get donors with filters | `bloodType`, `district` |
| **POST** | `/api/requests` | Post a blood request | N/A |
| **GET** | `/api/requests` | Get active requests (sorted by urgency) | N/A |

---

## 17. Deployment

### Frontend (Vercel / Netlify)
* **Root Directory:** `frontend/`
* **Build Command:** `npm run build`
* **Output Directory:** `dist`
* **Environment Variable:** `VITE_API_BASE_URL=https://lifedrop-backend.onrender.com/api`

### Backend (Render / Railway)
* **Root Directory:** `backend/`
* **Start Command:** `npm start`
* **Environment Variable:** `MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/lifedrop`

### Database (MongoDB Atlas)
* Provision a free MongoDB Atlas cluster and set Network Access to `0.0.0.0/0`.

---

## 18. Live Application

* **Deployed Web URL:** `https://lifedrop-demo.vercel.app` *(Replace with your Vercel deployment link)*
* **Deployed Backend API:** `https://lifedrop-api.onrender.com/api/health`

---

## 19. Demo Video

* **Loom / YouTube Link:** `https://youtube.com/watch?v=lifedrop-demo` *(Replace with your 2-minute video link)*

---

## 20. Testing Checklist

- [x] Donor registration prevents future donation dates
- [x] Donor registration validates Sri Lankan phone formats (077/071/+94)
- [x] Form submission displays inline errors without window.alert
- [x] Form submit buttons are disabled when state is invalid
- [x] Eligibility badge accurately identifies < 4 months as ineligible and ≥ 4 months as eligible
- [x] Medical disclaimer is visible on all eligibility badges
- [x] Active requests display in correct priority order (Critical > Urgent > Normal)
- [x] District filter surfaces Jaffna and Kilinochchi donors accurately
- [x] Responsive layout works seamlessly on mobile devices

---

## 21. Scope & Limitations

* **No User Authentication:** Out of scope for 4-hour hackathon.
* **No Real-Time SMS/Push Notifications:** Direct phone dialing links provided instead.
* **Indicative Eligibility Only:** No medical record integration; final verification by NBTS medical staff.

---

## 22. Future Improvements

* Integration with National Blood Transfusion Service (NBTS) official database.
* Automated SMS alerts for Critical urgency requests within a 15km radius.
* Donor reward badges and blood donation history tracking.
