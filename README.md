# Placemark-Svelte 📍

Placemark-Svelte is a modern full-stack application designed for managing and discovering favorite locations (Placemarks). The ecosystem consists of a sleek SvelteKit frontend and a robust Hapi.js backend (**PlacemarkCORE**), offering a seamless experience for tracking travels, exploring weather data, and visualizing locations.

### 🚀 Live Deployments
* **Placemark-Svelte (Frontend):** Hosted on **Netlify** 👉 [https://enricohu.netlify.app/](https://enricohu.netlify.app/)
* **PlacemarkCORE (Backend & Admin):** Hosted on **Render** 👉 [https://placemarkcore-hm5j.onrender.com/](https://placemarkcore-hm5j.onrender.com/)

---

## 🌟 Features

* **Interactive Maps**: Visualize your placemarks using Leaflet integration.
* **Weather Integration**: Real-time weather data and visual charts for your saved locations.
* **Photo Gallery**: Upload and manage images for each placemark via Cloudinary.
* **User Authentication**: Secure JWT-based authentication including GitHub OAuth support.
* **Admin Dashboard**: A dedicated management interface built into PlacemarkCORE for oversight.
* **Responsive Design**: A modern, mobile-friendly UI featuring **Easy UI** components and a native Dark Mode toggle.
* **Advanced Filtering**: Filter through your collection of locations with ease.
* **Multi-Store Backend**: Support for MongoDB, JSON-based storage, and in-memory testing stores.

## 🛠️ Tech Stack

### Frontend (Placemark-Svelte)
* **Framework**: [Svelte 5](https://svelte.dev/) (utilizing Runes)
* **Meta-Framework**: [SvelteKit](https://kit.svelte.dev/)
* **Styling**: CSS3 & **Easy UI**
* **State Management**: Svelte Runes
* **HTTP Client**: Axios
* **Mapping**: Leaflet

### Backend (PlacemarkCORE API)
* **Runtime**: Node.js
* **Framework**: Hapi.js
* **Templating**: **Handlebars** (for the Admin Dashboard and server-side views)
* **Database**: MongoDB (via Mongoose) / LowDB (JSON)
* **Authentication**: JWT (JSON Web Tokens) & OAuth
* **Validation**: Joi
* **Documentation**: Hapi-Swagger

## 📂 Project Structure

* [Placemark-Svelte](https://github.com/enrixx/Placemark-Svelte): The SvelteKit frontend application.
* [PlacemarkCORE](https://github.com/enrixx/PlacemarkCORE): The Hapi.js REST API, database models, and Handlebars-based admin panel.

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* MongoDB instance (local or Atlas)
* Cloudinary Account (for image uploads)

### Installation

1.  **Setup the Backend:**
    ```bash
    git clone https://github.com/enrixx/PlacemarkCORE.git
    cd PlacemarkCORE
    npm install
    # Create a .env file based on .env.example
    npm run start
    ```

2.  **Setup the Frontend:**
    ```bash
    git clone https://github.com/enrixx/Placemark-Svelte.git
    cd Placemark-Svelte
    npm install
    # Create a .env file based on .env.example
    npm run dev
    ```

3.  **Access the app:**
    Open your browser and navigate to `http://localhost:5173`

## ⚙️ Configuration

Ensure you have the environment variables set in your respective `.env` files (including Mongo URI, Cloudinary credentials, and JWT secrets).
Check the .env.example file for reference.

## 🧪 Testing

The backend includes a comprehensive test suite using Mocha and Chai:

```bash
# From the PlacemarkCORE directory and dont forget to run the server with npm start run
npm run test
