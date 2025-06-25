import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

/**
 * Renders text with mathematical expressions using KaTeX
 * Supports both inline math ($...$) and block math ($$...$$)
 * @param {string} text - The text containing mathematical expressions
 * @returns {Array} - Array of React elements and strings
 */
export function renderWithMath(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }

  // Handle block math first ($$...$$)
  const blockRegex = /\$\$(.+?)\$\$/gs;
  let parts = [];
  let lastIndex = 0;
  let match;

  while ((match = blockRegex.exec(text))) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    try {
      parts.push(<BlockMath key={`block-${match.index}`} math={match[1]} />);
    } catch (error) {
      console.error('KaTeX block math error:', error);
      parts.push(<span key={`block-${match.index}`} className="text-red-500">Math Error: {match[1]}</span>);
    }
    lastIndex = blockRegex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    text = text.slice(lastIndex);
  } else {
    text = '';
  }

  // Now handle inline math ($...$)
  const inlineRegex = /\$(.+?)\$/g;
  let finalParts = [];
  lastIndex = 0;
  
  while ((match = inlineRegex.exec(text))) {
    if (match.index > lastIndex) {
      finalParts.push(text.slice(lastIndex, match.index));
    }
    try {
      finalParts.push(<InlineMath key={`inline-${match.index}`} math={match[1]} />);
    } catch (error) {
      console.error('KaTeX inline math error:', error);
      finalParts.push(<span key={`inline-${match.index}`} className="text-red-500">Math Error: {match[1]}</span>);
    }
    lastIndex = inlineRegex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    finalParts.push(text.slice(lastIndex));
  }

  return [...parts, ...finalParts];
}

/**
 * Checks if text contains mathematical expressions
 * @param {string} text - The text to check
 * @returns {boolean} - True if text contains math expressions
 */
export function hasMathExpressions(text) {
  if (!text || typeof text !== 'string') {
    return false;
  }
  return /\$\$.*?\$\$|\$.*?\$/g.test(text);
}

/**
 * Processes common mathematical patterns and converts them to LaTeX
 * @param {string} text - The text to process
 * @returns {string} - Text with patterns converted to LaTeX
 */
export function processMathPatterns(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let processedText = text;

  // Convert common patterns to LaTeX
  const patterns = [
    // Exponents
    { regex: /\basquare\s+(\d+)\b/gi, replacement: 'a^{$1}' },
    { regex: /\b(\w+)\^(\d+)\b/g, replacement: '$1^{$2}' },
    { regex: /\b(\w+)\^(\w+)\b/g, replacement: '$1^{$2}' },
    
    // Subscripts
    { regex: /\b(\w+)_(\w+)\b/g, replacement: '$1_{$2}' },
    
    // Square roots
    { regex: /\bsqrt\s+(\w+)\b/gi, replacement: '\\sqrt{$1}' },
    
    // Fractions
    { regex: /\bfrac\s+(\w+)\s+(\w+)\b/gi, replacement: '\\frac{$1}{$2}' },
    
    // Greek letters
    { regex: /\bpi\b/gi, replacement: '\\pi' },
    { regex: /\btheta\b/gi, replacement: '\\theta' },
    { regex: /\balpha\b/gi, replacement: '\\alpha' },
    { regex: /\bbeta\b/gi, replacement: '\\beta' },
    { regex: /\bgamma\b/gi, replacement: '\\gamma' },
    { regex: /\bdelta\b/gi, replacement: '\\delta' },
    { regex: /\bsigma\b/gi, replacement: '\\sigma' },
    { regex: /\bomega\b/gi, replacement: '\\omega' },
    
    // Common mathematical symbols
    { regex: /\bint\b/gi, replacement: '\\int' },
    { regex: /\bsum\b/gi, replacement: '\\sum' },
    { regex: /\bprod\b/gi, replacement: '\\prod' },
    { regex: /\binfinity\b/gi, replacement: '\\infty' },
    { regex: /\bpartial\b/gi, replacement: '\\partial' },
    { regex: /\bnabla\b/gi, replacement: '\\nabla' },
  ];

  patterns.forEach(({ regex, replacement }) => {
    processedText = processedText.replace(regex, replacement);
  });

  return processedText;
}

/**
 * Renders text with automatic math pattern detection and conversion
 * @param {string} text - The text to render
 * @returns {Array} - Array of React elements and strings
 */
export function renderMathText(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }

  // First process common patterns
  const processedText = processMathPatterns(text);
  
  // Then render with math expressions
  return renderWithMath(processedText);
} 