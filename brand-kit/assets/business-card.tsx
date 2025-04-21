
import React from 'react';
import { MEDCHECK_COLORS } from '../colors';
import { MedCheckLogo } from '../logo';

export const BusinessCard: React.FC = () => (
  <svg width="1050" height="600" viewBox="0 0 1050 600" fill="none">
    <rect width="1050" height="600" fill="white" />
    <rect width="1050" height="600" fill={MEDCHECK_COLORS.primary[50]} />
    <g transform="translate(50, 50)">
      <MedCheckLogo variant="horizontal" size={150} />
    </g>
    <line 
      x1="50" 
      y1="300" 
      x2="1000" 
      y2="300" 
      stroke={MEDCHECK_COLORS.neutral[300]} 
      strokeWidth="2" 
    />
    <text
      x="50"
      y="350"
      fontFamily="Inter"
      fontSize="24"
      fontWeight="bold"
      fill={MEDCHECK_COLORS.neutral[900]}
    >
      [Nome do Profissional]
    </text>
    <text
      x="50"
      y="390"
      fontFamily="Inter"
      fontSize="18"
      fill={MEDCHECK_COLORS.neutral[700]}
    >
      [Cargo]
    </text>
    <text
      x="50"
      y="450"
      fontFamily="Inter"
      fontSize="16"
      fill={MEDCHECK_COLORS.neutral[700]}
    >
      contato@medcheck.com.br
    </text>
    <text
      x="50"
      y="480"
      fontFamily="Inter"
      fontSize="16"
      fill={MEDCHECK_COLORS.neutral[700]}
    >
      www.medcheck.com.br
    </text>
  </svg>
);
