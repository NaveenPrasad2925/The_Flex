import PropertyDonutChart from '../components/PropertyDonutChart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { StickyScroll } from '../components/ui/sticky-scroll-reveal'
import SplitText from '../components/SplitText'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Dashboard = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from('.dashboard-title', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
      })
    },
    { scope: containerRef }
  )

  // Bar chart data - Property performance metrics
  const barChartData = [
    { name: 'Jan', revenue: 45000, bookings: 120 },
    { name: 'Feb', revenue: 52000, bookings: 145 },
    { name: 'Mar', revenue: 48000, bookings: 138 },
    { name: 'Apr', revenue: 61000, bookings: 165 },
    { name: 'May', revenue: 55000, bookings: 152 },
    { name: 'Jun', revenue: 67000, bookings: 180 },
  ]

  const COLORS = ['#1F4E4D', '#2D5F5D', '#3D7A78', '#4A8B88', '#5A9C99', '#6AADAA']

  // Sticky scroll content for dashboard features with charts
  const stickyContent = [
    {
      title: "Property Performance Analysis",
      description:
        "Maximize returns by pinpointing exactly where revenue is generated through this multi-layered donut chart. Use the View by Type tab to see how categories like Studios or Entire Homes contribute to total volume versus revenue share. Alternatively, the View by Status tab isolates listings by real-time health metrics, distinguishing high-performing assets from those needing attention. This dual-ring visualization provides the precise data needed to optimize pricing and address underperforming units across all managed properties.",
      content: (
        <div className="flex w-full h-full items-center justify-center bg-transparent overflow-visible">
          <div className="w-full flex items-center justify-center">
            <PropertyDonutChart />
          </div>
        </div>
      ),
    },
    {
      title: "Monthly Performance",
      description:
        "Monitor your revenue streams with detailed monthly and yearly breakdowns. Track booking patterns, identify peak seasons, and optimize pricing strategies. Visualize your financial performance with interactive charts and reports.",
      content: (
        <div className="flex h-full w-full items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg px-10 py-12 border-4 border-gray-200 shadow-xl">
          <div className="w-full h-full max-w-md flex items-center justify-center">
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#374151', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fill: '#374151', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#374151', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(8px)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar 
                  yAxisId="left"
                  dataKey="revenue" 
                  name="Revenue ($)"
                  fill="#1F4E4D"
                  radius={[8, 8, 0, 0]}
                >
                  {barChartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
                <Bar 
                  yAxisId="right"
                  dataKey="bookings" 
                  name="Bookings"
                  fill="#2D5F5D"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div ref={containerRef} className="min-h-screen">
      <div className="p-8 pb-0">
        <div className="dashboard-title flex items-center">
          <SplitText className="text-5xl font-bold mb-8 text-gray-800">
            Dashboard
          </SplitText>
        </div>
      </div>

      {/* Sticky Scroll Reveal Section with Charts */}
      <div className="w-full">
        <div className="w-full">
          <StickyScroll content={stickyContent} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

