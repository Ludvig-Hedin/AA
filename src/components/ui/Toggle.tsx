import React, { useState } from 'react';

interface ToggleProps {
  label?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  defaultChecked = false,
  onChange,
}) => {
  const [checked, setChecked] = useState(defaultChecked);
  
  const handleChange = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    if (onChange) {
      onChange(newChecked);
    }
  };
  
  return (
    <div className="flex items-center">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          checked ? 'bg-accent' : 'bg-muted'
        }`}
        onClick={handleChange}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      {label && (
        <span className="ml-3 text-sm">{label}</span>
      )}
    </div>
  );
}; 