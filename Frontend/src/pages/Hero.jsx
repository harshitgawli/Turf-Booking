import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import image1 from "../assets/images/image1.png";
import image2 from "../assets/images/image2.png";
import image3 from "../assets/images/image3.png";

function Hero() {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);

  const images = [image1, image2, image3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-600 to-teal-400 relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="min-h-screen flex items-center">
          <div className="container mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left side - Content */}
              <div className="text-white space-y-8 animate-slide-in-left">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Shajapur's #1 Turf Booking Platform
                  </div>
                  
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-4 drop-shadow-2xl">
                    Sportify
                    <span className="block text-green-200">Turf</span>
                  </h1>
                  
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                    Book Your Perfect Turf
                    <span className="block text-green-200 mt-2">In Seconds ⚡</span>
                  </h2>
                  
                  <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-xl">
                    Experience premium cricket turfs with floodlights, professional pitch conditions, and instant booking. Your game starts here!
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate("/register")}
                    className="group relative px-6 sm:px-8 py-4 sm:py-5 bg-white text-green-600 font-bold text-base sm:text-lg rounded-xl shadow-2xl hover:shadow-white/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Get Started Free
                      <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 sm:px-8 py-4 sm:py-5 bg-white/10 backdrop-blur-md border-2 border-white/50 text-white font-bold text-base sm:text-lg rounded-xl hover:bg-white hover:text-green-600 transform hover:scale-105 transition-all duration-300"
                  >
                    Login
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-8 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-black text-white mb-1">500+</div>
                    <div className="text-white/80 text-xs sm:text-sm font-medium">Premium Turfs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-black text-white mb-1">50K+</div>
                    <div className="text-white/80 text-xs sm:text-sm font-medium">Happy Players</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-black text-white mb-1">24/7</div>
                    <div className="text-white/80 text-xs sm:text-sm font-medium">Support</div>
                  </div>
                </div>
              </div>

              {/* Right side - Image Carousel + Feature Cards */}
              <div className="relative animate-slide-in-right">
                <div className="relative space-y-6">
                  
                  {/* Image Carousel */}
                  <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-white/20">
                    <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
                      {images.map((img, index) => (
                        <div
                          key={index}
                          className={`absolute inset-0 transition-all duration-700 ${
                            currentImage === index 
                              ? "opacity-100 scale-100" 
                              : "opacity-0 scale-95"
                          }`}
                        >
                          <img 
                            src={img} 
                            alt={`Turf ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>
                      ))}
                      
                      {/* Carousel Controls */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImage(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                              currentImage === index 
                                ? "w-8 bg-white" 
                                : "w-2 bg-white/50 hover:bg-white/75"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Feature Cards */}
                  <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl">
                    <div className="space-y-4">
                      
                      {/* Feature 1 */}
                      <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-5 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-green-100">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                            ⚡
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-1">Instant Booking</h3>
                            <p className="text-gray-600 text-xs sm:text-sm">Book your slot in just a few clicks with real-time availability</p>
                          </div>
                        </div>
                      </div>

                      {/* Feature 2 */}
                      <div className="group bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 sm:p-5 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-orange-100">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                            🔒
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-1">Secure Payment</h3>
                            <p className="text-gray-600 text-xs sm:text-sm">Safe and encrypted online transactions you can trust</p>
                          </div>
                        </div>
                      </div>

                      {/* Feature 3 */}
                      <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-blue-100">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                            🏏
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-1">Premium Facilities</h3>
                            <p className="text-gray-600 text-xs sm:text-sm">Professional pitch, floodlights, and equipment included</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Badges */}
                  <div className="hidden lg:block absolute -top-6 -right-6 bg-yellow-400 rounded-2xl p-5 shadow-2xl animate-bounce-slow z-20">
                    <div className="text-center">
                      <div className="text-4xl mb-1">⚽</div>
                      <div className="text-xs font-bold text-gray-800">Live Now</div>
                    </div>
                  </div>

                  <div className="hidden lg:block absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-2xl animate-float z-20">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div>
                        <div className="font-bold text-gray-800 text-sm">125 Active Games</div>
                        <div className="text-xs text-gray-600">Playing Right Now</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Us Section */}
        <div className="container mx-auto px-4 py-16 sm:py-20 lg:py-24">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span className="text-white">Get In Touch</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 drop-shadow-2xl">
                Contact Us
              </h2>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
                Ready to book your slot? Call us now for instant booking and support!
              </p>
            </div>

            {/* Contact Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Phone Card 1 */}
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300 animate-slide-in-left">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse-slow">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-800 text-xl sm:text-2xl mb-3">Primary Contact</h4>
                  <a 
                    href="tel:7974187766" 
                    className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl font-bold text-xl sm:text-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-3"
                  >
                    7974187766
                  </a>
                  <p className="text-gray-600 text-sm">Available 24/7</p>
                </div>
              </div>

              {/* Phone Card 2 */}
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300 animate-fade-in">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse-slow" style={{animationDelay: '0.5s'}}>
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-800 text-xl sm:text-2xl mb-3">Secondary Contact</h4>
                  <a 
                    href="tel:7067652505" 
                    className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-xl font-bold text-xl sm:text-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-3"
                  >
                    7067652505
                  </a>
                  <p className="text-gray-600 text-sm">Mon-Sun: 6AM - 12AM</p>
                </div>
              </div>

              {/* Location Card */}
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300 sm:col-span-2 lg:col-span-1 animate-slide-in-right">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-800 text-xl sm:text-2xl mb-3">Visit Us</h4>
                  <p className="text-gray-700 leading-relaxed text-base sm:text-lg font-semibold mb-2">
                    Sportify Turf
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Near Bus Stand <br />
                    Shajapur, Madhya Pradesh<br />
                    India
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <a 
                href="tel:7974187766"
                className="group bg-white/95 backdrop-blur-xl text-green-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white transition-all duration-300 shadow-2xl hover:shadow-white/50 transform hover:scale-105 flex items-center justify-center gap-3 border border-white/20"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>Call Now</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>

              <a 
                href="https://wa.me/917974187766"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-2xl transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>WhatsApp Us</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>

            {/* Email Info */}
            <div className="mt-8 sm:mt-12 text-center">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-white text-sm sm:text-base">Email:</span>
                <a href="mailto:Harsh001tiwari@gmail.com" className="text-white font-semibold hover:text-green-200 transition-colors">
                  Harsh001tiwari@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Developed By Footer */}
        <div className="border-t border-white/20 py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Footer Content */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/20 shadow-2xl">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
                  
                  {/* Left Side - Brand */}
                  <div className="text-center lg:text-left">
                    <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                      Sportify Turf
                    </h3>
                    <p className="text-white/70 text-sm sm:text-base">
                      Your Game, Our Passion
                    </p>
                  </div>

                  {/* Center - Developed By */}
                  <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20 shadow-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse-slow">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs sm:text-sm font-medium">Developed by</p>
                      <p className="text-white text-lg sm:text-xl font-bold">Harshit Gawli</p>
                    </div>
                  </div>

                  {/* Right Side - Copyright */}
                  <div className="text-center lg:text-right">
                    <p className="text-white/70 text-sm sm:text-base">
                       2026 Sportify Turf
                    </p>
                   
                  </div>
                </div>

                {/* Bottom Links */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-white/70 text-sm">
                    <a href="#" className="hover:text-white transition-colors hover:underline">Privacy Policy</a>
                    <span className="text-white/30">•</span>
                    <a href="#" className="hover:text-white transition-colors hover:underline">Terms of Service</a>
                    <span className="text-white/30">•</span>
                    <a href="#" className="hover:text-white transition-colors hover:underline">Refund Policy</a>
                    <span className="text-white/30">•</span>
                    <a href="#" className="hover:text-white transition-colors hover:underline">FAQs</a>
                  </div>
                </div>
              </div>

              {/* Tech Stack Badge (Optional) */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full text-xs text-white/50 border border-white/10">
                  <span>Built with</span>
                  <span className="text-white/70 font-semibold">React</span>
                  <span>•</span>
                  <span className="text-white/70 font-semibold">Tailwind CSS</span>
                  <span>•</span>
                  <span className="text-white/70 font-semibold">Node.js</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-slide-in-left { animation: slide-in-left 0.8s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.8s ease-out; }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export default Hero;