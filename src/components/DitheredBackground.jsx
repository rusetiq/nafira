import { useEffect, useRef } from 'react';

export default function DitheredBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Create dithered gradient effect
    const drawDither = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          
          // Create gradient from top to bottom
          const gradientValue = (y / canvas.height) * 255;
          
          // Add dither pattern
          const ditherThreshold = ((x % 4) + (y % 4) * 4) / 16;
          const dithered = gradientValue + (Math.random() - ditherThreshold) * 40;
          
          // Orange to dark gradient
          const r = Math.max(0, Math.min(255, 253 - dithered * 0.8));
          const g = Math.max(0, Math.min(255, 71 - dithered * 0.3));
          const b = Math.max(0, Math.min(255, 3 - dithered * 0.01));
          
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    drawDither();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-30"
      style={{ mixBlendMode: 'overlay' }}
    />
  );
}
