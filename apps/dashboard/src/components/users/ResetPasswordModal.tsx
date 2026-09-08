import { useState } from 'react';
import { TextField, Label, Input } from 'react-aria-components';
import useDashboard from '../../state/useDashboard';
import useUsers from '../../queries/useUsers';
import useSetPassword from '../../queries/useSetPassword';
import { Modal, Button } from '@naon-timeline/ui';
import randomPassword from '../../lib/randomPassword';
import type { ModalState } from '../../types';

export default function ResetPasswordModal({
  modal,
}: {
  modal: Extract<ModalState, { kind: 'resetPassword' }>;
}) {
  const { closeModal, showToast } = useDashboard();
  const { data: users } = useUsers();
  const setPasswordMutation = useSetPassword();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const user = users?.find((u) => u.id === modal.userId);

  return (
    <Modal isOpen onOpenChange={(open) => !open && closeModal()}>
      <h2 className="mb-1.5 text-[15px] font-semibold text-ink">Reset password</h2>
      <p className="mb-[18px] text-xs text-muted">for {user?.name}</p>
      <div className="flex items-end gap-2">
        <TextField className="flex flex-1 flex-col gap-1.5 text-xs text-muted">
          <Label>New password</Label>
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-[7px] border border-border bg-white px-2.5 py-2.5 text-[13px] text-ink"
          />
        </TextField>
        <Button variant="ghostSmall" onPress={() => setShowPassword((v) => !v)}>
          {showPassword ? 'Hide' : 'Show'}
        </Button>
        <Button variant="ghostSmall" onPress={() => setPassword(randomPassword())}>
          Generate
        </Button>
      </div>
      <div className="mt-[22px] flex justify-end gap-2">
        <Button variant="ghost" onPress={closeModal}>
          Cancel
        </Button>
        <Button
          isDisabled={setPasswordMutation.isPending}
          onPress={() =>
            setPasswordMutation.mutate(
              { userId: modal.userId, password },
              {
                onSuccess: () => {
                  closeModal();
                  showToast('Password reset');
                },
                onError: () => showToast('Failed to reset password'),
              },
            )
          }
        >
          Set password
        </Button>
      </div>
    </Modal>
  );
}
