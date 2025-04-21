
import React from 'react';
import { MEDCHECK_COLORS } from './colors';

interface LogoProps {
  variant?: 'full' | 'icon';
  size?: number;
  color?: string;
}

export const MedCheckLogo: React.FC<LogoProps> = ({
  variant = 'full', 
  size = 120, 
  color = MEDCHECK_COLORS.primary[500]
}) => {
  const iconOnly = (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 500 500" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M250 50C141.45 50 55 136.45 55 245C55 353.55 141.45 440 250 440C358.55 440 445 353.55 445 245C445 136.45 358.55 50 250 50ZM314.5 330.5C305.5 339.5 292 339.5 283 330.5L250 297.5L216.5 330.5C207.5 339.5 194 339.5 185 330.5C176 321.5 176 308 185 299L218.5 266L185 233C176 224 176 210.5 185 201.5C194 192.5 207.5 192.5 216.5 201.5L250 235L283 201.5C292 192.5 305.5 192.5 314.5 201.5C323.5 210.5 323.5 224 314.5 233L281 266L314.5 299C323.5 308 323.5 321.5 314.5 330.5Z" 
        fill={color}
      />
    </svg>
  );

  const fullLogo = (
    <svg 
      width={size * 3} 
      height={size} 
      viewBox="0 0 1500 500" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {iconOnly}
      <text 
        x="500" 
        y="350" 
        fontFamily="Inter" 
        fontSize="300" 
        fontWeight="bold" 
        fill={color}
      >
        MedCheck
      </text>
    </svg>
  );

  return variant === 'icon' ? iconOnly : fullLogo;
};
