import React from 'react';
import type { ProfileKind } from '~/types/api';

export interface ProfileDiagramProps {
  kind: ProfileKind;
  className?: string;
}

export const ProfileDiagram: React.FC<ProfileDiagramProps> = ({ kind, className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={`Cross-section diagram of ${kind} profile`}
    >
      <rect width="400" height="200" fill="#f8fafc" rx="8" />
      <path
        d="M20 180 H380"
        stroke="#cbd5e1"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      {renderProfilePath(kind)}
    </svg>
  );
};

function renderProfilePath(kind: ProfileKind) {
  switch (kind) {
    case 'longspan':
      return (
        <path
          d="M 30 140 L 70 140 L 100 60 L 150 60 L 180 140 L 220 140 L 250 60 L 300 60 L 330 140 L 370 140"
          stroke="#2563eb"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case 'corrugated':
      return (
        <path
          d="M 30 120 Q 65 50 100 120 T 170 120 T 240 120 T 310 120 T 370 120"
          stroke="#2563eb"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case 'step-tile':
      return (
        <path
          d="M 30 150 L 80 150 L 90 100 L 160 100 L 170 50 L 240 50 L 250 100 L 320 100 L 330 150 L 370 150"
          stroke="#2563eb"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case 'metcoppo':
      return (
        <path
          d="M 30 140 C 60 70 80 70 110 140 C 140 70 160 70 190 140 C 220 70 240 70 270 140 C 300 70 320 70 350 140 L 370 140"
          stroke="#2563eb"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case 'shingle':
      return (
        <path
          d="M 30 130 L 110 130 L 120 100 L 200 100 L 210 70 L 290 70 L 300 40 L 370 40"
          stroke="#2563eb"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case 'ridge':
      return (
        <path
          d="M 40 150 L 200 50 L 360 150"
          stroke="#2563eb"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case 'gutter':
      return (
        <path
          d="M 60 60 L 60 140 C 60 160 100 160 120 160 L 280 160 C 300 160 340 160 340 140 L 340 60"
          stroke="#2563eb"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case 'flashing':
    case 'trimmer':
      return (
        <path
          d="M 50 60 L 200 60 L 200 140 L 350 140"
          stroke="#2563eb"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case 'fastener':
      return (
        <g stroke="#2563eb" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="200" y1="40" x2="200" y2="160" />
          <path d="M 170 50 L 230 50 L 220 70 L 180 70 Z" fill="#2563eb" />
          <line x1="185" y1="90" x2="215" y2="105" />
          <line x1="185" y1="115" x2="215" y2="130" />
          <line x1="185" y1="140" x2="215" y2="155" />
        </g>
      );
    default:
      return (
        <path
          d="M 40 140 L 120 80 L 200 140 L 280 80 L 360 140"
          stroke="#2563eb"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
  }
}
