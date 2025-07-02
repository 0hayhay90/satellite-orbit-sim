import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BookOpen, Calculator, Globe, Rocket, Satellite, Zap } from 'lucide-react';

const Learn = () => {
  const [activeTab, setActiveTab] = useState('gravity');

  const concepts = [
    {
      id: 'gravity',
      title: 'Newton\'s Law of Gravitation',
      icon: <Globe className="w-6 h-6" />,
      content: {
        explanation: `Every object in the universe attracts every other object with a force that is proportional to the product of their masses and inversely proportional to the square of the distance between them.`,
        formula: 'F = G × (m₁ × m₂) / r²',
        variables: [
          { symbol: 'F', meaning: 'Gravitational force (Newtons)' },
          { symbol: 'G', meaning: 'Gravitational constant (6.674 × 10⁻¹¹ m³/kg⋅s²)' },
          { symbol: 'm₁, m₂', meaning: 'Masses of the two objects (kg)' },
          { symbol: 'r', meaning: 'Distance between centers of mass (m)' }
        ],
        example: 'The gravitational force between Earth (5.97 × 10²⁴ kg) and a 1000 kg satellite at 400 km altitude is approximately 8,700 N.'
      }
    },
    {
      id: 'velocity',
      title: 'Orbital Velocity',
      icon: <Rocket className="w-6 h-6" />,
      content: {
        explanation: `Orbital velocity is the speed needed for an object to maintain a stable orbit around another body. It's the perfect balance between gravitational pull and centrifugal force.`,
        formula: 'v = √(GM/r)',
        variables: [
          { symbol: 'v', meaning: 'Orbital velocity (m/s)' },
          { symbol: 'G', meaning: 'Gravitational constant' },
          { symbol: 'M', meaning: 'Mass of central body (kg)' },
          { symbol: 'r', meaning: 'Distance from center of central body (m)' }
        ],
        example: 'The ISS orbits at ~7.66 km/s at 408 km altitude. Any slower and it would fall to Earth, any faster and it would escape to a higher orbit.'
      }
    },
    {
      id: 'escape',
      title: 'Escape Velocity',
      icon: <Zap className="w-6 h-6" />,
      content: {
        explanation: `Escape velocity is the minimum speed needed for an object to escape the gravitational pull of a celestial body without further propulsion.`,
        formula: 'vₑ = √(2GM/r)',
        variables: [
          { symbol: 'vₑ', meaning: 'Escape velocity (m/s)' },
          { symbol: 'G', meaning: 'Gravitational constant' },
          { symbol: 'M', meaning: 'Mass of celestial body (kg)' },
          { symbol: 'r', meaning: 'Distance from center (m)' }
        ],
        example: 'Earth\'s escape velocity at sea level is 11.2 km/s. This is why rockets need such powerful engines to reach space!'
      }
    },
    {
      id: 'orbits',
      title: 'Types of Orbits',
      icon: <Satellite className="w-6 h-6" />,
      content: {
        explanation: `Different orbital altitudes serve different purposes, from communication satellites to space stations.`,
        formula: 'T = 2π√(r³/GM)',
        variables: [
          { symbol: 'T', meaning: 'Orbital period (seconds)' },
          { symbol: 'r', meaning: 'Semi-major axis (m)' },
          { symbol: 'G', meaning: 'Gravitational constant' },
          { symbol: 'M', meaning: 'Mass of central body (kg)' }
        ],
        example: 'Geostationary satellites orbit at 35,786 km altitude with a 24-hour period, staying fixed above one point on Earth.'
      }
    }
  ];

  const orbitTypes = [
    {
      name: 'LEO (Low Earth Orbit)',
      altitude: '160-2,000 km',
      period: '90-128 minutes',
      examples: 'ISS, Hubble Space Telescope, most satellites',
      color: 'text-blue-400'
    },
    {
      name: 'MEO (Medium Earth Orbit)',
      altitude: '2,000-35,786 km',
      period: '2-24 hours',
      examples: 'GPS satellites, navigation systems',
      color: 'text-green-400'
    },
    {
      name: 'GEO (Geostationary Orbit)',
      altitude: '35,786 km',
      period: '24 hours',
      examples: 'Communication satellites, weather satellites',
      color: 'text-orange-400'
    },
    {
      name: 'HEO (High Earth Orbit)',
      altitude: '>35,786 km',
      period: '>24 hours',
      examples: 'Deep space missions, some research satellites',
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Learn Orbital Mechanics
          </h1>
          <p className="text-xl text-gray-300">
            Master the fundamental concepts that govern space travel
          </p>
        </div>

        {/* Physics Concepts */}
        <div className="mb-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-slate-800/50 border border-slate-700">
              {concepts.map((concept) => (
                <TabsTrigger
                  key={concept.id}
                  value={concept.id}
                  className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <div className="flex items-center gap-2">
                    {concept.icon}
                    <span className="hidden sm:inline">{concept.title.split(' ')[0]}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {concepts.map((concept) => (
              <TabsContent key={concept.id} value={concept.id} className="mt-8">
                <Card className="p-8 bg-slate-800/50 border-slate-700">
                  <div className="flex items-center gap-3 mb-6">
                    {concept.icon}
                    <h2 className="text-2xl font-bold text-white">{concept.title}</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Explanation</h3>
                      <p className="text-gray-300 leading-relaxed mb-6">
                        {concept.content.explanation}
                      </p>

                      <h3 className="text-lg font-semibold text-white mb-4">Example</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {concept.content.example}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Formula</h3>
                      <div className="math-equation text-center text-xl mb-6">
                        {concept.content.formula}
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-4">Variables</h3>
                      <div className="space-y-3">
                        {concept.content.variables.map((variable, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <span className="font-mono text-blue-400 font-semibold min-w-[60px]">
                              {variable.symbol}
                            </span>
                            <span className="text-gray-300">{variable.meaning}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Orbit Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Types of Earth Orbits
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {orbitTypes.map((orbit, index) => (
              <Card key={index} className="p-6 bg-slate-800/50 border-slate-700 card-hover">
                <h3 className={`text-xl font-bold mb-3 ${orbit.color}`}>
                  {orbit.name}
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">Altitude:</span>
                    <div className="text-white font-mono">{orbit.altitude}</div>
                  </div>
                  
                  <div>
                    <span className="text-gray-400">Period:</span>
                    <div className="text-white font-mono">{orbit.period}</div>
                  </div>
                  
                  <div>
                    <span className="text-gray-400">Examples:</span>
                    <div className="text-gray-300">{orbit.examples}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Visual Comparison */}
        <Card className="p-8 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-700 mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Gravity vs. Orbital Velocity
          </h2>
          
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-lg text-gray-300 mb-8">
              Orbital motion is a delicate balance between two forces:
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⬇</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Gravitational Force</h3>
                <p className="text-gray-300">
                  Pulls the satellite toward Earth's center. Without this, the satellite would fly away in a straight line.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">➡</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Orbital Velocity</h3>
                <p className="text-gray-300">
                  Provides the sideways motion that keeps the satellite "falling around" Earth instead of falling into it.
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-blue-600/20 rounded-lg border border-blue-400/30">
              <p className="text-lg text-white">
                <strong>Perfect Balance:</strong> When orbital velocity exactly matches what's needed to counteract gravity at that altitude, you get a stable circular orbit!
              </p>
            </div>
          </div>
        </Card>

        {/* Key Insights */}
        <Card className="p-8 bg-slate-800/50 border-slate-700">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Key Insights
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Higher = Slower</h3>
              <p className="text-gray-300">
                Satellites in higher orbits move slower than those in lower orbits.
              </p>
            </div>
            
            <div className="text-center">
              <Calculator className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Mass Doesn't Matter</h3>
              <p className="text-gray-300">
                A feather and a bowling ball orbit at the same speed at the same altitude.
              </p>
            </div>
            
            <div className="text-center">
              <Rocket className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Energy Trade-offs</h3>
              <p className="text-gray-300">
                To go to a higher orbit, you need to speed up first, then slow down.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Learn;