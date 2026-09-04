# 🩸 LifeDrop — GitHub Push Guide (Per Member)

> Each member pushes **only their own files** from the merged full project.
> The full project is already built and merged locally — this guide tells each member **exactly what to add, commit, and push**.

---

## ⚙️ One-Time Setup (Everyone Does This First)

```bash
# 1. Create the repo on GitHub (one person does this)
#    → Go to https://github.com/new
#    → Repo name: LifeDrop
#    → Keep it empty (no README, no .gitignore)

# 2. Every member clones the repo
git clone https://github.com/YOUR_USERNAME/LifeDrop.git
cd LifeDrop
```

> ⚠️ **Copy the full merged project folder into this cloned repo folder** so all files are present locally for everyone.

---

## 📅 Push Order (Follow This Sequence)

| Order | Who          | Push Day      | What They Push                                           |
| :---: | :----------- | :------------ | :------------------------------------------------------- |
| 1st   | **Member D** | **Monday**    | Shared foundation: config, models, server, UI shell, landing page, styles |
| 2nd   | **Member A** | **Tuesday**   | Donor Registration (frontend + backend)                  |
| 3rd   | **Member B** | **Wednesday** | Blood Request (frontend + backend)                       |
| 4th   | **Member C** | **Thursday**  | Browse Donors & Eligibility (frontend + backend)         |

> **Member D goes first** because they own the shared foundation files (server, database config, models, navbar, landing page, styles) that all other features depend on.

---

---

## 👤 MEMBER D — Shared Foundation + Active Requests + Landing Page

### Your Files (What You Push)

```
📁 Root Files
├── .gitignore
├── README.md
├── AI_PROMPT_LOG.md

📁 Backend (Foundation + Active Requests)
├── backend/package.json
├── backend/package-lock.json
├── backend/.env.example                          ⚠️ NOT .env (never push secrets)
├── backend/src/server.js                         ← Express server setup
├── backend/src/config/db.js                      ← MongoDB connection
├── backend/src/models/Donor.js                   ← Donor schema
├── backend/src/models/Request.js                 ← Request schema
├── backend/src/models/User.js                    ← User schema
├── backend/src/models/Notification.js            ← Notification schema
├── backend/src/middleware/authMiddleware.js       ← Auth middleware
├── backend/src/controllers/authController.js     ← Auth controller
├── backend/src/controllers/notificationController.js
├── backend/src/controllers/profileController.js
├── backend/src/controllers/requestController.js
├── backend/src/routes/authRoutes.js
├── backend/src/routes/notificationRoutes.js
├── backend/src/routes/profileRoutes.js
├── backend/src/routes/requestRoutes.js
├── backend/src/services/alertService.js
├── backend/src/utils/socket.js
├── backend/src/seed/seed.js                      ← Demo data seed
├── backend/src/features/requests/activeRequestRoutes.js  ← YOUR feature route

📁 Frontend (Foundation + Landing + UI Shell)
├── frontend/package.json
├── frontend/package-lock.json
├── frontend/index.html
├── frontend/vite.config.js
├── frontend/src/main.jsx                         ← App entry point
├── frontend/src/app/App.jsx                      ← App shell
├── frontend/src/app/api.js                       ← API helper
├── frontend/src/app/routes.jsx                   ← Router config
├── frontend/src/context/AuthContext.jsx
├── frontend/src/context/NotificationContext.jsx
├── frontend/src/styles/global.css                ← Global design system
├── frontend/src/styles/responsive.css            ← Responsive breakpoints
├── frontend/src/components/Navbar.jsx             ← Navigation bar
├── frontend/src/components/Navbar.css
├── frontend/src/components/Button.jsx             ← Shared button
├── frontend/src/components/Button.css
├── frontend/src/components/FormField.jsx          ← Shared form field
├── frontend/src/components/FormField.css
├── frontend/src/components/DonorCard.jsx          ← Shared donor card
├── frontend/src/components/DonorCard.css
├── frontend/src/components/RequestCard.jsx        ← Shared request card
├── frontend/src/components/RequestCard.css
├── frontend/src/components/ToastAlert.jsx         ← Toast notifications
├── frontend/src/components/ToastAlert.css
├── frontend/src/components/NotificationBell.jsx
├── frontend/src/components/NotificationBell.css
├── frontend/src/pages/Home.jsx                    ← Landing page
├── frontend/src/pages/Home.css
├── frontend/src/pages/Login.jsx
├── frontend/src/pages/Register.jsx
├── frontend/src/pages/Auth.css
├── frontend/src/pages/Profile.jsx
├── frontend/src/pages/Profile.css
├── frontend/src/pages/CompleteProfile.jsx
├── frontend/src/features/requests/ActiveRequests.jsx    ← YOUR feature
├── frontend/src/features/requests/requests.css
```

### Git Commands (Member D — Push First)

```bash
# Step 1: Create your branch
git checkout -b feature/foundation-and-active-requests

# Step 2: Add ROOT files
git add .gitignore README.md AI_PROMPT_LOG.md

# Step 3: Add BACKEND foundation + your feature
git add backend/package.json backend/package-lock.json backend/.env.example
git add backend/src/server.js
git add backend/src/config/db.js
git add backend/src/models/Donor.js backend/src/models/Request.js backend/src/models/User.js backend/src/models/Notification.js
git add backend/src/middleware/authMiddleware.js
git add backend/src/controllers/authController.js backend/src/controllers/notificationController.js
git add backend/src/controllers/profileController.js backend/src/controllers/requestController.js
git add backend/src/routes/authRoutes.js backend/src/routes/notificationRoutes.js
git add backend/src/routes/profileRoutes.js backend/src/routes/requestRoutes.js
git add backend/src/services/alertService.js
git add backend/src/utils/socket.js
git add backend/src/seed/seed.js
git add backend/src/features/requests/activeRequestRoutes.js

# Step 4: Add FRONTEND foundation + your feature
git add frontend/package.json frontend/package-lock.json frontend/index.html frontend/vite.config.js
git add frontend/src/main.jsx
git add frontend/src/app/App.jsx frontend/src/app/api.js frontend/src/app/routes.jsx
git add frontend/src/context/AuthContext.jsx frontend/src/context/NotificationContext.jsx
git add frontend/src/styles/global.css frontend/src/styles/responsive.css
git add frontend/src/components/Navbar.jsx frontend/src/components/Navbar.css
git add frontend/src/components/Button.jsx frontend/src/components/Button.css
git add frontend/src/components/FormField.jsx frontend/src/components/FormField.css
git add frontend/src/components/DonorCard.jsx frontend/src/components/DonorCard.css
git add frontend/src/components/RequestCard.jsx frontend/src/components/RequestCard.css
git add frontend/src/components/ToastAlert.jsx frontend/src/components/ToastAlert.css
git add frontend/src/components/NotificationBell.jsx frontend/src/components/NotificationBell.css
git add frontend/src/pages/Home.jsx frontend/src/pages/Home.css
git add frontend/src/pages/Login.jsx frontend/src/pages/Register.jsx frontend/src/pages/Auth.css
git add frontend/src/pages/Profile.jsx frontend/src/pages/Profile.css frontend/src/pages/CompleteProfile.jsx
git add frontend/src/features/requests/ActiveRequests.jsx frontend/src/features/requests/requests.css

# Step 5: Commit
git commit -m "feat(foundation): add server, models, UI shell, landing page, active requests feature - Member D"

# Step 6: Push
git push -u origin feature/foundation-and-active-requests

# Step 7: Go to GitHub → Create Pull Request → Merge to main
# Step 8: Notify team: "✅ Foundation merged! Everyone pull main before your push."
```

---

---

## 👤 MEMBER A — Donor Registration (Full-Stack)

### Your Files (What You Push)

```
📁 Frontend
├── frontend/src/features/donor-registration/DonorRegistration.jsx   ← Registration form
├── frontend/src/features/donor-registration/donorRegistration.css   ← Form styles
├── frontend/src/features/donor-registration/validation.js           ← Phone & date validation

📁 Backend
├── backend/src/features/donor-registration/donorRoutes.js           ← POST /api/donors route
```

### Git Commands (Member A — Push Second)

```bash
# Step 1: Pull the latest main (Member D's foundation must be merged first!)
git checkout main
git pull origin main

# Step 2: Create your branch
git checkout -b feature/donor-registration

# Step 3: Add ONLY your files
git add frontend/src/features/donor-registration/DonorRegistration.jsx
git add frontend/src/features/donor-registration/donorRegistration.css
git add frontend/src/features/donor-registration/validation.js
git add backend/src/features/donor-registration/donorRoutes.js

# Step 4: Commit
git commit -m "feat(donor-registration): add donor registration form, validation, and API route - Member A"

# Step 5: Push
git push -u origin feature/donor-registration

# Step 6: Go to GitHub → Create Pull Request → Merge to main
# Step 7: Notify team: "✅ Donor Registration merged!"
```

---

---

## 👤 MEMBER B — Blood Request (Full-Stack)

### Your Files (What You Push)

```
📁 Frontend
├── frontend/src/features/blood-request/BloodRequest.jsx    ← Request form
├── frontend/src/features/blood-request/bloodRequest.css    ← Form styles
├── frontend/src/features/blood-request/validation.js       ← Request validation

📁 Backend
├── backend/src/features/blood-request/requestRoutes.js     ← POST /api/requests route
```

### Git Commands (Member B — Push Third)

```bash
# Step 1: Pull the latest main (Member D + A must be merged first!)
git checkout main
git pull origin main

# Step 2: Create your branch
git checkout -b feature/blood-request

# Step 3: Add ONLY your files
git add frontend/src/features/blood-request/BloodRequest.jsx
git add frontend/src/features/blood-request/bloodRequest.css
git add frontend/src/features/blood-request/validation.js
git add backend/src/features/blood-request/requestRoutes.js

# Step 4: Commit
git commit -m "feat(blood-request): add blood request form, validation, and API route - Member B"

# Step 5: Push
git push -u origin feature/blood-request

# Step 6: Go to GitHub → Create Pull Request → Merge to main
# Step 7: Notify team: "✅ Blood Request merged!"
```

---

---

## 👤 MEMBER C — Browse Donors & Eligibility (Full-Stack)

### Your Files (What You Push)

```
📁 Frontend
├── frontend/src/features/donor-browse/DonorBrowse.jsx       ← Browse/filter donors
├── frontend/src/features/donor-browse/EligibilityBadge.jsx   ← 4-month eligibility badge
├── frontend/src/features/donor-browse/donorBrowse.css        ← Browse page styles

📁 Backend
├── backend/src/features/donor-browse/donorBrowseRoutes.js    ← GET /api/donors with filters
```

### Git Commands (Member C — Push Last)

```bash
# Step 1: Pull the latest main (Member D + A + B must be merged first!)
git checkout main
git pull origin main

# Step 2: Create your branch
git checkout -b feature/donor-browse

# Step 3: Add ONLY your files
git add frontend/src/features/donor-browse/DonorBrowse.jsx
git add frontend/src/features/donor-browse/EligibilityBadge.jsx
git add frontend/src/features/donor-browse/donorBrowse.css
git add backend/src/features/donor-browse/donorBrowseRoutes.js

# Step 4: Commit
git commit -m "feat(donor-browse): add donor browse, eligibility badge, and filter API - Member C"

# Step 5: Push
git push -u origin feature/donor-browse

# Step 6: Go to GitHub → Create Pull Request → Merge to main
# Step 7: Notify team: "✅ Donor Browse merged! All features are now in main 🎉"
```

---

---

## 📊 Complete File Ownership Summary

| File Path | Owner |
| :--- | :---: |
| `.gitignore` | D |
| `README.md` | D |
| `AI_PROMPT_LOG.md` | D |
| `backend/package.json` | D |
| `backend/package-lock.json` | D |
| `backend/.env.example` | D |
| `backend/src/server.js` | D |
| `backend/src/config/db.js` | D |
| `backend/src/models/Donor.js` | D |
| `backend/src/models/Request.js` | D |
| `backend/src/models/User.js` | D |
| `backend/src/models/Notification.js` | D |
| `backend/src/middleware/authMiddleware.js` | D |
| `backend/src/controllers/authController.js` | D |
| `backend/src/controllers/notificationController.js` | D |
| `backend/src/controllers/profileController.js` | D |
| `backend/src/controllers/requestController.js` | D |
| `backend/src/routes/authRoutes.js` | D |
| `backend/src/routes/notificationRoutes.js` | D |
| `backend/src/routes/profileRoutes.js` | D |
| `backend/src/routes/requestRoutes.js` | D |
| `backend/src/services/alertService.js` | D |
| `backend/src/utils/socket.js` | D |
| `backend/src/seed/seed.js` | D |
| `backend/src/features/requests/activeRequestRoutes.js` | D |
| `backend/src/features/donor-registration/donorRoutes.js` | **A** |
| `backend/src/features/blood-request/requestRoutes.js` | **B** |
| `backend/src/features/donor-browse/donorBrowseRoutes.js` | **C** |
| `frontend/package.json` | D |
| `frontend/package-lock.json` | D |
| `frontend/index.html` | D |
| `frontend/vite.config.js` | D |
| `frontend/src/main.jsx` | D |
| `frontend/src/app/App.jsx` | D |
| `frontend/src/app/api.js` | D |
| `frontend/src/app/routes.jsx` | D |
| `frontend/src/context/AuthContext.jsx` | D |
| `frontend/src/context/NotificationContext.jsx` | D |
| `frontend/src/styles/global.css` | D |
| `frontend/src/styles/responsive.css` | D |
| `frontend/src/components/Navbar.jsx` | D |
| `frontend/src/components/Navbar.css` | D |
| `frontend/src/components/Button.jsx` | D |
| `frontend/src/components/Button.css` | D |
| `frontend/src/components/FormField.jsx` | D |
| `frontend/src/components/FormField.css` | D |
| `frontend/src/components/DonorCard.jsx` | D |
| `frontend/src/components/DonorCard.css` | D |
| `frontend/src/components/RequestCard.jsx` | D |
| `frontend/src/components/RequestCard.css` | D |
| `frontend/src/components/ToastAlert.jsx` | D |
| `frontend/src/components/ToastAlert.css` | D |
| `frontend/src/components/NotificationBell.jsx` | D |
| `frontend/src/components/NotificationBell.css` | D |
| `frontend/src/pages/Home.jsx` | D |
| `frontend/src/pages/Home.css` | D |
| `frontend/src/pages/Login.jsx` | D |
| `frontend/src/pages/Register.jsx` | D |
| `frontend/src/pages/Auth.css` | D |
| `frontend/src/pages/Profile.jsx` | D |
| `frontend/src/pages/Profile.css` | D |
| `frontend/src/pages/CompleteProfile.jsx` | D |
| `frontend/src/features/requests/ActiveRequests.jsx` | D |
| `frontend/src/features/requests/requests.css` | D |
| `frontend/src/features/donor-registration/DonorRegistration.jsx` | **A** |
| `frontend/src/features/donor-registration/donorRegistration.css` | **A** |
| `frontend/src/features/donor-registration/validation.js` | **A** |
| `frontend/src/features/blood-request/BloodRequest.jsx` | **B** |
| `frontend/src/features/blood-request/bloodRequest.css` | **B** |
| `frontend/src/features/blood-request/validation.js` | **B** |
| `frontend/src/features/donor-browse/DonorBrowse.jsx` | **C** |
| `frontend/src/features/donor-browse/EligibilityBadge.jsx` | **C** |
| `frontend/src/features/donor-browse/donorBrowse.css` | **C** |

---

## ⚠️ Important Rules

1. **Never push `.env` files** — only push `.env.example` with placeholder values
2. **Never push `node_modules/`** — the `.gitignore` already handles this
3. **Always pull `main` before creating your branch** — `git pull origin main`
4. **Push in order: D → A → B → C** — Member D must go first since they own the foundation
5. **Each member pushes ONLY their listed files** — don't accidentally add someone else's files
6. **Use `git add <specific-file>` not `git add .`** — this prevents pushing files that aren't yours

---

## ✅ Final Verification

After all 4 members have pushed and merged, verify the full project works:

```bash
# Pull the final main
git checkout main
git pull origin main

# Test backend
cd backend
npm install
npm run dev

# Test frontend (new terminal)
cd frontend
npm install
npm run dev

# Open http://localhost:5173 and test all features:
# ✅ Landing page loads
# ✅ Donor registration form works
# ✅ Blood request form works
# ✅ Browse donors with filters works
# ✅ Active requests sorted by urgency works
```
