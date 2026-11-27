import React, { createContext, useContext, useState, useEffect } from 'react';

interface BackgroundContextType {
  intensity: 'high' | 'medium' | 'low';
  setIntensity: (i: 'high' | 'medium' | 'low') => void;
  reducedMotion: boolean;
  setReducedMotion: (rm: boolean) => void;
}

const BackgroundContext = createContext<BackgroundContextType>({
  intensity: 'high',
  setIntensity: () => {},
  reducedMotion: false,
  setReducedMotion: () => {},
});

export const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [intensity, setIntensity] = useState<'high' | 'medium' | 'low'>(() => {
    return (localStorage.getItem('geoiq_bg_intensity') as any) || 'high';
  });

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return localStorage.getItem('geoiq_reduced_motion') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('geoiq_bg_intensity', intensity);
  }, [intensity]);

  useEffect(() => {
    localStorage.setItem('geoiq_reduced_motion', String(reducedMotion));
  }, [reducedMotion]);

  return (
    <BackgroundContext.Provider value={{ intensity, setIntensity, reducedMotion, setReducedMotion }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => useContext(BackgroundContext);
