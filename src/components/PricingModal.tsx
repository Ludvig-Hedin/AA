import React, { useState } from 'react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const [annualBilling, setAnnualBilling] = useState(true);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-[#1A1B1C] rounded-xl shadow-xl max-w-6xl w-11/12 max-h-[90vh] overflow-y-auto p-8">
        {/* Resten av koden för modalen från ovan */}
        {/* ... */}
      </div>
    </div>
  );
};

export default PricingModal; 