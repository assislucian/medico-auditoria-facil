
import React from 'react';
import { MEDCHECK_COLORS } from '../colors';
import { MedCheckLogo } from '../logo';

export const SocialMediaBanner: React.FC = () => (
  <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none">
    <rect width="1200" height="630" fill={MEDCHECK_COLORS.primary[50]} />
    <g transform="translate(300, 165)">
      <MedCheckLogo variant="full" size={300} />
    </g>
    <text 
      x="600" 
      y="500" 
      textAnchor="middle" 
      fontFamily="Inter"
      fontSize="36" 
      fill={MEDCHECK_COLORS.neutral[700]}
    >
      Análise Médica Inteligente
    </text>
  </svg>
);
