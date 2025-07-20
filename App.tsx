
import { useState } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { CanvasPreview } from './components/CanvasPreview';
import { BannerSettings } from './types';
import { DEFAULT_BANNER_SETTINGS } from './constants';

function App() {
  const [settings, setSettings] = useState<BannerSettings>(DEFAULT_BANNER_SETTINGS);

  const handleSettingsChange = (newSettings: Partial<BannerSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen font-sans bg-[#0d1117]">
      <ControlPanel settings={settings} onSettingsChange={handleSettingsChange} />
      <CanvasPreview settings={settings} />
    </div>
  );
}

export default App;