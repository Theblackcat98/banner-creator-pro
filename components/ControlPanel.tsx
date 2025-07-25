import React from 'react';
import { BannerSettings, Gradient } from '../types';
import { HORIZONTAL_ALIGN_OPTIONS, VERTICAL_ALIGN_OPTIONS, PREDEFINED_ICONS } from '../constants';
import { Upload } from 'lucide-react';
import { Input, Select, ColorPicker } from './ui';

interface ControlPanelProps {
  settings: BannerSettings;
  onSettingsChange: (newSettings: Partial<BannerSettings>) => void;
}

const ControlSection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <fieldset className="border-t border-[#30363d] p-6">
        <legend className="-ml-1 px-1 text-lg font-semibold text-[#e6edf3]">{title}</legend>
        <div className="grid grid-cols-1 gap-6">{children}</div>
    </fieldset>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({ settings, onSettingsChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    let processedValue: string | number = value;
    if (type === 'number') {
      processedValue = value === '' ? 0 : parseInt(value, 10);
      if (isNaN(processedValue)) processedValue = 0;
    }
    onSettingsChange({ [name]: processedValue });
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const colorKey = name as 'backgroundColor' | 'outlineColor' | 'fontColor';
    
    // Get the current value from settings
    const currentValue = settings[colorKey];
    
    // Check if it's a gradient
    if (typeof currentValue !== 'string' && 'stops' in currentValue) {
      // It's a gradient, update the first stop
      const gradient = {
        ...currentValue,
        stops: [...currentValue.stops]
      };
      
      if (gradient.stops.length > 0) {
        gradient.stops[0] = { ...gradient.stops[0], color: value };
        onSettingsChange({ [name]: gradient });
      }
    } else {
      // It's a solid color, update directly
      onSettingsChange({ [name]: value });
    }
  };

  const handleGradientChange = (name: 'backgroundColor' | 'outlineColor' | 'fontColor', gradient: Gradient) => {
    onSettingsChange({ [name]: gradient });
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const svgContent = event.target?.result as string;
        onSettingsChange({ uploadedIconSvg: svgContent, icon: 'none' });
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid SVG file.');
    }
  };

  return (
    <div className="w-full md:w-96 bg-[#161b22] flex-shrink-0 overflow-y-auto">
      <div className="p-6">
          <h2 className="text-2xl font-bold text-[#e6edf3]">Banner Settings</h2>
          <p className="text-sm text-[#8b949e] mt-1">Adjust the properties to design your banner.</p>
      </div>

      <ControlSection title="Style">
          <Select label="Theme" name="theme" value={settings.theme} onChange={handleChange}>
              <option value="default">Default</option>
              <option value="os-window">OS Window</option>
          </Select>
          {settings.theme === 'os-window' && (
              <Input label="Window Title" type="text" name="windowTitle" value={settings.windowTitle} onChange={handleChange} />
          )}
      </ControlSection>

      <ControlSection title="Canvas">
        <div className="grid grid-cols-2 gap-4">
            <Input label="Width (px)" type="number" name="width" value={settings.width} onChange={handleChange} min="100" max="2000" />
            <Input label="Height (px)" type="number" name="height" value={settings.height} onChange={handleChange} min="100" max="2000" />
        </div>
        <Input label="Corner Radius (px)" type="number" name="cornerRadius" value={settings.cornerRadius} onChange={handleChange} min="0" max="200" />
        {settings.theme === 'default' && (
            <ColorPicker 
            label="Background Color" 
            name="backgroundColor" 
            value={typeof settings.backgroundColor === 'string' ? settings.backgroundColor : settings.backgroundColor.stops[0]?.color || '#000000'} 
            onChange={handleColorChange}
            onGradientChange={(gradient) => handleGradientChange('backgroundColor', gradient)}
            gradientValue={typeof settings.backgroundColor !== 'string' ? settings.backgroundColor : undefined}
            showGradientPicker
          />
        )}
      </ControlSection>
      
      {settings.theme === 'default' && (
        <>
          <ControlSection title="Outline">
            <ColorPicker 
              label="Color" 
              name="outlineColor" 
              value={typeof settings.outlineColor === 'string' ? settings.outlineColor : settings.outlineColor.stops[0]?.color || '#000000'} 
              onChange={handleColorChange}
              onGradientChange={(gradient) => handleGradientChange('outlineColor', gradient)}
              gradientValue={typeof settings.outlineColor !== 'string' ? settings.outlineColor : undefined}
              showGradientPicker
            />
            <Input label="Thickness (px)" type="number" name="outlineThickness" value={settings.outlineThickness} onChange={handleChange} min="0" max="50" />
          </ControlSection>

          <ControlSection title="Icon">
              <Select label="Predefined" name="icon" value={settings.icon} onChange={(e) => onSettingsChange({ icon: e.target.value, uploadedIconSvg: null })}>
                  {Object.keys(PREDEFINED_ICONS).map(key => <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>)}
              </Select>
              <div>
                  <label className="block text-sm font-medium text-[#8b949e] mb-1">Upload Custom SVG</label>
                  <label className="flex items-center justify-center px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] rounded-md cursor-pointer text-sm font-medium">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                      <input type="file" accept="image/svg+xml" onChange={handleIconUpload} className="hidden" />
                  </label>
              </div>
          </ControlSection>
        </>
      )}

      <ControlSection title="Text">
        <div>
          <label htmlFor="text-content" className="block text-sm font-medium text-[#8b949e]">
            Content
          </label>
          <textarea
            id="text-content"
            name="text"
            value={settings.text}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full bg-[#0d1117] border border-[#30363d] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#58a6ff] focus:border-[#58a6ff] sm:text-sm text-[#e6edf3]"
          />
        </div>
        <Input label="Size (px)" type="number" name="fontSize" value={settings.fontSize} onChange={handleChange} min="1" />
        {settings.theme === 'default' && (
          <>
            <ColorPicker 
              label="Color" 
              name="fontColor" 
              value={typeof settings.fontColor === 'string' ? settings.fontColor : settings.fontColor.stops[0]?.color || '#000000'} 
              onChange={handleColorChange}
              onGradientChange={(gradient) => handleGradientChange('fontColor', gradient)}
              gradientValue={typeof settings.fontColor !== 'string' ? settings.fontColor : undefined}
              showGradientPicker
            />
            <Input label="Google Font" type="text" name="fontFamily" value={settings.fontFamily} onChange={handleChange} placeholder="e.g. Roboto"/>
            <div className="grid grid-cols-2 gap-4">
                <Select label="Horizontal Align" name="textAlign" value={settings.textAlign} onChange={handleChange}>
                    {HORIZONTAL_ALIGN_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </Select>
                <Select label="Vertical Align" name="verticalAlign" value={settings.verticalAlign} onChange={handleChange}>
                    {VERTICAL_ALIGN_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </Select>
            </div>
          </>
        )}
      </ControlSection>
    </div>
  );
};