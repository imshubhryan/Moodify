# 🎵 Moodify

Moodify is a full-stack web application that detects a user's facial expression and plays music based on their mood.

---

## 🚀 Features

* 😊 Real-time facial expression detection
* 🎯 Mood-based music recommendation (Happy, Sad, Surprised)
* 🎧 Random song selection based on mood
* 🔐 Authentication system (Register/Login)
* 🍪 Secure JWT-based authentication with cookies
* 📁 Song upload with metadata support

---

## 🧠 How It Works

1. User opens the app
2. Facial expression is detected using webcam
3. Emotion is classified (happy / sad / surprised)
4. Mood is sent to backend API
5. Backend fetches a random song based on mood
6. Song is played in the player

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Context API
* Axios

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Multer (file upload)
* bcrypt (password hashing)

### AI / Vision

* MediaPipe / Face Detection (for emotion recognition)

---

## 📂 Folder Structure (Simplified)

```
Frontend/
 ├── features/
 │   ├── auth/
 │   ├── home/
 │   │   ├── components/
 │   │   ├── hooks/
 │   │   ├── services/
 │   │   └── song.context.jsx
 │
Backend/
 ├── src/
 │   ├── controllers/
 │   ├── models/
 │   ├── routes/
 │   ├── middleware/
 │   └── config/
```

---

## 🔑 API Endpoints

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/auth/me`
* `POST /api/auth/logout`

### Songs

* `POST /api/songs` → upload song
* `GET /api/songs?mood=happy` → get random song

---

## ⚙️ Environment Variables

Create a `.env` file in backend:

```
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
NODE_ENV=development
```

---

## ▶️ Run Locally

### Backend

```
npm install
npm run dev
```

### Frontend

```
npm install
npm run dev
```

---

## 🧪 Future Improvements

* 🎼 Playlist generation
* 🤖 Better emotion detection accuracy
* 📊 User listening history
* ❤️ Like / Favorite songs
* ☁️ Cloud storage for songs

---

## 👨‍💻 Author

* Developed by **[Shubham Ryan]**

---

## ⭐️ Show Your Support

If you like this project, give it a ⭐ on GitHub!
