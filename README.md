🌱 Mini Task Tracker

A simple yet powerful Task Management App built with:

🖥 Next.js (Frontend) – beautiful UI & smooth experience

⚡ Node.js + Express (Backend) – RESTful API to manage tasks

🎯 Features – Create, edit, mark as done, delete, set priorities, and due dates

✨ Features

✅ Create tasks with title, description, priority, and due date
✅ Mark tasks as completed or active
✅ Delete tasks you no longer need
✅ Task counters (active vs completed)
✅ Human-friendly design – “🎉 You’re all caught up!” when all tasks are done
✅ Backend REST API (CRUD) with Express.js
✅ Easy to extend with a database (MongoDB, PostgreSQL, etc.)

🚀 Getting Started
1️⃣ Clone the Repository
```
git clone https://github.com/Anmol18125/Mini_task_tracker.git
cd Mini_task_tracker
```
2️⃣ Install Dependencies
For Frontend (Next.js)
```
npm install
```
For Backend (Express)
```
cd backend
npm install
```
3️⃣ Run the App

Start Backend (Node.js)
```
cd backend
npx nodemon server.js
```

Backend runs on 👉 http://localhost:4000

Start Frontend (Next.js)
```
cd ..
npm run dev
```

Frontend runs on 👉 http://localhost:3000

📡 API Endpoints
Method	Endpoint	Description
GET	/tasks	Get all tasks
POST	/tasks	Create a new task
PATCH	/tasks/:id	Update a task
DELETE	/tasks/:id	Delete a task
🎨 Screenshots
<img width="1095" height="728" alt="image" src="https://github.com/user-attachments/assets/8c7927ca-305e-48be-9d7f-5e228fd7c26b" />
<img width="1110" height="484" alt="image" src="https://github.com/user-attachments/assets/78364e1d-0af1-4cd0-b000-5805a6499e5c" />

🛠 Future Improvements

🌍 Add database support (MongoDB or PostgreSQL)

🔐 Add authentication (login/register)

📱 Make it mobile-first with responsive UI

🤝 Contributing

Pull requests are welcome! If you’d like to contribute, fork the repo and create a new branch.

👨‍💻 Author

Built with ❤️ by Anmol
