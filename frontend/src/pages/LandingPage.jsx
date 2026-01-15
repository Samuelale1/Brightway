import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const features = [
    {
      icon: "🚀",
      title: "Lightning Fast Delivery",
      description: "Get your favorite meals delivered to your doorstep in under 30 minutes."
    },
    {
      icon: "🍽️",
      title: "Fresh & Delicious",
      description: "Every dish is prepared fresh with premium ingredients by expert chefs."
    },
    {
      icon: "📱",
      title: "Easy Ordering",
      description: "Order in just a few taps. Simple, intuitive, and hassle-free experience."
    },
    {
      icon: "💳",
      title: "Secure Payments",
      description: "Multiple payment options with bank-level security for peace of mind."
    }
  ];

  const steps = [
    { number: "01", title: "Browse Menu", description: "Explore our delicious selection of meals" },
    { number: "02", title: "Place Order", description: "Add to cart and checkout in seconds" },
    { number: "03", title: "Enjoy Food", description: "Receive fresh food at your doorstep" }
  ];

  const testimonials = [
    {
      name: "Adaeze O.",
      role: "Regular Customer",
      quote: "Brightway has completely changed how I order food. Fast, fresh, and always delicious!",
      avatar: "🧑‍💼"
    },
    {
      name: "Chinedu M.",
      role: "Food Lover",
      quote: "The quality is unmatched. It's like having a 5-star restaurant deliver to my home.",
      avatar: "👨‍💻"
    },
    {
      name: "Funke A.",
      role: "Busy Professional",
      quote: "Perfect for my busy schedule. Quick ordering and reliable delivery every time.",
      avatar: "👩‍🏫"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] bg-orange-600/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 left-1/3 w-[350px] h-[350px] bg-amber-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/LOGO.png" alt="Brightway Logo" className="w-12 h-12 drop-shadow-lg" />
            <span className="text-2xl font-extrabold tracking-tight">
              Brightway<span className="text-amber-500">.</span>
            </span>
          </div>
          <Link 
            to="/login" 
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
          >
            Login / Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-gray-400 mb-8">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Now Serving Fresh Meals Daily
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Delicious Food,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500">
              Delivered Fast.
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience the best of Nigerian cuisine delivered fresh to your doorstep. 
            From savory jollof rice to irresistible snacks — we bring the restaurant to you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/login" 
              className="px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 transition-all active:scale-95"
            >
              Order Now 🍔
            </Link>
            <a 
              href="#features" 
              className="px-10 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold text-lg rounded-2xl hover:bg-white/10 transition-all"
            >
              Learn More
            </a>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              <span>30min Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span>4.9 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Why Choose <span className="text-amber-500">Brightway?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              We're more than just a food delivery service. We're your gateway to culinary excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:bg-white/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-24 px-6 bg-slate-800/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              How It <span className="text-amber-500">Works</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Getting your favorite food has never been easier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="text-7xl font-black text-amber-500/10 absolute -top-4 left-1/2 -translate-x-1/2">
                  {step.number}
                </div>
                <div className="relative pt-12">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg shadow-orange-500/30 mb-6">
                    {index + 1}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              What Our <span className="text-amber-500">Customers</span> Say
            </h2>
            <p className="text-gray-400 text-lg">
              Don't just take our word for it — hear from our satisfied customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:bg-white/10 transition-all"
              >
                <div className="text-4xl mb-4 opacity-30">"</div>
                <p className="text-gray-300 mb-6 leading-relaxed">{testimonial.quote}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500/20 to-orange-600/20 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-r from-amber-500/10 to-orange-600/10 backdrop-blur-xl border border-white/10 rounded-3xl">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Ready to Order?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of satisfied customers and experience the best food delivery service in town.
            </p>
            <Link 
              to="/login" 
              className="inline-block px-12 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 transition-all active:scale-95"
            >
              Get Started Now →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src="/LOGO.png" alt="Brightway Logo" className="w-10 h-10" />
                <span className="text-xl font-extrabold">
                  Brightway<span className="text-amber-500">.</span>
                </span>
              </div>
              <p className="text-gray-500 max-w-sm leading-relaxed">
                Your trusted partner for delicious food delivery. 
                Fresh meals, fast delivery, and exceptional taste — every time.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-3 text-gray-500">
                <li><Link to="/login" className="hover:text-amber-500 transition-colors">Login</Link></li>
                <li><Link to="/login" className="hover:text-amber-500 transition-colors">Sign Up</Link></li>
                <li><a href="#features" className="hover:text-amber-500 transition-colors">Features</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-3 text-gray-500">
                <li className="flex items-center gap-2">
                  <span>📍</span> Jabi, Abuja, Nigeria
                </li>
                <li className="flex items-center gap-2">
                  <span>📧</span> hello@brightway.com
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span> +234 9034359769
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2026 Brightway Confectionaries. All rights reserved.
            </p>
            <div className="flex gap-6 text-gray-500">
              <a href="#" className="hover:text-amber-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-amber-500 transition-colors">Terms</a>
              <a href="#" className="hover:text-amber-500 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
