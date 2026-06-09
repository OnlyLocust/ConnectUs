# ConnectUs - Social Media Platform (Resume Features)

*This document outlines the key features and technical accomplishments of the ConnectUs social media platform. You can copy and adapt these bullet points for your resume or portfolio.*

## 🚀 Key Achievements & Technical Highlights

*   **Modern UI/UX Architecture:** Designed and implemented a "Neo Glass + Modern Developer" aesthetic using **Tailwind CSS**, **Framer Motion**, and **Shadcn UI**. Developed a fully responsive, component-driven frontend architecture with dynamic layout restructuring for mobile and desktop environments.
*   **Real-Time Communication Engine:** Architected a robust 1:1 real-time chat and notification system using **Socket.io**. Implemented targeted room IDs for instant message delivery and built custom event listeners to ensure seamless live sync without page refreshes.
*   **Optimized Data Structures:** Engineered an efficient unread message tracking system utilizing a `Map<userId, number>` within the chat schema, significantly reducing MongoDB database queries and improving performance for active users.
*   **Advanced State Management:** Integrated **Redux Toolkit** with `redux-persist` for scalable global state management. Ensured persistent authentication and user data across browser reloads, providing a frictionless user experience.
*   **Secure Authentication Flow:** Developed a robust, secure authentication pipeline using **JSON Web Tokens (JWT)** and **bcryptjs** for password hashing.
*   **Cloud Media Integration:** Integrated **Cloudinary** for scalable, fast-delivery cloud storage and management of user-uploaded images and avatars.
*   **Dynamic Theming:** Built a custom Dark/Light mode engine leveraging `next-themes` and Tailwind CSS variables, ensuring consistent accessibility and aesthetic appeal across the platform.

## 🛠 Feature Breakdown by Module

### 1. Authentication & Security
*   **JWT-based Auth:** Secure Login and Registration system with encrypted password storage.
*   **Persistent Sessions:** Redux state persistence ensures users stay logged in upon refresh.
*   **Secure Routing:** Next.js middleware and client-side protection to guard private routes.

### 2. Social Interactions & Feed
*   **Dynamic Post System:** Users can create, edit, and delete posts featuring rich text and media.
*   **Real-time Engagement:** Live heart/like reactions and nested commenting system on `PostCard` components.
*   **Explore & Search:** Built robust search capabilities (`Search.jsx`) and a discovery feed (`Explore.jsx`) to find new content and users.
*   **Follower Mechanics:** Comprehensive user connection system (`Follows.jsx`) to follow/unfollow and build a personalized feed.

### 3. Real-Time Chat & Notifications
*   **Instant Messaging:** Built a fully featured chat interface (`Chats.jsx`) with scroll-to-bottom logic, emoji integration, and real-time read receipts.
*   **Live Event Broadcasting:** Used Socket.io to push real-time alerts for likes, comments, and new followers instantly to the user's screen.
*   **Toast Notifications:** Integrated `sonner` for non-intrusive, aesthetically pleasing UI feedback on user actions.

### 4. User Profiles
*   **Profile Customization:** Users can update their bio, avatar, and details via a sleek `EditProfile.jsx` interface.
*   **Media Gallery:** Profile pages dynamically fetch and display all visual content associated with a user.

## 💻 Tech Stack Summary
*   **Frontend:** Next.js 15, React 19, Tailwind CSS v4, Shadcn UI, Framer Motion
*   **Backend & DB:** Node.js, Express.js (custom server routing), MongoDB, Mongoose
*   **State & Real-time:** Redux Toolkit, Socket.io, React Scroll to Bottom
*   **Tools & Cloud:** Cloudinary (Storage), Sonner (Toasts), Axios, JWT

---
**💡 Tip for Resume:** *Pick 3-4 bullet points from the "Key Achievements" section and tailor them to the specific job you are applying for. Use strong action verbs like "Architected", "Engineered", and "Optimized" to stand out.*
