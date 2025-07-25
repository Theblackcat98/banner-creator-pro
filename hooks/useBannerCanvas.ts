import React, { useEffect } from 'react';
import { BannerSettings, Gradient } from '../types';
import { PREDEFINED_ICONS } from '../constants';

const PADDING = 40;
const loadedFonts = new Set<string>();

const createGradient = (ctx: CanvasRenderingContext2D, gradient: Gradient, x0: number, y0: number, x1: number, y1: number) => {
  let canvasGradient: CanvasGradient;
  
  if (gradient.type === 'linear') {
    // Convert angle to radians and calculate gradient coordinates
    const angleRad = (gradient.angle * Math.PI) / 180;
    const centerX = (x0 + x1) / 2;
    const centerY = (y0 + y1) / 2;
    const length = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
    const dx = Math.cos(angleRad) * length;
    const dy = Math.sin(angleRad) * length;
    
    canvasGradient = ctx.createLinearGradient(
      centerX - dx / 2,
      centerY - dy / 2,
      centerX + dx / 2,
      centerY + dy / 2
    );
  } else {
    // Radial gradient
    const radius = Math.max(x1 - x0, y1 - y0) / 2;
    canvasGradient = ctx.createRadialGradient(
      (x0 + x1) / 2,
      (y0 + y1) / 2,
      0,
      (x0 + x1) / 2,
      (y0 + y1) / 2,
      radius
    );
  }
  
  // Add color stops
  gradient.stops.forEach(stop => {
    canvasGradient.addColorStop(stop.position / 100, stop.color);
  });
  
  return canvasGradient;
};

const getFillStyle = (ctx: CanvasRenderingContext2D, color: string | Gradient, x0: number, y0: number, x1: number, y1: number) => {
  if (typeof color === 'string') return color;
  return createGradient(ctx, color, x0, y0, x1, y1);
};

const loadGoogleFont = (fontFamily: string): Promise<void> => {
    if (!fontFamily || fontFamily.match(/^(sans-serif|serif|monospace|cursive)$/) || loadedFonts.has(fontFamily)) {
        return Promise.resolve();
    }

    const fontName = fontFamily.replace(/ /g, '+');
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;700&display=swap`;

    if (document.querySelector(`link[href="${fontUrl}"]`)) {
        return Promise.resolve();
    }
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontUrl;

    return new Promise((resolve, reject) => {
        link.onload = () => {
            loadedFonts.add(fontFamily);
            resolve();
        };
        link.onerror = () => {
            reject(new Error(`Failed to load font: ${fontFamily}`));
        }
        document.head.appendChild(link);
    });
};


const drawDefaultBanner = (ctx: CanvasRenderingContext2D, settings: BannerSettings) => {
    // --- Draw Background & Outline ---
    const bgFill = getFillStyle(ctx, settings.backgroundColor, 0, 0, settings.width, settings.height);
    const outlineFill = getFillStyle(ctx, settings.outlineColor, 0, 0, settings.width, settings.height);
    
    ctx.fillStyle = bgFill;
    ctx.strokeStyle = outlineFill;
    ctx.lineWidth = settings.outlineThickness;
    
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(0, 0, settings.width, settings.height, settings.cornerRadius);
    } else {
      ctx.rect(0, 0, settings.width, settings.height);
    }
    ctx.fill();
    if(settings.outlineThickness > 0) {
        ctx.save();
        ctx.clip();
        ctx.lineWidth = settings.outlineThickness * 2; 
        ctx.stroke();
        ctx.restore();
    }

    const drawIcon = (onIconDrawn: () => void) => {
        const svgString = settings.uploadedIconSvg || PREDEFINED_ICONS[settings.icon];
        if (!svgString) {
          onIconDrawn();
          return;
        };

        const img = new Image();
        img.onload = () => {
          const iconSize = Math.min(settings.width, settings.height) / 5;
          const x = (settings.width - iconSize) / 2;
          const y = (settings.height - iconSize) / 2;
          ctx.drawImage(img, x, y, iconSize, iconSize);
          onIconDrawn(); // Draw text after icon to ensure it's on top
        };
        img.onerror = () => {
          onIconDrawn(); // If icon fails to load, still draw the text
        }
        img.src = `data:image/svg+xml;base64,${btoa(svgString)}`;
    }

    const drawText = () => {
        if (!settings.text) return;

        const textFill = getFillStyle(ctx, settings.fontColor, 0, 0, settings.width, settings.height);
        ctx.fillStyle = textFill;
        ctx.font = `${settings.fontSize}px "${settings.fontFamily}"`;
        ctx.textAlign = settings.textAlign;
        ctx.textBaseline = 'middle';

        const lines = settings.text.split('\n');
        const lineHeight = settings.fontSize * 1.2;
        const totalTextHeight = lines.length * lineHeight;

        let x: number;
        switch (settings.textAlign) {
          case 'left':
            x = PADDING + settings.outlineThickness;
            break;
          case 'right':
            x = settings.width - PADDING - settings.outlineThickness;
            break;
          case 'center':
          default:
            x = settings.width / 2;
            break;
        }

        let startY: number;
        switch (settings.verticalAlign) {
          case 'top':
            startY = PADDING + settings.outlineThickness + (lineHeight / 2);
            break;
          case 'bottom':
            startY = settings.height - PADDING - settings.outlineThickness - totalTextHeight + (lineHeight / 2);
            break;
          case 'middle':
          default:
            startY = (settings.height / 2) - (totalTextHeight / 2) + (lineHeight / 2);
            break;
        }

        lines.forEach((line, index) => {
          const y = startY + index * lineHeight;
          ctx.fillText(line, x, y);
        });
    }
    
    const hasIcon = settings.uploadedIconSvg || (settings.icon && settings.icon !== 'none');
    if (hasIcon) {
      drawIcon(drawText);
    } else {
      drawText();
    }
};

const drawOSWindow = (ctx: CanvasRenderingContext2D, settings: BannerSettings) => {
    const { width, height, cornerRadius, text, windowTitle, fontSize, fontFamily } = settings;

    const headerHeight = 40;
    const localPadding = 20;
    
    // UI Colors for the terminal theme (Catppuccin Macchiato palette)
    const uiColors = {
        background: '#1E2030',     // Base background
        backgroundAlt: '#24273A',  // Slightly lighter background
        surface0: '#363A4F',       // Surface elements
        surface1: '#494D64',       // Hovered surface elements
        text: '#CAD3F5',           // Primary text
        textMuted: '#8087A2',      // Secondary text
        accent: '#8AADF4',         // Primary accent (blue)
        success: '#A6DA95',        // Success state (green)
        warning: '#EED49F',        // Warning state (yellow)
        error: '#ED8796',          // Error state (red)
        info: '#91D7E3'            // Info state (cyan)
    };
    
    // Theme colors using the UI colors
    const headerColor = uiColors.backgroundAlt;
    const bodyColor = uiColors.background;
    const titleColor = uiColors.text;
    let bodyTextColor = uiColors.text;
    let promptColor = uiColors.accent;

    ctx.fillStyle = headerColor;
    ctx.beginPath();
    if (ctx.roundRect) {
        ctx.roundRect(0, 0, width, height, cornerRadius);
    } else {
        ctx.rect(0, 0, width, height);
    }
    ctx.fill();

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    const bodyRadii = [0, 0, cornerRadius, cornerRadius];
    if(ctx.roundRect) {
        ctx.roundRect(0, headerHeight, width, height - headerHeight, bodyRadii);
    } else {
        ctx.rect(0, headerHeight, width, height - headerHeight);
    }
    ctx.fill();

    // Draw window controls with better styling
    const circleY = headerHeight / 2;
    const circleRadius = 6;
    const circleSpacing = circleRadius * 2 + 5;
    
    // Close button (red)
    const closeBtnX = localPadding;
    ctx.fillStyle = uiColors.error;
    ctx.beginPath();
    ctx.arc(closeBtnX, circleY, circleRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Add hover effect for close button
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(closeBtnX, circleY, circleRadius, 0, Math.PI * 2);
    ctx.fill();

    // Minimize button (yellow)
    const minimizeBtnX = closeBtnX + circleSpacing;
    ctx.fillStyle = uiColors.warning;
    ctx.beginPath();
    ctx.arc(minimizeBtnX, circleY, circleRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Add hover effect for minimize button
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(minimizeBtnX, circleY, circleRadius, 0, Math.PI * 2);
    ctx.fill();

    // Maximize button (green)
    const maximizeBtnX = minimizeBtnX + circleSpacing;
    ctx.fillStyle = uiColors.success;
    ctx.beginPath();
    ctx.arc(maximizeBtnX, circleY, circleRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Add hover effect for maximize button
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(maximizeBtnX, circleY, circleRadius, 0, Math.PI * 2);
    ctx.fill();

    // Window title
    ctx.fillStyle = titleColor;
    ctx.font = `bold 14px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(windowTitle, width / 2, circleY);

    // Terminal content
    if (text) {
        const lineHeight = fontSize * 1.2;
        let currentY = headerHeight + localPadding;
        
        // Draw prompt
        ctx.font = `bold ${fontSize}px "${fontFamily}"`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        // Draw command
        ctx.fillStyle = promptColor;
        ctx.fillText('❯', localPadding, currentY);
        
        ctx.fillStyle = bodyTextColor;
        ctx.fillText(' ' + text, localPadding + 20, currentY);
        currentY += lineHeight * 1.5;
        
        // System information to display
        const systemInfo: Array<{label: string, value: string}> = [
            { label: 'OS:', value: 'Linux' },
            { label: 'Host:', value: 'banner-creator' },
            { label: 'Kernel:', value: '6.1.0' },
            { label: 'Uptime:', value: '2h 30m' },
            { label: 'Shell:', value: 'zsh' },
            { label: 'Resolution:', value: '1920x1080' },
            { label: 'DE:', value: 'GNOME' },
            { label: 'WM:', value: 'Mutter' },
            { label: 'Theme:', value: 'Catppuccin' },
            { label: 'Terminal:', value: 'Alacritty' },
            { label: 'CPU:', value: 'CPU' },
            { label: 'GPU:', value: 'GPU' },
            { label: 'Memory:', value: '16GB' }
        ];

        // ASCII art to display
        const asciiArt: string[] = [
            '   /\\___/\\',
            '  /       \\',
            ' /  O   O  \\',
            '|           |',
            ' \\  \\___/  /',
            '  \\_______/'
        ];

        // Draw system info in a grid
        const gridX1 = localPadding;
        const gridX2 = width / 2;
        
        // Group system info into columns for better layout
        const infoColumns = [
            systemInfo.slice(0, 6),  // First column with 6 items
            systemInfo.slice(6, 12), // Second column with 6 items
            systemInfo.slice(12)     // Third column with remaining items
        ].filter(column => column.length > 0); // Remove empty columns
        
        // Update the color scheme for the terminal content
        bodyTextColor = uiColors.text;
        promptColor = uiColors.accent;
        
        // Set up the terminal font and styles
        const terminalFont = '13px "Fira Code", "Cascadia Code", "JetBrains Mono", monospace';
        ctx.font = terminalFont;
        
        // Calculate available height for ASCII art
        const asciiLineHeight = 16; // Slightly more space between lines
        const charWidth = 8;   // Approximate width of a monospace character
        const maxAsciiHeight = Math.min(asciiArt.length * asciiLineHeight, height - currentY - 120);
        const asciiScale = Math.min(1, asciiArt.length > 0 ? maxAsciiHeight / (asciiArt.length * asciiLineHeight) : 1);
        const scaledAsciiLineHeight = asciiLineHeight * asciiScale;
        
        // Calculate the maximum width for the ASCII art to prevent overflow
        const maxAsciiWidth = Math.min(
            asciiArt.length > 0 ? Math.max(...asciiArt.map((line: string) => line.length * charWidth)) : 0,
            gridX2 - gridX1 - 40 // Leave some margin on the right
        );
        
        // Draw ASCII art with scaling and proper alignment
        ctx.save();
        if (asciiScale < 1) {
            ctx.scale(asciiScale, asciiScale);
        }
        
        asciiArt.forEach((line, i) => {
            const y = (currentY + i * scaledAsciiLineHeight) / (asciiScale < 1 ? asciiScale : 1);
            if (y * (asciiScale < 1 ? asciiScale : 1) < height - localPadding) {
                // Draw with a subtle glow effect
                ctx.shadowColor = 'rgba(138, 173, 244, 0.3)';
                ctx.shadowBlur = 3;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                
                // Draw the text with the accent color
                ctx.fillStyle = uiColors.accent;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                
                // Truncate the line if it's too wide
                const maxChars = Math.floor(maxAsciiWidth / charWidth);
                const displayLine = line.length > maxChars ? line.substring(0, maxChars - 3) + '...' : line;
                
                // Draw the text
                ctx.fillText(displayLine, gridX1 / (asciiScale < 1 ? asciiScale : 1), y);
                
                // Reset shadow
                ctx.shadowColor = 'transparent';
            }
        });
        ctx.restore();
        
        // Draw system info in columns with improved styling
        const columnCount = Math.min(3, infoColumns.length);
        const columnGap = 30; // Increased gap between columns
        const totalGapWidth = (columnCount - 1) * columnGap;
        const columnWidth = (gridX2 - gridX1 - totalGapWidth) / columnCount;
        const rowHeight = 20; // Slightly more space between rows
        
        // Initialize currentY for the first column
        let currentColumnY = currentY + (asciiArt.length > 0 ? asciiArt.length * scaledAsciiLineHeight + 20 : 20);
        
        // Calculate the maximum label width for alignment
        ctx.font = 'bold 12px "Fira Code", "Cascadia Code", "JetBrains Mono", monospace';
        let maxLabelWidth = 0;
        systemInfo.forEach(info => {
            const metrics = ctx.measureText(info.label);
            if (metrics.width > maxLabelWidth) {
                maxLabelWidth = metrics.width;
            }
        });
        maxLabelWidth = Math.min(maxLabelWidth, 120); // Cap the max label width
        
        // Draw each column
        infoColumns.forEach((column: Array<{label: string, value: string, icon?: string, color?: string}>, colIndex: number) => {
            const columnX = gridX1 + colIndex * (columnWidth + columnGap);
            let currentY = currentColumnY;
            
            // Draw column background with subtle border
            if (column.length > 0) {
                const columnHeight = column.length * rowHeight + 10;
                
                // Draw a subtle background for the column
                ctx.fillStyle = `${uiColors.surface0}80`; // 50% opacity
                const bgRadius = 6;
                ctx.beginPath();
                ctx.moveTo(columnX - 5 + bgRadius, currentY - 5);
                ctx.arcTo(columnX - 5 + columnWidth + 10, currentY - 5, 
                         columnX - 5 + columnWidth + 10, currentY + columnHeight + 5, bgRadius);
                ctx.arcTo(columnX - 5 + columnWidth + 10, currentY + columnHeight + 5, 
                         columnX - 5, currentY + columnHeight + 5, bgRadius);
                ctx.arcTo(columnX - 5, currentY + columnHeight + 5, 
                         columnX - 5, currentY - 5, bgRadius);
                ctx.arcTo(columnX - 5, currentY - 5, 
                         columnX - 5 + columnWidth + 10, currentY - 5, bgRadius);
                ctx.closePath();
                ctx.fill();
            }
            
            // Draw each info item in the column
            column.forEach((info) => {
                // Set up text styles
                ctx.font = 'bold 12px "Fira Code", "Cascadia Code", "JetBrains Mono", monospace';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                
                // Draw label with fixed width for alignment
                const labelX = columnX;
                const labelText = `${info.label}`;
                
                // Draw the label
                ctx.fillStyle = uiColors.textMuted || '#8087A2';
                ctx.fillText(labelText, labelX, currentY);
                
                // Draw the value with a different color
                ctx.font = '12px "Fira Code", "Cascadia Code", "JetBrains Mono", monospace';
                
                // Calculate the x position for the value (right-aligned with some padding)
                const valueX = columnX + maxLabelWidth + 15;
                
                // Truncate value if it's too long
                const maxValueWidth = columnX + columnWidth - valueX - 5;
                let displayValue = info.value;
                const valueMetrics = ctx.measureText(displayValue);
                
                if (valueMetrics.width > maxValueWidth) {
                    // Find the maximum number of characters that fit
                    let chars = displayValue.length;
                    while (chars > 0 && ctx.measureText(displayValue.substring(0, chars) + '...').width > maxValueWidth) {
                        chars--;
                    }
                    if (chars > 3) {
                        displayValue = displayValue.substring(0, chars - 3) + '...';
                    } else {
                        displayValue = '...';
                    }
                }
                
                // Draw the value text
                ctx.fillStyle = uiColors.text || '#CAD3F5';
                ctx.fillText(displayValue, valueX, currentY);
                
                // Move to the next line
                currentY += rowHeight;
            });
        });
        
        // Draw cursor

        if (currentY < height - localPadding) {
            ctx.fillStyle = promptColor;
            ctx.fillText('❯', localPadding, currentY);
            
            // Blinking cursor
            ctx.fillStyle = 'rgba(203, 166, 247, 0.8)';
            ctx.fillRect(localPadding + 20, currentY + 5, 10, 2);
        }
    }
};


export const useBannerCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  settings: BannerSettings
) => {
  useEffect(() => {
    const drawCanvas = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      try {
        await loadGoogleFont(settings.fontFamily);
        await document.fonts.load(`${settings.fontSize}px "${settings.fontFamily}"`);
      } catch(e) {
        console.error(e);
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set canvas dimensions
      canvas.width = settings.width;
      canvas.height = settings.height;

      if (settings.theme === 'os-window') {
          drawOSWindow(ctx, settings);
      } else {
          drawDefaultBanner(ctx, settings);
      }
    };
    
    drawCanvas();
  }, [settings, canvasRef]);
};