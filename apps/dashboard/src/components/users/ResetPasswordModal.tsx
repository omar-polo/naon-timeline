import { useState } from 'react';
import { TextField, Label, Input } from 'react-aria-components';
import useDashboard from '../../state/useDashboard';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import type { ModalState } from '../../types';

function randomPassword() {
  return Math.random().toString(36).slice(2, 10);
}

export default function ResetPasswordModal({
  modal,
}: {
  modal: Extract<ModalState, { kind: 'resetPassword' }>;
}) {
  const { users, closeModal, resetPassword } = useDashboard();
  const [password, setPassword] = useState('');
  const user = users.find((u) => u.id === modal.userId);

  return (
    <Modal isOpen onOpenChange={(open) => !open && closeModal()}>
      <h2 className="mb-1.5 text-[15px] font-semibold text-ink">Reset password</h2>
      <p className="mb-[18px] text-xs text-muted">for {user?.name}</p>
      <div className="flex items-end gap-2">
        <TextField className="flex flex-1 flex-col gap-1.5 text-xs text-muted">
          <Label>New password</Label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-[7px] border border-border bg-white px-2.5 py-2.5 text-[13px] text-ink"
          />
        </TextField>
        <Button variant="ghostSmall" onPress={() => setPassword(randomPassword())}>
          Generate
        </Button>
      </div>
      <div className="mt-[22px] flex justify-end gap-2">
        <Button variant="ghost" onPress={closeModal}>
          Cancel
        </Button>
        <Button onPress={() => resetPassword(modal.userId, password)}>Set password</Button>
      </div>
    </Modal>
  );
}
