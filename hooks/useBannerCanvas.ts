import React, { useEffect } from 'react';
import { BannerSettings } from '../types';
import { PREDEFINED_ICONS } from '../constants';

const PADDING = 40;
const loadedFonts = new Set<string>();

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
    ctx.fillStyle = settings.backgroundColor;
    ctx.strokeStyle = settings.outlineColor;
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

        ctx.fillStyle = settings.fontColor;
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
    const headerColor = '#30363d';
    const bodyColor = 'rgb(30, 30, 46)';
    const titleColor = 'rgb(205, 214, 244)';
    const bodyTextColor = 'rgb(205, 214, 244)';
    const localPadding = 15;

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

    const circleY = headerHeight / 2;
    const circleRadius = 6;
    ctx.fillStyle = 'rgb(255, 95, 86)';
    ctx.beginPath();
    ctx.arc(localPadding, circleY, circleRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgb(255, 189, 46)';
    ctx.beginPath();
    ctx.arc(localPadding + circleRadius * 2 + 5, circleY, circleRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgb(39, 201, 63)';
    ctx.beginPath();
    ctx.arc(localPadding + circleRadius * 4 + 10, circleY, circleRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = titleColor;
    ctx.font = `bold 14px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(windowTitle, width / 2, circleY);


    if (text) {
        ctx.font = `${fontSize}px "${fontFamily}"`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        const lines = text.split('\n');
        let currentY = headerHeight + localPadding;
        const prompt = '$ ';

        lines.forEach(line => {
            if (currentY > height - localPadding) return; 

            let fullLine = line;
            if (line.trim().length > 0 && !line.startsWith('#')) {
                fullLine = prompt + line;
            }
            
            ctx.fillStyle = bodyTextColor;
            if(line.startsWith('#')) {
              ctx.fillStyle = 'rgb(108, 112, 134)';
            }
            
            ctx.fillText(fullLine, localPadding, currentY);
            currentY += fontSize * 1.5;
        });
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