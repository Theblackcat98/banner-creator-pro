import React, { useRef, useEffect, useState } from 'react';
import { BannerSettings } from '../types';
import { useBannerCanvas } from '../hooks/useBannerCanvas';
import { Download } from 'lucide-react';
import { Button } from './ui';

interface CanvasPreviewProps {
  settings: BannerSettings;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({ settings }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useBannerCanvas(canvasRef, settings);

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'banner.png';
      link.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      link.click();
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 bg-[#282828]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#24292f]">Preview</h2>
        <button
          onClick={handleDownload}
          className="mt-4 px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] rounded-md flex items-center gap-2 text-sm font-medium transition-colors"
          disabled={isDownloading}
        >
          <Download className="w-4 h-4" />
          {isDownloading ? 'Downloading...' : 'Download Banner'}
        </button>
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