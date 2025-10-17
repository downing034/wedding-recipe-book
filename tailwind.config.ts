import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // theme: {
  //   extend: {
  //     colors: {
  //       black: '#000',
  //       gray: {
  //         800: '#1f2937',
  //         900: '#111827',
  //       },
  //       blue: {
  //         300: '#93c5fd',
  //         400: '#60a5fa',
  //         500: '#3b82f6',
  //       },
  //       purple: {
  //         300: '#c4b5fd',
  //         400: '#a78bfa',
  //         500: '#8b5cf6',
  //         600: '#7c3aed',
  //       },
  //       fuchsia: {
  //         300: '#f9a8d4',
  //         400: '#f472b6',
  //         500: '#ec4899',
  //       },
  //       cyan: {
  //         300: '#67e8f9',
  //         400: '#22d3ee',
  //         500: '#06b6d4',
  //       },
  //     },
  //     boxShadow: {
  //       neon: '0 0 15px 3px rgba(236, 72, 153, 0.6)',
  //       'neon-blue': '0 0 8px 1px rgba(59, 130, 246, 0.3)',
  //       'neon-pink': '0 0 8px 1px rgba(236, 72, 153, 0.3)',
  //       'neon-cyan': '0 0 8px 1px rgba(6, 182, 212, 0.3)',
  //       'neon-purple': '0 0 10px 2px rgba(168, 85, 247, 0.4)',
  //     },
  //     animation: {
  //       pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  //       spin: 'spin 1s linear infinite',
  //     },
  //     keyframes: {
  //       pulse: {
  //         '0%, 100%': { opacity: '1' },
  //         '50%': { opacity: '0.7' },
  //       },
  //       spin: {
  //         '0%': { transform: 'rotate(0deg)' },
  //         '100%': { transform: 'rotate(360deg)' },
  //       },
  //     },
  //   },
  // },
  plugins: [],
};

export default config;