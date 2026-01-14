
import React from 'react';

const SparklesIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 mr-2" }) => (
  <svg className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0ZM8.5 5.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm3 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm-3.5-5a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1Zm-2.5 3.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm9-3.5a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Z"/>
  </svg>
);

export default SparklesIcon;
