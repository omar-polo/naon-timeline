import { ModalOverlay, Modal as AriaModal, Dialog } from 'react-aria-components';
import type { ReactNode } from 'react';

export default function Modal({
  isOpen,
  onOpenChange,
  children,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  children: ReactNode;
}) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
      className="fixed inset-0 z-10 flex items-center justify-center bg-scrim"
    >
      <AriaModal className="w-[380px] max-w-[92vw] max-h-[88vh] overflow-y-auto rounded-[14px] bg-modal p-[26px] shadow-[var(--shadow-float)]">
        <Dialog className="outline-none">{children}</Dialog>
      </AriaModal>
    </ModalOverlay>
  );
}
