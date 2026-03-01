import confetti from 'canvas-confetti';

export const useConfetti = () => {
  const celebrationTypes = [
    () => confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }),
    
    () => {
      const duration = 2000;
      const end = Date.now() + duration;
      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff0000', '#00ff00', '#0000ff']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff0000', '#00ff00', '#0000ff']
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      }());
    },
    
    () => {
      const count = 200;
      const defaults = { origin: { y: 0.7 } };
      
      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }
      
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    },
    
    () => {
      const scalar = 2;
      const emoji = confetti.shapeFromText({ text: '🎉', scalar });
      confetti({
        shapes: [emoji],
        particleCount: 40,
        spread: 100,
        scalar
      });
    }
  ];

  const triggerCelebration = () => {
    const randomCelebration = celebrationTypes[Math.floor(Math.random() * celebrationTypes.length)];
    randomCelebration();
  };

  return { triggerCelebration };
};