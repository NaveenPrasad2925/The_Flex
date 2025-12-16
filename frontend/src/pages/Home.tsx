import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import SplitText from '../components/SplitText'
import { HeroParallax } from '../components/ui/hero-parallax'

gsap.registerPlugin(ScrollTrigger)

const Home = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  const products = [
    {
      title: "Modern Downtown Loft",
      link: "/listings",
      thumbnail: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    },
    {
      title: "Luxury Beachfront Villa",
      link: "/listings",
      thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    },
    {
      title: "Cozy Mountain Cabin",
      link: "/listings",
      thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    },
    {
      title: "Urban Studio Apartment",
      link: "/listings",
      thumbnail: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    },
    {
      title: "Spacious Family Home",
      link: "/listings",
      thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    },
    {
      title: "Elegant Penthouse Suite",
      link: "/listings",
      thumbnail: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
    },
    {
      title: "Rustic Countryside House",
      link: "/listings",
      thumbnail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    },
    {
      title: "Contemporary City Apartment",
      link: "/listings",
      thumbnail: "https://images.unsplash.com/photo-1600585154084-4e5f7c23b893?w=800",
    },
    {
      title: "Charming Cottage",
      link: "/listings",
      thumbnail: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
    },
    {
      title: "Minimalist Modern Home",
      link: "/listings",
      thumbnail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    },
    {
      title: "Luxury Condo",
      link: "/listings",
      thumbnail: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800",
    },
    {
      title: "Stylish Townhouse",
      link: "/listings",
      thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    },
    {
      title: "Luxury Penthouse",
      link: "/listings",
      thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    },
    {
      title: "Modern Apartment",
      link: "/listings",
      thumbnail: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    },
    {
      title: "Beach House",
      link: "/listings",
      thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    },
    {
      title: "City Loft",
      link: "/listings",
      thumbnail: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    },
    {
      title: "Country Estate",
      link: "/listings",
      thumbnail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    },
    {
      title: "Urban Penthouse",
      link: "/listings",
      thumbnail: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
    },
    {
      title: "Seaside Villa",
      link: "/listings",
      thumbnail: "https://images.unsplash.com/photo-1600585154084-4e5f7c23b893?w=800",
    },
  ]

  useGSAP(
    () => {
      gsap.from('.hello-text', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
      })
    },
    { scope: containerRef }
  )

  // First row for background behind text
  const backgroundRow = products.slice(0, 4)

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden">
      {/* Background row behind text - positioned higher */}
      <div className="absolute top-20 left-0 right-0 z-0 flex items-start justify-center overflow-hidden">
        <motion.div 
          className="flex flex-row space-x-20"
          initial={{ x: -200 }}
          animate={{ 
            x: [0, 100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {backgroundRow.map((product, idx) => (
            <div
              key={`bg-${idx}`}
              className="h-64 w-[25rem] relative flex-shrink-0 opacity-30"
            >
              <div className="relative h-full w-full overflow-hidden rounded-l-2xl rounded-r-2xl border border-neutral-200/50 bg-neutral-100">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Text content - aligned to left */}
      <div className="relative z-10 flex flex-col items-start justify-center min-h-screen px-8 md:px-16 lg:px-24">
        <div className="text-left mb-8">
          <div className="hello-text">
            <SplitText className="text-6xl md:text-8xl font-bold text-gray-800 mb-4">
              Hello,
            </SplitText>
          </div>
          <SplitText
            className="text-5xl md:text-7xl font-bold text-gray-800"
            delay={0.5}
          >
            Welcome to Flex Living
          </SplitText>
        </div>
        <div className="max-w-4xl text-left mt-8">
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
            We are reimagining the idea of 'home' from something fixed to
            something flexible and simplifying the rental process for both
            landlords and tenants as we go.
          </p>
        </div>
      </div>

      {/* Scrollable parallax section */}
      <div className="relative">
        <HeroParallax products={products} />
      </div>

      {/* Mission Section - below the boxes, no extra scroll */}
      <div className="relative z-10 pt-8 pb-20 px-8 md:px-16 lg:px-24 bg-white/95 backdrop-blur-sm">
        <div className="max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Our Mission
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Driven by the prospect of an unbounded world, The Flex is on a mission to eliminate the constraints of traditional rental models. Our destination? A new realm where landlords no longer pay excessive management fees, and where renters can live flexibly and comfortably anywhere in the world.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home



