import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  isOpen,
  onOpenChange,
  label,
  onConfirm,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  label: string;
  onConfirm: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <h2 className="mb-2 text-[15px] font-semibold text-ink">Delete {label}?</h2>
      <p className="text-[13px] leading-relaxed text-muted">This can&apos;t be undone.</p>
      <div className="mt-[22px] flex justify-end gap-2">
        <Button variant="ghost" onPress={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onPress={() => {
            onConfirm();
            onOpenChange(false);
          }}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}
