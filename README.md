# The Flex Living - Property Management Application

A modern property management application built with React, TypeScript, and integrated with Hostaway API. Features interactive dashboards, property listings, filtering, and real-time analytics.

## 🚀 Features

- **Interactive Dashboard**: Dual-ring donut charts for property performance analysis
- **Property Listings**: Browse and filter properties with advanced filtering options
- **Real-time Analytics**: Track property performance, revenue, and booking metrics
- **Hostaway API Integration**: Direct integration with Hostaway for property management
- **Advanced Filtering**: Filter by rating, category, channel, and time
- **Responsive Design**: Modern UI with smooth animations and transitions

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Hostaway API Credentials** - Client ID and Client Secret from your Hostaway account

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/NaveenPrasad2925/The_Flex.git
cd The_Flex
```

### 2. Navigate to Frontend Directory

```bash
cd frontend
```

### 3. Install Dependencies

```bash
npm install
```

## ⚙️ Environment Variables Setup

### Step 1: Create `.env` File

Create a `.env` file in the `frontend` directory:

```bash
# Windows
cd frontend
type nul > .env

# Mac/Linux
cd frontend
touch .env
```

### Step 2: Add Environment Variables

Open the `.env` file and add the following variables:

```env
# Required: Hostaway API Credentials
VITE_HOSTAWAY_CLIENT_ID=your_client_id_here
VITE_HOSTAWAY_CLIENT_SECRET=your_client_secret_here

# Optional: Hostaway API URLs (defaults provided)
VITE_HOSTAWAY_TOKEN_URL=https://api.hostaway.com/v1/accessTokens
VITE_HOSTAWAY_BASE_URL=https://api.hostaway.com/v1
```
## 🏃 Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at:
- **Local**: http://localhost:5173
- **Network**: Check the terminal for the network URL

### Build for Production

Create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## 📁 Project Structure

```
The_Flex/
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ui/           # UI components (charts, animations)
│   │   │   ├── ListingCard.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── PropertyDonutChart.tsx
│   │   │   └── SplitText.tsx
│   │   ├── pages/            # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Listings.tsx
│   │   │   └── ListingDetail.tsx
│   │   ├── services/          # API services
│   │   │   └── hostawayService.ts
│   │   ├── types/            # TypeScript types
│   │   │   └── hostaway.ts
│   │   ├── data/             # Mock data
│   │   │   └── propertyChartData.json
│   │   └── lib/              # Utilities
│   │       └── utils.ts
│   ├── public/               # Static assets
│   ├── .env                  # Environment variables (create this)
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🎯 Key Features Explained

### Dashboard
- **Property Performance Analysis**: Interactive donut charts showing property composition and health metrics
- **Click to Filter**: Click on any chart segment to navigate to filtered listings
- **Monthly Performance**: Bar charts showing revenue and booking trends

### Listings Page
- **Advanced Filtering**: Filter by rating, category (room type), channel (Airbnb, VRBO, etc.), and time
- **Sorting Options**: Sort by rating, price, or date
- **Pagination**: Navigate through large property lists

## 🔧 Troubleshooting

### Issue: "Hostaway API credentials not configured"

**Solution:**
1. Make sure `.env` file exists in the `frontend` directory
2. Verify variables start with `VITE_` prefix
3. Restart the development server after adding/changing `.env` file
4. Check for typos in variable names

### Issue: "Authentication failed (401)"

**Solution:**
1. Verify your Client ID and Client Secret are correct
2. Check that credentials are from the correct Hostaway account
3. Ensure no extra spaces or quotes around values in `.env` file

### Issue: "Network error" or "Cannot reach Hostaway API"

**Solution:**
1. Check your internet connection
2. Verify the API URLs in `.env` are correct
3. Check if Hostaway API is experiencing downtime

### Issue: Port already in use

**Solution:**
```bash
# Kill process on port 5173 (or your port)
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

## 📚 Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **MUI X Charts** - Data visualization
- **Framer Motion** - Animations
- **GSAP** - Advanced animations
- **React Router** - Routing
- **Axios** - HTTP client
- **Hostaway API** - Property management integration

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint


## 🔗 Links

- [Hostaway API Documentation](https://api.hostaway.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)



