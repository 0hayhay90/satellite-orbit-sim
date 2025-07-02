import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Download, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const Simulator = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Simulation state
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('custom');
  
  // Orbital parameters
  const [satellite, setSatellite] = useState({
    mass: 1000, // kg
    altitude: 400, // km above Earth surface
    velocity: 7.66, // km/s
    orbitType: 'circular'
  });
  
  // Animation state
  const [angle, setAngle] = useState(0);
  const [orbitHistory, setOrbitHistory] = useState([]);
  
  // Constants
  const EARTH_RADIUS = 6371; // km
  const EARTH_MASS = 5.972e24; // kg
  const G = 6.674e-11; // m³/kg⋅s²
  const CANVAS_SCALE = 0.03; // pixels per km
  
  // Preset orbits
  const presets = {
    iss: { name: 'ISS (LEO)', altitude: 408, velocity: 7.66, mass: 420000 },
    geo: { name: 'Geostationary', altitude: 35786, velocity: 3.07, mass: 5000 },
    gps: { name: 'GPS (MEO)', altitude: 20200, velocity: 3.87, mass: 2000 },
    custom: { name: 'Custom', altitude: 400, velocity: 7.66, mass: 1000 }
  };
  
  // Physics calculations
  const calculateOrbitalVelocity = (altitude) => {
    const r = (EARTH_RADIUS + altitude) * 1000; // Convert to meters
    const v = Math.sqrt(G * EARTH_MASS / r);
    return v / 1000; // Convert back to km/s
  };
  
  const calculateOrbitalPeriod = (altitude) => {
    const r = (EARTH_RADIUS + altitude) * 1000;
    const T = 2 * Math.PI * Math.sqrt(Math.pow(r, 3) / (G * EARTH_MASS));
    return T / 3600; // Convert to hours
  };
  
  const calculateEscapeVelocity = (altitude) => {
    const r = (EARTH_RADIUS + altitude) * 1000;
    const ve = Math.sqrt(2 * G * EARTH_MASS / r);
    return ve / 1000; // Convert to km/s
  };
  
  // Handle preset selection
  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    if (preset !== 'custom') {
      const presetData = presets[preset];
      setSatellite({
        ...satellite,
        altitude: presetData.altitude,
        velocity: presetData.velocity,
        mass: presetData.mass
      });
    }
  };
  
  // Canvas drawing
  const drawSimulation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Earth
    const earthRadius = EARTH_RADIUS * CANVAS_SCALE;
    ctx.beginPath();
    ctx.arc(centerX, centerY, earthRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'linear-gradient(45deg, #3b82f6, #10b981)';
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, earthRadius);
    gradient.addColorStop(0, '#10b981');
    gradient.addColorStop(1, '#3b82f6');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw Earth's glow
    ctx.beginPath();
    ctx.arc(centerX, centerY, earthRadius + 5, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw orbital path
    const orbitRadius = (EARTH_RADIUS + satellite.altitude) * CANVAS_SCALE;
    ctx.beginPath();
    ctx.arc(centerX, centerY, orbitRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw satellite
    const satX = centerX + Math.cos(angle) * orbitRadius;
    const satY = centerY + Math.sin(angle) * orbitRadius;
    
    ctx.beginPath();
    ctx.arc(satX, satY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#f97316';
    ctx.fill();
    
    // Draw satellite glow
    ctx.beginPath();
    ctx.arc(satX, satY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(249, 115, 22, 0.3)';
    ctx.fill();
    
    // Draw velocity vector
    const velocityScale = 10;
    const velX = -Math.sin(angle) * velocityScale;
    const velY = Math.cos(angle) * velocityScale;
    
    ctx.beginPath();
    ctx.moveTo(satX, satY);
    ctx.lineTo(satX + velX, satY + velY);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw orbit history
    if (orbitHistory.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.3)';
      ctx.lineWidth = 1;
      for (let i = 1; i < orbitHistory.length; i++) {
        const prevPoint = orbitHistory[i - 1];
        const currPoint = orbitHistory[i];
        if (i === 1) {
          ctx.moveTo(prevPoint.x, prevPoint.y);
        }
        ctx.lineTo(currPoint.x, currPoint.y);
      }
      ctx.stroke();
    }
    
    // Add current position to history
    setOrbitHistory(prev => {
      const newHistory = [...prev, { x: satX, y: satY }];
      return newHistory.length > 200 ? newHistory.slice(-200) : newHistory;
    });
  };
  
  // Animation loop
  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        setAngle(prev => prev + 0.02);
        drawSimulation();
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, satellite, angle]);
  
  // Initial draw
  useEffect(() => {
    drawSimulation();
  }, [satellite]);
  
  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 600;
      canvas.height = 600;
    }
  }, []);
  
  const calculatedVelocity = calculateOrbitalVelocity(satellite.altitude);
  const period = calculateOrbitalPeriod(satellite.altitude);
  const escapeVel = calculateEscapeVelocity(satellite.altitude);
  
  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Orbital Mechanics Simulator
          </h1>
          <p className="text-xl text-gray-300">
            Visualize satellite orbits and explore the physics of spaceflight
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Controls
              </h3>
              
              {/* Simulation Controls */}
              <div className="space-y-4 mb-6">
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsRunning(!isRunning)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isRunning ? 'Pause' : 'Start'}
                  </Button>
                  <Button
                    onClick={() => {
                      setAngle(0);
                      setOrbitHistory([]);
                    }}
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Preset Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">
                  Preset Orbits
                </label>
                <Select value={selectedPreset} onValueChange={handlePresetChange}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {Object.entries(presets).map(([key, preset]) => (
                      <SelectItem key={key} value={key} className="text-white hover:bg-slate-600">
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Parameter Controls */}
              <div className="space-y-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Altitude: {satellite.altitude.toFixed(0)} km
                  </label>
                  <Slider
                    value={[satellite.altitude]}
                    onValueChange={([value]) => {
                      setSatellite(prev => ({ ...prev, altitude: value }));
                      setSelectedPreset('custom');
                    }}
                    min={200}
                    max={50000}
                    step={100}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mass: {satellite.mass.toLocaleString()} kg
                  </label>
                  <Slider
                    value={[satellite.mass]}
                    onValueChange={([value]) => {
                      setSatellite(prev => ({ ...prev, mass: value }));
                      setSelectedPreset('custom');
                    }}
                    min={100}
                    max={500000}
                    step={1000}
                    className="w-full"
                  />
                </div>
              </div>
            </Card>
            
            {/* Orbital Parameters */}
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Orbital Parameters
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Orbital Velocity:</span>
                  <span className="text-blue-400 font-mono">{calculatedVelocity.toFixed(2)} km/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Orbital Period:</span>
                  <span className="text-green-400 font-mono">{period.toFixed(2)} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Escape Velocity:</span>
                  <span className="text-orange-400 font-mono">{escapeVel.toFixed(2)} km/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Distance from Center:</span>
                  <span className="text-purple-400 font-mono">{(EARTH_RADIUS + satellite.altitude).toLocaleString()} km</span>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Simulation Canvas */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Orbit Visualization
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-white hover:bg-slate-700"
                  onClick={() => {
                    // Mock download functionality
                    alert('Download feature will be implemented in full version!');
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Save Image
                </Button>
              </div>
              
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  className="orbit-canvas max-w-full h-auto"
                  width={600}
                  height={600}
                />
              </div>
              
              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                  <span className="text-gray-300">Earth</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span className="text-gray-300">Satellite</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-green-400"></div>
                  <span className="text-gray-300">Velocity Vector</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 border-t-2 border-dashed border-blue-400"></div>
                  <span className="text-gray-300">Orbital Path</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;