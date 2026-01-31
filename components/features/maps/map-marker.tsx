'use client';

import { useState } from 'react';

interface MapMarkerProps {
  lat: number;
  lng: number;
  color: string;
  size?: number;
  variant?: 'lab' | 'data-center' | 'manufacturer';
  onHover?: (hovered: boolean) => void;
  children?: React.ReactNode;
}

export function MapMarker({
  lat,
  lng,
  color,
  size = 8,
  variant = 'lab',
  onHover,
  children,
}: MapMarkerProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = (hovered: boolean) => {
    setIsHovered(hovered);
    onHover?.(hovered);
  };

  const getMarkerRadius = () => {
    switch (variant) {
      case 'data-center':
        return 5;
      case 'manufacturer':
        return 6;
      case 'lab':
      default:
        return 7;
    }
  };

  const isAnimated = variant === 'lab' && isHovered;

  return (
    <g
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      style={{ cursor: 'pointer' }}
    >
      {/* Outer glow for labs */}
      {variant === 'lab' && (
        <circle
          cx={0}
          cy={0}
          r={getMarkerRadius() + 4}
          fill={color}
          opacity={isHovered ? 0.3 : 0.15}
          style={{
            transition: 'opacity 0.2s ease',
          }}
        />
      )}

      {/* Pulse animation for announced status */}
      {isAnimated && (
        <circle
          cx={0}
          cy={0}
          r={getMarkerRadius()}
          fill={color}
          opacity={0.5}
          style={{
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      )}

      {/* Main marker circle */}
      <circle
        cx={0}
        cy={0}
        r={getMarkerRadius()}
        fill={color}
        opacity={isHovered ? 1 : 0.8}
        style={{
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Hover highlight */}
      {isHovered && (
        <circle
          cx={0}
          cy={0}
          r={getMarkerRadius() + 2}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          opacity={0.6}
        />
      )}

      {/* Label for labs */}
      {variant === 'lab' && isHovered && (
        <text
          x={0}
          y={-getMarkerRadius() - 8}
          textAnchor="middle"
          fontSize={11}
          fontWeight="bold"
          fill="currentColor"
          style={{
            pointerEvents: 'none',
            textShadow: '0 0 3px rgba(0,0,0,0.5)',
          }}
        >
          {children}
        </text>
      )}

      {/* SVG animation styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
            r: ${getMarkerRadius()};
          }
          50% {
            opacity: 0.2;
            r: ${getMarkerRadius() + 2};
          }
        }
      `}</style>
    </g>
  );
}
