import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Listings from './pages/Listings'
import ListingDetail from './pages/ListingDetail'

// Create MUI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6B7280',
    },
    secondary: {
      main: '#4B5563',
    },
  },
})

function App() {
  const downtownLoftImage = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="relative min-h-screen">
        {/* Global Background Image - Translucent */}
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${downtownLoftImage})`,
            opacity: 0.35,
          }}
        />
        {/* Global Overlay to ensure content readability */}
        <div className="fixed inset-0 z-[1] bg-[#fafafa]/40" />
        <div className="relative z-[2] min-h-screen">
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
            </Routes>
          </Router>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App


