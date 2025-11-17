
import React from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, className }) => {
  return (
    <div className={`glitch-text ${className || ''}`} data-text={text}>
      {text}
    </div>
  );
};

export default GlitchText;
