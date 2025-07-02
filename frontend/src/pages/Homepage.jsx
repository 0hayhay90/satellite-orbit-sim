import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Satellite, Globe, ArrowRight, Play } from 'lucide-react';

const Homepage = () => {
  const features = [
    {
      icon: <Satellite className="w-8 h-8 text-blue-400" />,
      title: "Interactive Simulator",
      description: "Visualize orbital mechanics with real-time physics calculations and preset satellite examples."
    },
    {
      icon: <Globe className="w-8 h-8 text-green-400" />,
      title: "Educational Content",
      description: "Learn the fundamental concepts of orbital mechanics with clear explanations and diagrams."
    },
    {
      icon: <Rocket className="w-8 h-8 text-orange-400" />,
      title: "Real Physics",
      description: "Experience Newton's laws in action with accurate gravitational and orbital velocity calculations."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Explore the Physics of{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Spaceflight
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover how satellites stay in orbit, rockets escape Earth's gravity, and spacecraft navigate 
              the cosmos. OrbitLab makes orbital mechanics interactive and accessible for students.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/simulator"
              className="btn-primary px-8 py-4 rounded-xl text-lg font-semibold text-white flex items-center gap-2 group"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Launch the Simulator
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/learn"
              className="px-8 py-4 rounded-xl text-lg font-semibold text-white border-2 border-white/20 hover:border-blue-400/50 hover:bg-white/5 transition-all flex items-center gap-2"
            >
              Start Learning
            </Link>
          </div>

          {/* Orbital Demo Animation */}
          <div className="relative w-64 h-64 mx-auto mb-20">
            <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 border-dashed"></div>
            <div className="absolute inset-4 rounded-full border border-blue-400/50"></div>
            
            {/* Earth */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full shadow-lg"></div>
            
            {/* Orbiting Satellite */}
            <div className="absolute top-1/2 left-1/2 w-2 h-2 transform -translate-x-1/2 -translate-y-1/2" style={{ animation: 'orbit 8s linear infinite' }}>
              <div className="w-2 h-2 bg-orange-400 rounded-full shadow-lg glow-orange" style={{ transform: 'translateX(120px)' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Master Orbital Mechanics
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-hover bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 text-center"
              >
                <div className="flex justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-400">384,400</div>
              <div className="text-gray-300">km to Moon</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-400">7.8</div>
              <div className="text-gray-300">km/s Orbital Velocity</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-orange-400">11.2</div>
              <div className="text-gray-300">km/s Escape Velocity</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-400">35,786</div>
              <div className="text-gray-300">km GEO Altitude</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Launch Your Understanding?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start exploring orbital mechanics today and discover the science behind space exploration.
          </p>
          <Link
            to="/simulator"
            className="btn-primary px-10 py-5 rounded-xl text-xl font-semibold text-white inline-flex items-center gap-3 group"
          >
            <Rocket className="w-6 h-6 group-hover:scale-110 transition-transform" />
            Begin Your Journey
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Homepage;