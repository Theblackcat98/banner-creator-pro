
import React, { useRef } from 'react';
import { BannerSettings } from '../types';
import { useBannerCanvas } from '../hooks/useBannerCanvas';
import { Button } from './ui';

interface CanvasPreviewProps {
  settings: BannerSettings;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({ settings }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useBannerCanvas(canvasRef, settings);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'banner.png';
      link.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      link.click();
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 bg-[#282828]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#24292f]">Preview</h2>
        <Button onClick={handleDownload}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download PNG
        </Button>
      </div>
      <div className="flex-1 flex items-center justify-center bg-[141414] rounded-lg shadow-inner overflow-auto p-4">
        <canvas ref={canvasRef} className="max-w-full max-h-full" />
      </div>
       <div className="mt-4 text-center text-[#57606a]">
          <p>Canvas Dimensions: {settings.width}px &times; {settings.height}px</p>
      </div>
    </div>
  );
};