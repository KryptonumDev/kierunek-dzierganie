'use client'
import { useEffect } from "react";

const GlobalScript = () => {
  const handleTabKey = (e) => {
    (e.key === 'Tab') && document.documentElement.classList.add('tabbing')
  };
  const handleMouseDown = () => {
    document.documentElement.classList.remove('tabbing');
  };
  
  useEffect(() => {
    document.addEventListener('keydown', handleTabKey);
    window.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('keydown', handleTabKey);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
};

export default GlobalScript;