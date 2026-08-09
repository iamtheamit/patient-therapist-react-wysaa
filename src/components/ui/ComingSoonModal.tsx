import React from 'react';
import { Modal } from './Modal';
import comingSoonImg from '@/assets/coming-soon.png';

export interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTitle?: string;
  featureDescription?: string;
  icon?: string;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  onClose,
  featureTitle = 'This',
  featureDescription,
}) => {
  const descriptionText =
    featureDescription ||
    `We are actively working on the ${featureTitle} feature to give you the best experience. Stay tuned for upcoming updates!`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      variant="default"
      primaryAction={{
        label: 'Got it',
        onClick: onClose,
      }}
    >
      <div className="flex flex-col items-center text-center p-4 sm:p-6 space-y-6">
        {/* Custom Uploaded Coming Soon Illustration - Extra Large & Prominent */}
        <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center shrink-0 my-2">
          <img
            src={comingSoonImg}
            alt="Feature Coming Soon"
            className="w-full h-full object-contain filter drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#191c1e] tracking-tight">
          {featureTitle} Feature Coming Soon
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-[#505f76] leading-relaxed max-w-lg">
          {descriptionText}
        </p>
      </div>
    </Modal>
  );
};

export default ComingSoonModal;
