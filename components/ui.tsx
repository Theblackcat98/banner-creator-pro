
import React from 'react';

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


interface ColorPickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, id, value, onChange, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-[#8b949e]">
      {label}
    </label>
    <div className="mt-1 flex items-center rounded-md bg-[#0d1117] border border-[#30363d] focus-within:ring-1 focus-within:ring-[#58a6ff] focus-within:border-[#58a6ff]">
      <input
        id={id}
        value={value}
        onChange={onChange}
        {...props}
        className="w-full bg-transparent px-3 py-2 border-0 focus:outline-none sm:text-sm text-[#e6edf3]"
      />
      <div className="flex-shrink-0 pr-2">
        <input
          type="color"
          value={value}
          onChange={onChange}
          className="w-7 h-7 rounded border-none cursor-pointer bg-transparent"
          aria-label={`${label} color value`}
        />
      </div>
    </div>
  </div>
);