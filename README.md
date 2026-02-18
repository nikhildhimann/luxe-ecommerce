# E-commerce Project

This is a full-stack E-commerce application built with a React frontend and a Node.js/Express backend. It includes features like product browsing, user authentication, shopping cart, and order management.

## Features
- **Frontend**: Built with React and TailwindCSS.
- **Backend**: Node.js with Express and MongoDB.
- **Authentication**: JWT-based authentication.
- **Deployment**: Ready for deployment on platforms like Vercel and Render.

## Prerequisites
- Node.js (v16 or higher)
- MongoDB database

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd E-commerce
   ```

3. Install dependencies for both client and server:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

4. Create environment variable files:
   - Copy `.env.example` to `.env` in the `server` directory and fill in the required values.

## Running the Application

1. Start the backend server:
   ```bash
   cd server
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```

3. Open the application in your browser at `http://localhost:5173` (default Vite port).

## Deployment

### Render
1. Push your code to GitHub.
2. Create a new Web Service on Render.
3. Connect your GitHub repository.
4. Add environment variables from `.env` in the Render dashboard.
5. Deploy.

### Vercel
1. Push your code to GitHub.
2. Import your GitHub repository into Vercel.
3. Add environment variables from `.env` in the Vercel dashboard.
4. Deploy.

## Folder Structure
```
E-commerce/
├── client/       # Frontend code
├── server/       # Backend code
└── README.md     # Project documentation
```

## License
This project is licensed under the MIT License.