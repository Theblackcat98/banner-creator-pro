
import React, { useState, useRef, useEffect } from 'react';
import { Gradient, ColorStop } from '../types';
import { GRADIENT_PRESETS } from '../constants';
import { Plus, X, ArrowDown, ArrowUp } from 'lucide-react';

const baseInputStyles = "mt-1 block w-full bg-[#0d1117] border border-[#30363d] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#58a6ff] focus:border-[#58a6ff] sm:text-sm text-[#e6edf3]";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-[#8b949e]">
      {label}
    </label>
    <input id={id} {...props} className={baseInputStyles} />
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-[#8b949e]">
      {label}
    </label>
    <select id={id} {...props} className={baseInputStyles}>
      {children}
    </select>
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const primaryStyles = "bg-[#238636] hover:bg-[#2ea043] focus:ring-[#2ea043] text-white";
  const secondaryStyles = "bg-[#21262d] hover:bg-[#30363d] focus:ring-[#30363d] text-[#c9d1d9]";
  
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#161b22] transition-colors ${variant === 'primary' ? primaryStyles : secondaryStyles}`}
    >
      {children}
    </button>
  );
};


interface ColorPickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGradientChange?: (gradient: Gradient) => void;
  gradientValue?: Gradient;
  showGradientPicker?: boolean;
}

const GradientPreview: React.FC<{ gradient: Gradient; className?: string }> = ({ gradient, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const gradientObj = gradient.type === 'linear'
      ? ctx.createLinearGradient(0, 0, canvas.width, 0)
      : ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2);
    
    gradient.stops.forEach(stop => {
      gradientObj.addColorStop(stop.position / 100, stop.color);
    });
    
    ctx.fillStyle = gradientObj;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [gradient]);
  
  return (
    <div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
      <canvas 
        ref={canvasRef} 
        width={100} 
        height={24} 
        className="w-full h-6 rounded border border-[#30363d]"
      />
    </div>
  );
};

export const GradientPicker: React.FC<{
  value: Gradient;
  onChange: (gradient: Gradient) => void;
  className?: string;
}> = ({ value, onChange, className = '' }) => {
  const [selectedStopIndex, setSelectedStopIndex] = useState(0);
  const selectedStop = value.stops[selectedStopIndex];
  
  const handleAddStop = () => {
    const newStop: ColorStop = {
      color: '#ffffff',
      position: selectedStop ? Math.min(100, selectedStop.position + 10) : 50
    };
    
    const newStops = [...value.stops, newStop].sort((a, b) => a.position - b.position);
    onChange({
      ...value,
      stops: newStops
    });
    setSelectedStopIndex(newStops.length - 1);
  };
  
  const handleRemoveStop = () => {
    if (value.stops.length <= 2) return;
    
    const newStops = value.stops.filter((_, i) => i !== selectedStopIndex);
    onChange({
      ...value,
      stops: newStops
    });
    setSelectedStopIndex(Math.min(selectedStopIndex, newStops.length - 1));
  };
  
  const updateStop = (index: number, updates: Partial<ColorStop>) => {
    const newStops = [...value.stops];
    newStops[index] = { ...newStops[index], ...updates };
    
    // Ensure positions are in order
    newStops.sort((a, b) => a.position - b.position);
    
    onChange({
      ...value,
      stops: newStops
    });
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <Select
          label="Gradient Type"
          value={value.type}
          onChange={(e) => onChange({
            ...value,
            type: e.target.value as 'linear' | 'radial'
          })}
        >
          <option value="linear">Linear</option>
          <option value="radial">Radial</option>
        </Select>
        
        {value.type === 'linear' && (
          <div className="flex-1">
            <label className="block text-sm font-medium text-[#8b949e] mb-1">
              Angle
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="360"
                value={value.angle}
                onChange={(e) => onChange({
                  ...value,
                  angle: parseInt(e.target.value)
                })}
                className="flex-1"
              />
              <span className="text-sm text-[#8b949e] w-10 text-right">
                {value.angle}°
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-[#8b949e]">
            Color Stops
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleAddStop}
              className="text-xs px-2 py-1 bg-[#21262d] hover:bg-[#30363d] rounded text-[#c9d1d9]"
            >
              Add Stop
            </button>
            {value.stops.length > 2 && (
              <button
                type="button"
                onClick={handleRemoveStop}
                className="text-xs px-2 py-1 bg-[#21262d] hover:bg-[#30363d] rounded text-[#c9d1d9]"
              >
                Remove
              </button>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          {value.stops.map((stop, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="color"
                value={stop.color}
                onChange={(e) => updateStop(index, { color: e.target.value })}
                className="w-8 h-8 rounded border border-[#30363d] cursor-pointer"
              />
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stop.position}
                  onChange={(e) => updateStop(index, { position: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <span className="text-xs text-[#8b949e] w-10 text-right">
                {stop.position}%
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="pt-2">
        <label className="block text-sm font-medium text-[#8b949e] mb-1">
          Preview
        </label>
        <GradientPreview gradient={value} className="h-8" />
      </div>
    </div>
  );
};

const GradientStopEditor: React.FC<{
  stop: ColorStop;
  index: number;
  totalStops: number;
  onChange: (stop: ColorStop) => void;
  onRemove: () => void;
  onMove: (direction: 'up' | 'down') => void;
}> = ({ stop, index, totalStops, onChange, onRemove, onMove }) => (
  <div className="flex items-center space-x-2 mb-2">
    <input
      type="color"
      value={stop.color}
      onChange={(e) => onChange({ ...stop, color: e.target.value })}
      className="w-8 h-8 rounded border border-[#30363d] bg-transparent cursor-pointer"
      aria-label={`Color stop ${index + 1}`}
    />
    <div className="flex-1">
      <div className="relative h-2 bg-[#0d1117] rounded-full overflow-hidden">
        <div 
          className="absolute top-0 bottom-0 left-0 right-0"
          style={{
            background: `linear-gradient(to right, ${stop.color} 0%, ${stop.color} 100%)`,
            opacity: 0.5
          }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={stop.position}
          onChange={(e) => onChange({ ...stop, position: Number(e.target.value) })}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          aria-label={`Position for color stop ${index + 1}`}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm"
          style={{
            left: `${stop.position}%`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: stop.color,
          }}
        />
      </div>
      <div className="text-xs text-[#8b949e] mt-1 flex justify-between">
        <span>{stop.position}%</span>
        <span>{stop.color.toUpperCase()}</span>
      </div>
    </div>
    <div className="flex flex-col space-y-1">
      <button
        type="button"
        onClick={() => onMove('up')}
        disabled={index === 0}
        className="p-1 rounded hover:bg-[#30363d] disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Move stop up"
      >
        <ArrowUp size={14} />
      </button>
      <button
        type="button"
        onClick={() => onMove('down')}
        disabled={index === totalStops - 1}
        className="p-1 rounded hover:bg-[#30363d] disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Move stop down"
      >
        <ArrowDown size={14} />
      </button>
    </div>
    <button
      type="button"
      onClick={onRemove}
      disabled={totalStops <= 2}
      className="p-1 rounded hover:bg-[#30363d] text-[#8b949e] disabled:opacity-30 disabled:cursor-not-allowed"
      aria-label="Remove stop"
    >
      <X size={14} />
    </button>
  </div>
);

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  id,
  value,
  onChange,
  onGradientChange,
  gradientValue,
  showGradientPicker = false,
  ...props
}) => {
  const [isGradient, setIsGradient] = useState(!!gradientValue);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localGradient, setLocalGradient] = useState<Gradient>(
    gradientValue || {
      type: 'linear',
      angle: 90,
      stops: [
        { color: value || '#000000', position: 0 },
        { color: value || '#000000', position: 100 }
      ]
    }
  );

  // Sync local gradient when prop changes
  useEffect(() => {
    if (gradientValue) {
      setLocalGradient(gradientValue);
      setIsGradient(true);
    }
  }, [gradientValue]);

  // Handle solid color changes
  const handleSolidColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isGradient) {
      onChange(e);
    }
  };

  // Handle gradient stop color change
  const handleGradientStopChange = (index: number, stop: ColorStop) => {
    const newStops = [...localGradient.stops];
    newStops[index] = stop;
    const newGradient = { ...localGradient, stops: newStops };
    setLocalGradient(newGradient);
    onGradientChange?.(newGradient);
  };

  // Add a new gradient stop
  const addGradientStop = () => {
    if (localGradient.stops.length >= 5) return;
    
    const newStop = {
      color: localGradient.stops[localGradient.stops.length - 1].color,
      position: 100
    };
    
    const newStops = [...localGradient.stops, newStop];
    const newGradient = { ...localGradient, stops: newStops };
    setLocalGradient(newGradient);
    onGradientChange?.(newGradient);
  };

  // Remove a gradient stop
  const removeGradientStop = (index: number) => {
    if (localGradient.stops.length <= 2) return;
    
    const newStops = localGradient.stops.filter((_, i) => i !== index);
    const newGradient = { ...localGradient, stops: newStops };
    setLocalGradient(newGradient);
    onGradientChange?.(newGradient);
  };

  // Move a gradient stop up or down
  const moveGradientStop = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === localGradient.stops.length - 1)
    ) {
      return;
    }

    const newStops = [...localGradient.stops];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newStops[index], newStops[newIndex]] = [newStops[newIndex], newStops[index]];
    
    const newGradient = { ...localGradient, stops: newStops };
    setLocalGradient(newGradient);
    onGradientChange?.(newGradient);
  };

  // Toggle between solid and gradient
  const toggleGradient = () => {
    if (isGradient) {
      setIsGradient(false);
      onChange?.({ target: { value: localGradient.stops[0]?.color || '#000000' } } as any);
    } else {
      setIsGradient(true);
      const newGradient = {
        type: 'linear' as const,
        angle: 90,
        stops: [
          { color: value || '#000000', position: 0 },
          { color: value || '#000000', position: 100 }
        ]
      };
      setLocalGradient(newGradient);
      onGradientChange?.(newGradient);
    }
  };

  // Handle gradient angle change
  const handleAngleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const angle = parseInt(e.target.value, 10);
    const newGradient = { ...localGradient, angle };
    setLocalGradient(newGradient);
    onGradientChange?.(newGradient);
  };

  // Handle gradient type change
  const handleTypeChange = (type: 'linear' | 'radial') => {
    const newGradient = { ...localGradient, type };
    setLocalGradient(newGradient);
    onGradientChange?.(newGradient);
  };

  // Handle preset selection
  const handlePresetSelect = (preset: Gradient) => {
    const newGradient = JSON.parse(JSON.stringify(preset));
    setLocalGradient(newGradient);
    onGradientChange?.(newGradient);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="block text-sm font-medium text-[#8b949e]">
          {label}
        </label>
        {onGradientChange && (
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className={`text-xs px-2 py-1 rounded ${
                !isGradient 
                  ? 'bg-[#58a6ff] text-white' 
                  : 'bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d]'
              }`}
              onClick={toggleGradient}
            >
              {isGradient ? 'Solid' : 'Gradient'}
            </button>
            {isGradient && (
              <button
                type="button"
                className={`text-xs px-2 py-1 rounded ${
                  showAdvanced 
                    ? 'bg-[#58a6ff] text-white' 
                    : 'bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d]'
                }`}
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? 'Simple' : 'Advanced'}
              </button>
            )}
          </div>
        )}
      </div>
      
      {isGradient ? (
        <div className="mt-2 space-y-3">
          {/* Gradient Preview */}
          <div 
            className="relative h-10 rounded-md border border-[#30363d] overflow-hidden cursor-pointer"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <GradientPreview gradient={localGradient} className="w-full h-full" />
            {!showAdvanced && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white/80 text-xs font-medium">
                Click to edit gradient
              </div>
            )}
          </div>

          {showAdvanced && (
            <div className="space-y-3">
              {/* Gradient Type Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#8b949e]">Type</span>
                <div className="inline-flex rounded-md shadow-sm">
                  <button
                    type="button"
                    className={`px-3 py-1 text-xs font-medium rounded-l-md ${
                      localGradient.type === 'linear' 
                        ? 'bg-[#58a6ff] text-white' 
                        : 'bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d]'
                    }`}
                    onClick={() => handleTypeChange('linear')}
                  >
                    Linear
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1 text-xs font-medium rounded-r-md ${
                      localGradient.type === 'radial' 
                        ? 'bg-[#58a6ff] text-white' 
                        : 'bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d]'
                    }`}
                    onClick={() => handleTypeChange('radial')}
                  >
                    Radial
                  </button>
                </div>
              </div>

              {/* Angle Control */}
              {localGradient.type === 'linear' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-[#8b949e]">Angle</span>
                    <span className="text-xs text-[#8b949e]">{localGradient.angle}°</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={localGradient.angle}
                      onChange={handleAngleChange}
                      className="w-full h-2 bg-[#0d1117] rounded-lg appearance-none cursor-pointer"
                    />
                    <div 
                      className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#8b949e] to-transparent pointer-events-none"
                      style={{
                        background: `linear-gradient(to right, transparent, #8b949e)`,
                        transform: 'rotate(0deg)'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Gradient Stops */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-[#8b949e]">Color Stops</span>
                  <button
                    type="button"
                    onClick={addGradientStop}
                    disabled={localGradient.stops.length >= 5}
                    className="text-xs px-2 py-1 bg-[#21262d] hover:bg-[#30363d] rounded text-[#c9d1d9] disabled:opacity-30 disabled:cursor-not-allowed flex items-center"
                  >
                    <Plus size={12} className="mr-1" /> Add Stop
                  </button>
                </div>
                <div className="space-y-2">
                  {localGradient.stops.map((stop, index) => (
                    <GradientStopEditor
                      key={index}
                      stop={stop}
                      index={index}
                      totalStops={localGradient.stops.length}
                      onChange={(updatedStop) => handleGradientStopChange(index, updatedStop)}
                      onRemove={() => removeGradientStop(index)}
                      onMove={(direction) => moveGradientStop(index, direction)}
                    />
                  ))}
                </div>
              </div>

              {/* Presets */}
              <div>
                <div className="text-sm font-medium text-[#8b949e] mb-2">Presets</div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(GRADIENT_PRESETS).map(([name, preset]) => (
                    <button
                      key={name}
                      type="button"
                      className="relative h-8 rounded border border-[#30363d] overflow-hidden group"
                      onClick={() => handlePresetSelect(preset)}
                      title={name}
                    >
                      <GradientPreview gradient={preset} className="w-full h-full" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-1 flex items-center rounded-md bg-[#0d1117] border border-[#30363d] focus-within:ring-1 focus-within:ring-[#58a6ff] focus-within:border-[#58a6ff]">
          <input
            id={id}
            value={value}
            onChange={handleSolidColorChange}
            {...props}
            className="w-full bg-transparent px-3 py-2 border-0 focus:outline-none sm:text-sm text-[#e6edf3]"
          />
          <div className="flex-shrink-0 pr-2">
            <input
              type="color"
              value={value}
              onChange={handleSolidColorChange}
              className="w-7 h-7 rounded border-none cursor-pointer bg-transparent"
              aria-label={`${label} color value`}
            />
          </div>
        </div>
      )}
    </div>
  );
};