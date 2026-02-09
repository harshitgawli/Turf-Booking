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

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Content */}
            <div className="text-white space-y-8 animate-slide-in-left">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Shajapur's #1 Turf Booking Platform
                </div>
                
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-4 drop-shadow-2xl">
                  Sportify
                  <span className="block text-green-200">Turf</span>
                </h1>
                
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                  Book Your Perfect Turf
                  <span className="block text-green-200 mt-2">In Seconds ⚡</span>
                </h2>
                
                <p className="text-xl text-white/90 leading-relaxed max-w-xl">
                  Experience premium cricket turfs with floodlights, professional pitch conditions, and instant booking. Your game starts here!
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/register")}
                  className="group relative px-8 py-5 bg-white text-green-600 font-bold text-lg rounded-xl shadow-2xl hover:shadow-white/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get Started Free
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-5 bg-white/10 backdrop-blur-md border-2 border-white/50 text-white font-bold text-lg rounded-xl hover:bg-white hover:text-green-600 transform hover:scale-105 transition-all duration-300"
                >
                  Login
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-4xl font-black text-white mb-1">500+</div>
                  <div className="text-white/80 text-sm font-medium">Premium Turfs</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-white mb-1">50K+</div>
                  <div className="text-white/80 text-sm font-medium">Happy Players</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-white mb-1">24/7</div>
                  <div className="text-white/80 text-sm font-medium">Support</div>
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
                    <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-green-100">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                          ⚡
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-lg mb-1">Instant Booking</h3>
                          <p className="text-gray-600 text-sm">Book your slot in just a few clicks with real-time availability</p>
                        </div>
                      </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="group bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-orange-100">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                          🔒
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-lg mb-1">Secure Payment</h3>
                          <p className="text-gray-600 text-sm">Safe and encrypted online transactions you can trust</p>
                        </div>
                      </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-blue-100">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                          🏏
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-lg mb-1">Premium Facilities</h3>
                          <p className="text-gray-600 text-sm">Professional pitch, floodlights, and equipment included</p>
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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-slide-in-left { animation: slide-in-left 0.8s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.8s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export default Hero;