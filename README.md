# VetoCar // AI-Powered Auto Contract Audit & Negotiation Assistant

VetoCar is an advanced, full-stack web application designed to protect car buyers and lessees from predatory dealership markups, hidden fees, and manipulated leasing worksheets. By combining modern AI document auditing with public vehicle database checks and real-time negotiation coaching, VetoCar levels the playing field between consumers and dealerships.

---

## 🚀 Key Features (Fully Implemented)

### 1. Secure Access Gateway (User Authentication)
*   **JWT Security:** Fully-gated backend routes (chat, uploads, VIN decoding) requiring valid JSON Web Tokens.
*   **Persistent Sessions:** Automated client-side token restoration, secure cookie-less JWT parsing, and localized state clearing upon logging out.

### 2. PDF Contract Auditing Engine
*   **Automated PDF Parser:** Direct stream parsing of uploaded dealership quote worksheets.
*   **Gemini AI Analyzer:** Direct parsing of complex lease/loan parameters including:
    *   Monthly Payments & Down Payments/Drive-offs.
    *   Money Factor / Lease APR validation.
    *   Residual Values, mileage caps, and disposition/early-termination fee structures.
*   **Fairness Deal Score:** A dynamic `0-100` fairness rating with customized textual feedback.
*   **Red Flags Detector:** Scans and isolates hidden add-ons (nitrogen, paint sealants, documentation fee markups).

### 3. Multiple Offer Comparison Dashboard
*   **Side-by-Side Matrix:** Select and stack two previously audited quotes.
*   **Cost Delta Analysis:** Computes and displays the exact total term cost differences.
*   **Winner Recommendation Engine:** Automatically recommends the optimal deal with clear, data-driven rationales.

### 4. Public NHTSA VIN Specification & Recall Lookup
*   **VPIC API Integration:** Decodes any vehicle's 17-digit VIN to extract exact engine, trim, transmission, and drivetrain specs.
*   **Recall Checker:** Live checks for active NHTSA safety recalls.

### 5. Interactive AI Negotiation Coach
*   **Personal Coach Chatbot:** Real-time conversational interface designed for auto negotiations.
*   **Dealership scripts:** Instantly drafts emails, text messages, or phone scripts targeting isolated markup terms.
*   **Fail-Safe Mode:** Seamless fallback rules in case of Gemini API rate limits (`HTTP 429`).

---

## 🛠️ System Architecture & Tech Stack

```
   ┌──────────────────────────────────────────────────────────┐
   │                  VetoCar Client (React)                  │
   └──────────────────────────┬───────────────────────────────┘
                              │ HTTPS / JWT
   ┌──────────────────────────▼───────────────────────────────┐
   │               VetoCar REST Server (Express)              │
   └──────┬───────────────────┬──────────────────────┬────────┘
          │                   │                      │
   ┌──────▼──────┐     ┌──────▼──────┐        ┌──────▼──────┐
   │   MongoDB   │     │  Gemini AI  │        │  NHTSA API  │
   │  (Database) │     │ (Analysis)  │        │ (VIN Specs) │
   └─────────────┘     └─────────────┘        └─────────────┘
```

*   **Frontend:** React (Vite), Lucide Icons, Modern HSL Monospace CSS, Responsive Viewports.
*   **Backend:** Node.js, Express, Multer (in-memory file buffers), JWT, BcryptJS.
*   **Database:** MongoDB (via Mongoose schemas).
*   **Core Services:** Gemini Pro (Google Generative AI SDK), NHTSA vPIC REST Services.

---

## ⚙️ Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   MongoDB Instance (Local or MongoDB Atlas Cluster URI)
*   Gemini API Key

### Backend Setup
1. Navigate to the `/backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `/backend` containing:
   ```env
   PORT=8080
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_signing_key
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Start the backend developer server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `/frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React developer server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173/`.

---

## 📈 System Workflow & Data Pipeline

1.  **Ingestion:** User uploads a dealership contract PDF.
2.  **Extraction:** Node.js extracts the raw text from the file buffer (in-memory, no local storage disk overhead).
3.  **Auditing:** Gemini processes the text using a strict JSON-schema prompt to parse values and isolate red flags.
4.  **Persistence:** The contract details and raw analysis are saved to MongoDB, securely linked to the logged-in user's profile.
5.  **Audit Render:** The user views the highlighted financial scores and can instantly load a side-by-side comparison with other deals or load the details into the Negotiation Coach.
