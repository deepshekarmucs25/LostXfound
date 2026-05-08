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

## Prisma Migration

```bash
npx prisma migrate dev
```

## Generate Prisma Client

```bash
npx prisma generate
```

---

# 📸 Screenshots

Add screenshots of:

* Home Page
* Lost Item Listing
* Found Item Listing
* Dashboard
* Authentication Pages

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
