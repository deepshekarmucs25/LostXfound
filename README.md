# Lost & Found Platform

A modern web-based Lost & Found platform that helps users report, search, and recover lost items easily. The platform allows users to post lost or found items, connect with item owners, and manage reports efficiently.

---

# 🚀 Features

## 👤 User Features

* User Authentication & Authorization
* Report Lost Items
* Report Found Items
* Search & Filter Items
* View Item Details
* Claim Lost Items
* Real-time Status Updates
* User Profile Management
* Responsive UI for Mobile & Desktop

## 🛠️ Admin Features

* Manage Users
* Moderate Item Posts
* Remove Spam or Fake Listings
* View Platform Analytics
* Manage Categories

---

# 🧑‍💻 Tech Stack

## Frontend

* Next.js
* React.js
* Tailwind CSS
* TypeScript

## Backend

* Node.js
* Express.js / Next.js API Routes

## Database

* PostgreSQL 

## Authentication

* Better Auth 

## Deployment

* Vercel

---

# 📂 Project Structure

```bash
lost-and-found/
│
├── public/             # Static files
├── src/
│   ├── app/            # Next.js app router
│   ├── components/     # Reusable UI components
│   ├── lib/            # Utility functions
│   ├── server/         # Backend logic
│   ├── styles/         # Global styles
│   └── types/          # Type definitions
│
├── drizzle/             # Database schema
├── .env                # Environment variables
├── package.json
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/lost-and-found.git
```

## 2️⃣ Navigate to the Project

```bash
cd lost-and-found
```

## 3️⃣ Install Dependencies

```bash
npm install
```

or

```bash
bun install
```

## 4️⃣ Setup Environment Variables

Create a `.env` file in the root directory and add:

```env
DATABASE_URL=your_database_url
BETTER_AUTH_SECRET=your_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

# ▶️ Running the Project

## Development Server

```bash
npm run dev
```

or

```bash
bun run dev
```

Open:

```bash
http://localhost:3000
```

---

# 🗄️ Database Setup

## Drizzle Migration

```bash
bunx drizzle migrate 
```

## Generate Prisma Client

```bash
bun drizzle generate
```

---

# 📸 Screenshots

Add screenshots of:

* Landing Page
  <img width="1348" height="630" alt="image" src="https://github.com/user-attachments/assets/f939621d-5e2e-4016-b5f5-dd24faee7431" />

* Home Page
  <img width="1350" height="630" alt="image" src="https://github.com/user-attachments/assets/06f0790f-cf7c-4616-8777-0d2d2a5b7c3d" />

* Lost Item Listing
  <img width="1365" height="632" alt="image" src="https://github.com/user-attachments/assets/231066ff-758b-4582-bd98-d340e993f1e1" />

* Found Item Listing
  <img width="1363" height="631" alt="image" src="https://github.com/user-attachments/assets/9bc93d8a-bb93-42dd-8647-41069a8d2c9f" />

* Authentication Pages

  <img width="1348" height="629" alt="image" src="https://github.com/user-attachments/assets/3644463f-ab19-46c9-9951-d4ae117b464d" />

  <img width="1352" height="630" alt="image" src="https://github.com/user-attachments/assets/b458c5fe-f2fc-43c3-941a-35dd789a325f" />


---

# 🔐 Authentication Flow

1. User registers/login
2. User creates a lost or found report
3. Users can contact/report ownership
4. Admin verifies and manages reports
5. Item gets marked as recovered

---

# 📌 Future Enhancements

* AI-based Item Matching
* Image Recognition
* Live Chat System
* Email Notifications
* Location-based Search
* Mobile Application
* QR Code Item Tracking

---

# 🤝 Contributing

Contributions are welcome.

## Steps:

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push the branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 🐛 Bug Reporting

If you find any bugs or issues, feel free to open an issue in the repository.

---



# 👨‍💻 Author

Developed by Deepshekar M U

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub.
