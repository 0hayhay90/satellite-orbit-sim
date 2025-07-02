import React, { useEffect, useRef } from 'react';

export const StarBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateStars(); // Regenerate stars when window resizes
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create stars with no gaps
    let stars = [];
    
    const generateStars = () => {
      stars = [];
      const numStars = Math.floor((canvas.width * canvas.height) / 8000); // Density based on screen size
      
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * (canvas.width + 200), // Extra width to prevent gaps
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          driftSpeed: Math.random() * 0.3 + 0.1,
          initialX: Math.random() * (canvas.width + 200)
        });
      }
    };

    generateStars();

    // Animation loop
    let animationFrame;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        // Twinkling effect
        star.opacity += star.twinkleSpeed;
        if (star.opacity >= 1 || star.opacity <= 0.2) {
          star.twinkleSpeed *= -1;
        }
        
        // Continuous drift effect - no gaps
        star.x -= star.driftSpeed;
        if (star.x < -20) {
          star.x = canvas.width + 20;
          star.y = Math.random() * canvas.height;
        }
        
        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
        
        // Add glow effect for larger stars
        if (star.radius > 1.5) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(59, 130, 246, ${star.opacity * 0.3})`;
          ctx.fill();
        }
      });
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}
    />
  );
};