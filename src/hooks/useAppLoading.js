import { useState, useEffect } from 'react';

// 🎛️ CONFIGURACIÓN SIMPLE - Cambiar a true para habilitar el loading
const ENABLE_LOADING = false;

export const useAppLoading = () => {
  const [isLoading, setIsLoading] = useState(ENABLE_LOADING);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Si el loading está deshabilitado, terminar inmediatamente
    if (!ENABLE_LOADING) {
      setIsLoading(false);
      return;
    }

    // Lógica de carga cuando esté habilitado
    const loadResources = async () => {
      try {
        const resources = [
          // Fuentes
          new Promise(resolve => {
            const link = document.createElement('link');
            link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
            link.rel = 'stylesheet';
            link.onload = resolve;
            link.onerror = resolve;
            document.head.appendChild(link);
          }),
          
          // API inicial
          fetch('http://localhost:5000/api/clients/getproducts')
            .then(res => res.json())
            .catch(() => []),
          
          // Tiempo mínimo para UX
          new Promise(resolve => setTimeout(resolve, 2000)),
        ];

        // Progreso
        let completed = 0;
        const total = resources.length;

        const loadWithProgress = resources.map(async (promise, index) => {
          try {
            await promise;
          } catch (error) {
            console.warn(`Resource ${index} failed to load:`, error);
          } finally {
            completed++;
            setLoadingProgress((completed / total) * 100);
          }
        });

        await Promise.all(loadWithProgress);
        
        setTimeout(() => {
          setIsLoading(false);
        }, 500);

      } catch (error) {
        console.error('Error during app initialization:', error);
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      }
    };

    loadResources();
  }, []);

  return { isLoading, loadingProgress };
};
