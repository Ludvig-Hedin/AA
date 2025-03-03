import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  // Don't render anything if password is empty
  if (password.length === 0) {
    return null;
  }

  // Password strength criteria
  const hasLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  // Calculate strength score (0-4)
  const getStrengthScore = (): number => {
    if (!password) return 0;
    
    let score = 0;
    if (hasLength) score++;
    if (hasUpperCase && hasLowerCase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;
    
    return score;
  };

  const score = getStrengthScore();

  // Determine color and label based on score
  const getStrengthColor = (): string => {
    switch (score) {
      case 0: return 'bg-gray-300 dark:bg-gray-600';
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-300 dark:bg-gray-600';
    }
  };

  const getStrengthLabel = (): string => {
    if (!password) return 'None';
    switch (score) {
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return 'None';
    }
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">Password strength:</span>
        <span className={`text-xs font-medium ${
          score === 0 ? 'text-gray-400' :
          score === 1 ? 'text-red-500' :
          score === 2 ? 'text-orange-500' :
          score === 3 ? 'text-yellow-500' :
          'text-green-500'
        }`}>
          {getStrengthLabel()}
        </span>
      </div>
      <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getStrengthColor()} transition-all duration-300 ease-in-out`}
          style={{ width: `${(score / 4) * 100}%` }}
        ></div>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className={`text-xs flex items-center ${hasLength ? 'text-green-500' : 'text-gray-400'}`}>
          <span className="material-icons text-sm mr-1">{hasLength ? 'check_circle' : 'remove_circle_outline'}</span>
          <span>8+ characters</span>
        </div>
        <div className={`text-xs flex items-center ${hasUpperCase && hasLowerCase ? 'text-green-500' : 'text-gray-400'}`}>
          <span className="material-icons text-sm mr-1">{hasUpperCase && hasLowerCase ? 'check_circle' : 'remove_circle_outline'}</span>
          <span>Upper & lowercase</span>
        </div>
        <div className={`text-xs flex items-center ${hasNumber ? 'text-green-500' : 'text-gray-400'}`}>
          <span className="material-icons text-sm mr-1">{hasNumber ? 'check_circle' : 'remove_circle_outline'}</span>
          <span>Number</span>
        </div>
        <div className={`text-xs flex items-center ${hasSpecialChar ? 'text-green-500' : 'text-gray-400'}`}>
          <span className="material-icons text-sm mr-1">{hasSpecialChar ? 'check_circle' : 'remove_circle_outline'}</span>
          <span>Special character</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator; 