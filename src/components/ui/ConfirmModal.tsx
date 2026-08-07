import React from 'react';
import { LogOut, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Modal } from './Modal';
import type { ModalVariant } from './Modal';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;

  /** Dialog heading */
  title: string;
  /** Explanatory text */
  description?: string;
  /** Optional badge text e.g. "Security Action" */
  badge?: string;
  /** Icon to display in the coloured circle (Lucide element) */
  icon?: React.ReactNode;

  /** Colour theme */
  variant?: ModalVariant;

  /** Label for the confirm button (default: "Confirm") */
  confirmLabel?: string;
  /** Label for the cancel button (default: "Cancel") */
  cancelLabel?: string;

  /** Show a spinner on the confirm button */
  loading?: boolean;
}

const defaultIcons: Record<ModalVariant, React.ReactNode> = {
  danger: <LogOut className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  success: <CheckCircle className="w-5 h-5" />,
  default: <Info className="w-5 h-5" />,
};

/**
 * ConfirmModal
 * A thin, semantic wrapper around <Modal> for any confirm/cancel flow.
 * Usage:
 *   <ConfirmModal
 *     isOpen={open}
 *     onClose={() => setOpen(false)}
 *     onConfirm={handleSignOut}
 *     title="Ready to sign out?"
 *     description="You will be logged out of your session and redirected to login."
 *     variant="danger"
 *     confirmLabel="Sign out"
 *   />
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  badge,
  icon,
  variant = 'default',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
}) => {
  const modalIcon = icon ?? defaultIcons[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      badge={badge}
      icon={modalIcon}
      variant={variant}
      size="sm"
      cancelLabel={cancelLabel}
      primaryAction={{
        label: confirmLabel,
        onClick: onConfirm,
        loading,
      }}
    />
  );
};
