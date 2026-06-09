# 🌐 Social Media App

A full-stack real-time social media platform where users can post, like, comment, chat, and receive instant notifications.  
Built using **Next.js**, **Tailwind CSS**, **Redux**, **MongoDB**, and **Socket.io** — this app delivers a smooth and modern social experience with real-time features and clean UI.

🚀 [Live Demo](https://connectus-ul0i.onrender.com/)



---


## 🧠 My Approach & Engineering Highlights

🛠️ **This isn't just a clone — it's an engineered product.** Here's how I made it special:

- 📊 **Unread Messages Tracking**  
  Used a smart `Map<userId, number>` in chat schema to manage unread message counts **without extra queries**.

- 🔄 **Live Sync with Socket.io**  
  Built custom event listeners for chat, notifications, and online users to maintain seamless real-time interaction.

- 🧩 **Modular, Scalable Architecture**  
  Organized files into atomic folders — `components`, `sockets`, `api`, `models`, and `store`. Easy to expand.

- 🔁 **Redux Slice Persistence**  
  Auth slice persists on refresh, no need to re-login. Auth status and user data remain intact even on reloads.

- 📬 **Instant Message Delivery Logic**  
  Used Socket events with targeted room IDs for **super fast** chat delivery and `notRead` increment handling.

- 🔐 **Secure and Clean Auth Flow**  
  Login/register pages with JWT + secure password hashing using bcrypt. No leaking user data.

- 📸 **Cloudinary for Image Uploads**  
  Post images are stored in the cloud, fast delivery, and clean management.

---

## ✨ Features

🔥 Your app includes **everything a modern social media platform needs**:

- 🔐 **JWT Authentication** — Secure login/signup system.
- 📝 **Post System** — Create, edit, delete posts with captions and images.
- ❤️ **Reactions** — Like and comment on posts in real-time.
- 💬 **1:1 Real-Time Chat** — Send and receive messages instantly.
- 🔔 **Live Notifications** — See likes, comments, and messages the moment they happen.
- 📦 **Global State via Redux** — Efficient data management with slices and middleware.
- ⚡ **Instant Sync with Socket.io** — Real-time updates without refreshing.
- 🧪 **Error Handling + Toast Alerts** — Get immediate feedback on actions.
- 🎨 **Tailwind + ShadCN UI** — Modern, clean, and accessible UI components.

---

## 🛠️ Tech Stack

| 🧩 Category     | 🚀 Tech Used                               |
|----------------|--------------------------------------------|
| **Frontend**   | Next.js, Tailwind CSS, ShadCN UI           |
| **Backend**    | Node.js, Express.js                        |
| **Database**   | MongoDB, Mongoose                          |
| **Real-Time**  | Socket.io                                  |
| **State Mgmt** | Redux Toolkit                              |
| **Media**      | Cloudinary (for post image upload)         |
| **UX Tools**   | Sonner / Toast (for alerts & messages)     |
| **Auth**       | JWT-based Authentication                   |

---
