# LunaJoy - Mental Health Tracker

A full-stack application for tracking mental health metrics, built with NestJS, React, TypeScript, and PostgreSQL.

## 🚀 Features

- **User Authentication** - Secure login and registration
- **Mood Tracking** - Log and visualize your daily mood
- **Journaling** - Keep track of your thoughts and feelings
- **Data Visualization** - View your mental health trends over time
- **Responsive Design** - Works on desktop and mobile devices

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose
- **Development Tools**: pgAdmin, ESLint, Prettier

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone git@github.com:hernanrengel/lunajoy.git
   cd lunajoy
   ```

2. **Start the development environment**
   ```bash
   # Start all services
   docker compose up --build -d
   ```

3. **Access the applications**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - pgAdmin: http://localhost:5050
     - Email: admin@example.com
     - Password: admin123

### 🔒 Environment Configuration

1. **Backend Environment Variables**
   - Copy the example environment file:
     ```bash
     cp backend/.env.example backend/.env
     ```
   - Update the values in `.env` with your actual configuration:
     - `JWT_SECRET`: A secure random string for JWT token signing
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
     - Other variables as needed

2. **Frontend Environment**
   - Create a `.env` file in the frontend directory if needed
   - Common frontend environment variables might include:
     ```
     VITE_API_URL=http://localhost:3000
     VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
     ```

### Database Access

- **Host**: db
- **Port**: 5432
- **Database**: mental_tracker
- **Username**: admin
- **Password**: admin123

## 🏗 Project Structure

```
lunajoy/
├── backend/           # NestJS backend application
├── frontend/          # React frontend application
└── docker-compose.yml # Docker Compose configuration
```

## 🛠 Development

### Running Services Individually

#### Backend
```bash
cd backend
npm install
npm run start:dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Database Migrations

To apply database migrations:

```bash
cd backend
npx prisma migrate dev
```

## 🔧 Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
DATABASE_URL="postgresql://admin:admin123@db:5432/mental_tracker?schema=public"
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
```
