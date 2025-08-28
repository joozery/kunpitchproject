import React, { useState, useEffect } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { bannerApi } from '../lib/bannerApi'

// Custom CSS for react-slick
const customStyles = `
  .banner-slider {
    margin: 0 auto;
    padding: 0;
    max-width: 1200px;
    overflow: hidden;
  }
  
  .banner-slider .slick-slide {
    outline: none;
    margin: 0;
    padding: 0;
  }
  
  .banner-slider .slick-slide > div {
    height: 400px;
    margin: 0;
    padding: 0;
  }
  
  .banner-slider .slick-slide > div > div {
    height: 400px;
    margin: 0;
    padding: 0;
  }
  
  .banner-slider .slick-slide img {
    width: 100%;
    height: 400px;
    max-width: 100%;
    display: block;
    margin: 0;
    padding: 0;
    object-fit: cover;
    object-position: center;
    border-radius: 8px;
  }
  
  .banner-slider .slick-prev,
  .banner-slider .slick-next {
    z-index: 10;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.9) !important;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
  }
  
  .banner-slider .slick-prev:hover,
  .banner-slider .slick-next:hover {
    background: rgba(255, 255, 255, 1) !important;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    transform: scale(1.1);
  }
  
  .banner-slider .slick-prev {
    left: 16px;
  }
  
  .banner-slider .slick-next {
    right: 16px;
  }
  
  .banner-slider .slick-prev:before,
  .banner-slider .slick-next:before {
    color: #374151;
    font-size: 20px;
    font-weight: bold;
  }
  
  .banner-slider .slick-dots {
    bottom: 20px;
  }
  
  .banner-slider .slick-dots li button:before {
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    opacity: 0.6;
    transition: all 0.3s ease;
  }
  
  .banner-slider .slick-dots li.slick-active button:before {
    color: white;
    opacity: 1;
    transform: scale(1.2);
  }
  
  .banner-slider .slick-dots li button:hover:before {
    opacity: 1;
  }
  
  /* Desktop - Fixed size */
  @media (min-width: 768px) {
    .banner-slider {
      margin: 0 auto;
      max-width: 1200px;
    }
    .banner-slider .slick-slide > div {
      height: 400px;
    }
    .banner-slider .slick-slide > div > div {
      height: 400px;
    }
    .banner-slider .slick-slide img {
      width: 100%;
      height: 400px;
      max-width: 100%;
      object-fit: cover;
      object-position: center;
      border-radius: 8px;
    }
  }
  
  /* Tablet - Medium size */
  @media (min-width: 768px) and (max-width: 1023px) {
    .banner-slider {
      margin: 0 auto;
      max-width: 100%;
    }
    .banner-slider .slick-slide > div {
      height: 300px;
    }
    .banner-slider .slick-slide > div > div {
      height: 300px;
    }
    .banner-slider .slick-slide img {
      width: 100%;
      height: 300px;
      max-width: 100%;
      object-fit: cover;
      object-position: center;
      border-radius: 8px;
    }
  }
  
  /* Mobile - Responsive height */
  @media (max-width: 767px) {
    .banner-slider {
      margin: 0 auto;
      max-width: 100%;
    }
    .banner-slider .slick-slide > div {
      height: 250px;
    }
    .banner-slider .slick-slide > div > div {
      height: 250px;
    }
    .banner-slider .slick-slide img {
      width: 100%;
      height: 250px;
      max-width: 100%;
      object-fit: cover;
      object-position: center;
      border-radius: 8px;
    }
  }
    
    .banner-slider .slick-prev,
    .banner-slider .slick-next {
      width: 36px;
      height: 36px;
    }
    
    .banner-slider .slick-prev {
      left: 12px;
    }
    
    .banner-slider .slick-next {
      right: 12px;
    }
    
    .banner-slider .slick-dots {
      bottom: 16px;
    }
  }
`

const BannerSlide = () => {
  const [slides, setSlides] = useState([])
  const [settings, setSettings] = useState({
    auto_slide: true,
    slide_interval: 5000,
    slide_height: 300,
    show_navigation: true,
    show_dots: true
  })
  const [isLoading, setIsLoading] = useState(true)
  const [aspectRatio, setAspectRatio] = useState(1920 / 410)
  const [error, setError] = useState(null)

  // Inject custom CSS
  useEffect(() => {
    const styleElement = document.createElement('style')
    styleElement.textContent = customStyles
    document.head.appendChild(styleElement)
    
    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      console.log('🔄 Loading banner data...');
      const [slidesData, settingsData] = await Promise.all([
        bannerApi.getSlides(),
        bannerApi.getSettings()
      ])
      
      console.log('📊 Raw slides data:', slidesData);
      console.log('⚙️  Raw settings data:', settingsData);
      
      // Filter only active slides
      const activeSlides = slidesData.filter(slide => slide.is_active)
      console.log('🎯 Active slides:', activeSlides);
      
      setSlides(activeSlides)
      setSettings(settingsData)
    } catch (error) {
      console.error('❌ Error loading banner data:', error)
      console.log('🔄 Using fallback banner data due to API error');
      
      // Fallback data when API fails
      const fallbackSlides = [
        {
          id: 1,
          title: 'Welcome to Whale Space',
          alt_text: 'Welcome Banner',
          image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
          link: '/',
          is_active: true
        },
        {
          id: 2,
          title: 'Find Your Perfect Property',
          alt_text: 'Property Search Banner',
          image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
          link: '/properties',
          is_active: true
        },
        {
          id: 3,
          title: 'Premium Real Estate Solutions',
          alt_text: 'Premium Services Banner',
          image_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
          link: '/contact',
          is_active: true
        }
      ];
      
      const fallbackSettings = {
        auto_slide: true,
        slide_interval: 5000,
        slide_height: 300,
        show_navigation: true,
        show_dots: true
      };
      
      setSlides(fallbackSlides);
      setSettings(fallbackSettings);
      setError(null); // Clear error since we have fallback data
    } finally {
      setIsLoading(false)
    }
  }

  // Slick settings configuration
  const slickSettings = {
    dots: settings.show_dots,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: settings.auto_slide,
    autoplaySpeed: settings.slide_interval,
    pauseOnHover: true,
    arrows: settings.show_navigation,
    fade: true, // Smooth fade transition
    cssEase: 'ease-in-out',
    adaptiveHeight: false, // Fixed height for consistent display
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: settings.show_navigation,
          dots: settings.show_dots,
          fade: true,
          adaptiveHeight: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          arrows: settings.show_navigation,
          dots: settings.show_dots,
          fade: true,
          adaptiveHeight: false
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          dots: settings.show_dots,
          fade: true,
          adaptiveHeight: false
        }
      }
    ]
  }

  // Helper functions
  const getImageUrl = (slide) => {
    if (!slide || !slide.image_url) {
      return 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80'
    }
    return slide.image_url
  }

  const getOptimizedUrl = (url, width = 1920) => {
    if (!url || url.includes('unsplash.com')) return url
    
    // Cloudinary optimization
    if (url.includes('res.cloudinary.com')) {
      const baseUrl = url.split('/upload/')[0] + '/upload/'
      const imagePath = url.split('/upload/')[1]
      return `${baseUrl}f_auto,q_auto,dpr_auto,w_${width}/${imagePath}`
    }
    
    return url
  }

  if (isLoading) {
    return (
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">กำลังโหลด Banner...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error && slides.length === 0) {
    console.error('BannerSlide error:', error)
    return (
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-600 mb-4">Banner Section</h3>
            <p className="text-gray-500">Unable to load banner slides.</p>
            <p className="text-sm text-gray-400 mt-2">Please check your connection or try again later.</p>
          </div>
        </div>
      </section>
    )
  }

  if (slides.length === 0) {
    console.log('⚠️  No banner slides found, showing fallback UI');
    return (
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-600 mb-4">Banner Section</h3>
            <p className="text-gray-500">No banner slides configured yet.</p>
            <p className="text-sm text-gray-400 mt-2">Check the admin panel to add banner slides.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden">
      <div className="w-full mx-auto px-0 flex justify-center">
        <div 
          className="relative w-full overflow-hidden"
          style={{ 
            margin: '0 auto',
            padding: 0,
            width: '1200px',
            height: '400px',
            maxWidth: '100%',
            '@media (max-width: 767px)': {
              width: '100%',
              height: '250px'
            }
          }}
        >
          <Slider {...slickSettings} className="banner-slider">
            {slides.map((slide, index) => (
              <div key={slide.id || index} className="relative w-full h-full">
                <a href={slide.link || '#'} className="block w-full h-full">
                  <img
                    src={getOptimizedUrl(getImageUrl(slide), 1200)}
                    alt={slide.alt_text || 'Banner'}
                    className="w-full"
                    style={{
                      height: '400px',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      borderRadius: '8px'
                    }}
                    onLoad={(e) => {
                      const w = e.target.naturalWidth || 1200
                      const h = e.target.naturalHeight || 400
                      if (w > 0 && h > 0) setAspectRatio(w / h)
                    }}
                    onError={(e) => {
                      e.target.src = getImageUrl(null) // Use fallback on error
                    }}
                  />
                </a>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  )
}

export default BannerSlide