import { useState, useEffect } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onLoadingComplete, externalProgress = null }) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const messages = [
    'Inicializando componentes...',
    'Cargando catálogo de productos...',
    'Preparando experiencia de usuario...',
    'Optimizando rendimiento...',
    '¡Listo para explorar!'
  ];

  useEffect(() => {
    // Si hay progreso externo, usarlo; sino simular
    if (externalProgress !== null) {
      setProgress(externalProgress);
    } else {
      const interval = setInterval(() => {
        setProgress(prev => {
          const increment = Math.random() * 15 + 5; // Entre 5-20% por iteración
          const newProgress = Math.min(prev + increment, 100);
          return newProgress;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [externalProgress]);

  useEffect(() => {
    // Cambiar mensaje según progreso
    if (progress < 25) {
      setCurrentMessage(0);
    } else if (progress < 50) {
      setCurrentMessage(1);
    } else if (progress < 75) {
      setCurrentMessage(2);
    } else if (progress < 95) {
      setCurrentMessage(3);
    } else {
      setCurrentMessage(4);
    }
  }, [progress]);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onLoadingComplete?.();
        }, 500); // Tiempo para la animación de salida
      }, 1000); // Mostrar "Listo" por 1 segundo

      return () => clearTimeout(timer);
    }
  }, [progress, onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className={`loading-screen ${!isVisible ? 'fade-out' : ''}`}>
      <div className="loading-container">
        <div className="logo-section">
          <h1 className="logo-text">
            Tecno<span className="logo-accent">Componentes</span>
          </h1>
          <p className="tagline">Componentes de alta tecnología</p>
        </div>
        
        <div className="circuit-container">
          <svg className="circuit-loader" viewBox="0 0 150 150">
            <defs>
              <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
            </defs>
            <path 
              className="circuit-path" 
              d="M20,20 L50,20 L50,50 L80,50 L80,80 L110,80 L110,110 L80,110 L80,80 L50,80 L50,110 L20,110 L20,80 L50,80 L50,50 L20,50 Z" 
              stroke="url(#circuitGradient)"
            />
            {/* Puntos de conexión animados */}
            <circle className="connection-point" cx="20" cy="20" r="3" />
            <circle className="connection-point" cx="50" cy="50" r="3" />
            <circle className="connection-point" cx="80" cy="80" r="3" />
            <circle className="connection-point" cx="110" cy="110" r="3" />
          </svg>
        </div>
        
        <div className="progress-section">
          <div className="progress-container">
            <div 
              className="progress-bar"
              style={{ width: `${progress}%` }}
            />
            <div className="progress-glow" style={{ left: `${progress}%` }} />
          </div>
          
          <div className="progress-info">
            <span className="progress-text">{Math.round(progress)}%</span>
            <span className="status-text">{messages[currentMessage]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
