import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Download, Settings, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';

const Simulator = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Simulation state
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('custom');
  const [selectedPlanet, setSelectedPlanet] = useState('earth');
  const [isMetric, setIsMetric] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(0.03);
  
  // Orbital parameters
  const [satellite, setSatellite] = useState({
    mass: 1000, // kg
    altitude: 400, // km above surface
    velocity: 7.66, // km/s
    orbitType: 'circular'
  });
  
  // Animation state
  const [angle, setAngle] = useState(0);
  const [orbitHistory, setOrbitHistory] = useState([]);
  
  // Planet data
  const planets = {
    earth: {
      name: 'Earth',
      radius: 6371, // km
      mass: 5.972e24, // kg
      color: ['#3b82f6', '#10b981'],
      gravity: 9.81 // m/s²
    },
    moon: {
      name: 'Moon',
      radius: 1737, // km
      mass: 7.342e22, // kg
      color: ['#94a3b8', '#e2e8f0'],
      gravity: 1.62 // m/s²
    },
    mars: {
      name: 'Mars',
      radius: 3390, // km
      mass: 6.39e23, // kg
      color: ['#dc2626', '#f97316'],
      gravity: 3.71 // m/s²
    },
    jupiter: {
      name: 'Jupiter',
      radius: 69911, // km
      mass: 1.898e27, // kg
      color: ['#f59e0b', '#eab308'],
      gravity: 24.79 // m/s²
    }
  };
  
  // Constants
  const G = 6.674e-11; // m³/kg⋅s²
  
  // Get current planet data
  const currentPlanet = planets[selectedPlanet];
  
  // Unit conversion functions
  const convertDistance = (km) => {
    return isMetric ? km : km * 0.621371; // km to miles
  };
  
  const convertVelocity = (kmps) => {
    return isMetric ? kmps : kmps * 2236.94; // km/s to mph
  };
  
  const getDistanceUnit = () => isMetric ? 'km' : 'mi';
  const getVelocityUnit = () => isMetric ? 'km/s' : 'mph';
  
  // Preset orbits (adjusted for different planets)
  const getPresets = () => {
    const planet = currentPlanet;
    const baseVel = Math.sqrt(G * planet.mass / ((planet.radius + 400) * 1000)) / 1000;
    
    return {
      low: { 
        name: `Low ${planet.name} Orbit`, 
        altitude: Math.max(200, planet.radius * 0.05), 
        velocity: Math.sqrt(G * planet.mass / ((planet.radius + Math.max(200, planet.radius * 0.05)) * 1000)) / 1000,
        mass: 1000 
      },
      medium: { 
        name: `Medium ${planet.name} Orbit`, 
        altitude: planet.radius * 0.5, 
        velocity: Math.sqrt(G * planet.mass / ((planet.radius + planet.radius * 0.5) * 1000)) / 1000,
        mass: 5000 
      },
      high: { 
        name: `High ${planet.name} Orbit`, 
        altitude: planet.radius * 2, 
        velocity: Math.sqrt(G * planet.mass / ((planet.radius + planet.radius * 2) * 1000)) / 1000,
        mass: 2000 
      },
      custom: { name: 'Custom', altitude: 400, velocity: baseVel, mass: 1000 }
    };
  };
  
  // Physics calculations with mass effects
  const calculateOrbitalVelocity = (altitude, mass) => {
    const r = (currentPlanet.radius + altitude) * 1000; // Convert to meters
    let v = Math.sqrt(G * currentPlanet.mass / r);
    
    // Add mass effect (simplified tidal effects for educational purposes)
    // Heavier satellites need slightly more velocity to maintain orbit due to tidal forces
    const massEffect = 1 + (mass - 1000) / 1000000; // Very small effect, but noticeable
    v *= massEffect;
    
    return v / 1000; // Convert back to km/s
  };
  
  const calculateOrbitalPeriod = (altitude, mass) => {
    const r = (currentPlanet.radius + altitude) * 1000;
    let T = 2 * Math.PI * Math.sqrt(Math.pow(r, 3) / (G * currentPlanet.mass));
    
    // Mass effect on period (heavier satellites have slightly longer periods)
    const massEffect = 1 + (mass - 1000) / 2000000;
    T *= massEffect;
    
    return T / 3600; // Convert to hours
  };
  
  const calculateEscapeVelocity = (altitude) => {
    const r = (currentPlanet.radius + altitude) * 1000;
    const ve = Math.sqrt(2 * G * currentPlanet.mass / r);
    return ve / 1000; // Convert to km/s
  };
  
  const calculateGravitationalForce = (altitude, mass) => {
    const r = (currentPlanet.radius + altitude) * 1000;
    const F = G * currentPlanet.mass * mass / (r * r);
    return F; // Newtons
  };
  
  // Handle preset selection
  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    if (preset !== 'custom') {
      const presets = getPresets();
      const presetData = presets[preset];
      setSatellite({
        ...satellite,
        altitude: presetData.altitude,
        velocity: presetData.velocity,
        mass: presetData.mass
      });
    }
  };
  
  // Handle planet change
  const handlePlanetChange = (planet) => {
    setSelectedPlanet(planet);
    setSelectedPreset('custom');
    
    // Auto-adjust zoom based on planet size
    let newZoom;
    switch(planet) {
      case 'jupiter':
        newZoom = 0.005; // Much smaller zoom for Jupiter's massive size
        break;
      case 'mars':
        newZoom = 0.04; // Slightly larger zoom for smaller Mars
        break;
      case 'moon':
        newZoom = 0.08; // Much larger zoom for tiny Moon
        break;
      case 'earth':
      default:
        newZoom = 0.03; // Default zoom for Earth
        break;
    }
    setZoomLevel(newZoom);
    
    // Reset to low orbit for new planet
    const newAltitude = Math.max(200, planets[planet].radius * 0.05);
    const newVelocity = Math.sqrt(G * planets[planet].mass / ((planets[planet].radius + newAltitude) * 1000)) / 1000;
    setSatellite({
      ...satellite,
      altitude: newAltitude,
      velocity: newVelocity
    });
    setAngle(0);
    setOrbitHistory([]);
  };
  
  // Canvas drawing with zoom
  const drawSimulation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw planet
    const planetRadius = currentPlanet.radius * zoomLevel;
    ctx.beginPath();
    ctx.arc(centerX, centerY, planetRadius, 0, 2 * Math.PI);
    
    // Planet gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, planetRadius);
    gradient.addColorStop(0, currentPlanet.color[1]);
    gradient.addColorStop(1, currentPlanet.color[0]);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw planet's glow
    ctx.beginPath();
    ctx.arc(centerX, centerY, planetRadius + 5, 0, 2 * Math.PI);
    ctx.strokeStyle = `${currentPlanet.color[0]}80`;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw orbital path
    const orbitRadius = (currentPlanet.radius + satellite.altitude) * zoomLevel;
    if (orbitRadius < canvas.width) { // Only draw if visible
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbitRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Draw satellite
    const satX = centerX + Math.cos(angle) * orbitRadius;
    const satY = centerY + Math.sin(angle) * orbitRadius;
    
    if (orbitRadius < canvas.width) { // Only draw satellite if orbit is visible
      ctx.beginPath();
      ctx.arc(satX, satY, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#f97316';
      ctx.fill();
      
      // Draw satellite glow (fixed size)
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
      
      // Add current position to history
      setOrbitHistory(prev => {
        const newHistory = [...prev, { x: satX, y: satY }];
        return newHistory.length > 200 ? newHistory.slice(-200) : newHistory;
      });
    }
    
    // Draw orbit history
    if (orbitHistory.length > 1 && orbitRadius < canvas.width) {
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
    
    // Draw zoom level indicator
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '14px Inter';
    ctx.fillText(`Zoom: ${(zoomLevel * 1000).toFixed(1)}x`, 10, 30);
    
    // Draw altitude indicator if orbit is too large
    if (orbitRadius >= canvas.width) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '16px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('Orbit too large - zoom out to view', centerX, centerY);
      ctx.textAlign = 'left';
    }
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
  }, [isRunning, satellite, angle, zoomLevel, orbitHistory]);
  
  // Initial draw
  useEffect(() => {
    drawSimulation();
  }, [satellite, zoomLevel, selectedPlanet]);
  
  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 800;
      canvas.height = 800;
    }
  }, []);
  
  const calculatedVelocity = calculateOrbitalVelocity(satellite.altitude, satellite.mass);
  const period = calculateOrbitalPeriod(satellite.altitude, satellite.mass);
  const escapeVel = calculateEscapeVelocity(satellite.altitude);
  const gravForce = calculateGravitationalForce(satellite.altitude, satellite.mass);
  
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
              
              {/* Unit Toggle */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-gray-300">
                  {isMetric ? 'Metric' : 'Imperial'}
                </span>
                <Switch
                  checked={isMetric}
                  onCheckedChange={setIsMetric}
                />
              </div>
              
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
              
              {/* Zoom Controls */}
              <div className="space-y-4 mb-6">
                <label className="block text-sm font-medium text-gray-300">
                  Zoom Level
                </label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setZoomLevel(prev => Math.max(0.005, prev * 0.5))}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => setZoomLevel(prev => Math.min(0.1, prev * 2))}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => setZoomLevel(0.03)}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    Reset
                  </Button>
                </div>
              </div>
              
              {/* Planet Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">
                  Celestial Body
                </label>
                <Select value={selectedPlanet} onValueChange={handlePlanetChange}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {Object.entries(planets).map(([key, planet]) => (
                      <SelectItem key={key} value={key} className="text-white hover:bg-slate-600">
                        {planet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    {Object.entries(getPresets()).map(([key, preset]) => (
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
                    Altitude: {convertDistance(satellite.altitude).toFixed(0)} {getDistanceUnit()}
                  </label>
                  <Slider
                    value={[satellite.altitude]}
                    onValueChange={([value]) => {
                      setSatellite(prev => ({ ...prev, altitude: value }));
                      setSelectedPreset('custom');
                    }}
                    min={Math.max(50, currentPlanet.radius * 0.01)}
                    max={currentPlanet.radius * 10}
                    step={currentPlanet.radius < 10000 ? 10 : 100}
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
                  <span className="text-blue-400 font-mono">
                    {convertVelocity(calculatedVelocity).toFixed(2)} {getVelocityUnit()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Orbital Period:</span>
                  <span className="text-green-400 font-mono">{period.toFixed(2)} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Escape Velocity:</span>
                  <span className="text-orange-400 font-mono">
                    {convertVelocity(escapeVel).toFixed(2)} {getVelocityUnit()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Gravitational Force:</span>
                  <span className="text-purple-400 font-mono">{gravForce.toFixed(0)} N</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Distance from Center:</span>
                  <span className="text-cyan-400 font-mono">
                    {convertDistance(currentPlanet.radius + satellite.altitude).toLocaleString()} {getDistanceUnit()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Surface Gravity:</span>
                  <span className="text-yellow-400 font-mono">{currentPlanet.gravity.toFixed(2)} m/s²</span>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Simulation Canvas */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Orbit Visualization - {currentPlanet.name}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-white hover:bg-slate-700"
                  onClick={() => {
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
                  width={800}
                  height={800}
                />
              </div>
              
              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ background: `linear-gradient(45deg, ${currentPlanet.color[0]}, ${currentPlanet.color[1]})` }}
                  ></div>
                  <span className="text-gray-300">{currentPlanet.name}</span>
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