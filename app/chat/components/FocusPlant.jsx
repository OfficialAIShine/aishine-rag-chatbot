"use client";
import { useEffect, useRef } from 'react';

export default function FocusPlant() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrame;
    let progress = 0;

    // Simple branch parameters
    const branch = {
      startX: canvas.width * 0.85,
      startY: canvas.height * 0.3,
      segments: []
    };

    // Generate branch segments
    function generateBranch() {
      let x = branch.startX;
      let y = branch.startY;
      let angle = -Math.PI / 6; // 30 degrees upward
      const segmentLength = 40;
      const numSegments = 50;

      for (let i = 0; i < numSegments; i++) {
        const endX = x + Math.cos(angle) * segmentLength;
        const endY = y + Math.sin(angle) * segmentLength;
        
        branch.segments.push({
          startX: x,
          startY: y,
          endX,
          endY,
          thickness: 4 - i * 0.6,
          leaves: i > 2 ? Math.floor(Math.random() * 3) : 0
        });

        x = endX;
        y = endY;
        angle -= Math.PI / 12; // Curve slightly
      }
    }

    generateBranch();

    // Animate branch growth
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      progress += 0.01;
      if (progress > 1) progress = 1;

      const visibleSegments = Math.floor(branch.segments.length * progress);

      // Draw branch segments
      for (let i = 0; i < visibleSegments; i++) {
        const seg = branch.segments[i];
        
        ctx.strokeStyle = '#2d3748';
        ctx.lineWidth = seg.thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(seg.startX, seg.startY);
        ctx.lineTo(seg.endX, seg.endY);
        ctx.stroke();

        // Draw minimal leaves
        if (seg.leaves > 0 && progress > 0.7) {
          for (let j = 0; j < seg.leaves; j++) {
            const leafX = seg.endX + (Math.random() - 0.5) * 20;
            const leafY = seg.endY - Math.random() * 15;
            
            ctx.fillStyle = `rgba(45, 55, 72, ${0.6 + progress * 0.4})`;
            ctx.beginPath();
            ctx.ellipse(leafX, leafY, 8, 4, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    }

    animate();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}