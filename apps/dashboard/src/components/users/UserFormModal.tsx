import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { TextField, Label, Input, FieldError } from 'react-aria-components';
import useDashboard from '../../state/useDashboard';
import useUsers from '../../queries/useUsers';
import useCurrentUser from '../../queries/useCurrentUser';
import useCreateUser from '../../queries/useCreateUser';
import useUpdateUser from '../../queries/useUpdateUser';
import { Modal, Button } from '@naon-timeline/ui';
import randomPassword from '../../lib/randomPassword';
import type { ModalState, Role, Status } from '../../types';

export default function UserFormModal({
  modal,
}: {
  modal: Extract<ModalState, { kind: 'userForm' }>;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const { closeModal, openModal, showToast } = useDashboard();
  const { data: users } = useUsers();
  const { data: currentUser } = useCurrentUser();
  const editingUser = modal.mode === 'edit' ? users?.find((u) => u.id === modal.userId) : null;
  const isSelf = modal.mode === 'edit' && currentUser?.id === modal.userId;
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const form = useForm({
    defaultValues: {
      email: editingUser?.email ?? '',
      name: editingUser?.name ?? '',
      role: (editingUser?.role ?? 'user') as Role,
      status: (editingUser?.status ?? 'active') as Status,
      password: '',
    },
    onSubmit: ({ value }) => {
      if (modal.mode === 'create') {
        createUserMutation.mutate(
          { email: value.email, name: value.name, role: value.role, status: value.status, password: value.password },
          {
            onSuccess: () => {
              closeModal();
              showToast('User created');
            },
            onError: () => showToast('Failed to create user'),
          },
        );
      } else if (editingUser) {
        updateUserMutation.mutate(
          { ...editingUser, email: value.email, name: value.name, role: value.role, status: value.status },
          {
            onSuccess: () => {
              closeModal();
              showToast('User updated');
            },
            onError: () => showToast('Failed to update user'),
          },
        );
      }
    },
  });

  return (
    <Modal isOpen onOpenChange={(open) => !open && closeModal()}>
      <h2 className="mb-[18px] text-[15px] font-semibold text-ink">
        {modal.mode === 'create' ? 'New user' : 'Edit user'}
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-3.5"
      >
        <form.Field
          name="email"
          validators={{ onChange: ({ value }) => (!value.trim() ? 'Email is required' : undefined) }}
        >
          {(field) => (
            <TextField
              type="email"
              isInvalid={field.state.meta.errors.length > 0}
              className="flex flex-col gap-1.5 text-xs text-muted"
            >
              <Label>Email</Label>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="rounded-[7px] border border-border bg-white px-2.5 py-2.5 text-[13px] text-ink"
              />
              <FieldError className="text-[11px] text-danger">
                {field.state.meta.errors.join(', ')}
              </FieldError>
            </TextField>
          )}
        </form.Field>

        <form.Field
          name="name"
          validators={{ onChange: ({ value }) => (!value.trim() ? 'Name is required' : undefined) }}
        >
          {(field) => (
            <TextField
              isInvalid={field.state.meta.errors.length > 0}
              className="flex flex-col gap-1.5 text-xs text-muted"
            >
              <Label>Name</Label>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="rounded-[7px] border border-border bg-white px-2.5 py-2.5 text-[13px] text-ink"
              />
              <FieldError className="text-[11px] text-danger">
                {field.state.meta.errors.join(', ')}
              </FieldError>
            </TextField>
          )}
        </form.Field>

        {!isSelf && (
          <form.Field name="role">
            {(field) => (
              <label className="flex flex-col gap-1.5 text-xs text-muted">
                Role
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value as Role)}
                  className="rounded-[7px] border border-border bg-white px-2.5 py-2.5 text-[13px] text-ink"
                >
                  <option value="admin">Admin</option>
                  <option value="user">Normal user</option>
                </select>
              </label>
            )}
          </form.Field>
        )}

        {!isSelf && (
          <form.Field name="status">
            {(field) => (
              <label className="flex flex-col gap-1.5 text-xs text-muted">
                Status
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value as Status)}
                  className="rounded-[7px] border border-border bg-white px-2.5 py-2.5 text-[13px] text-ink"
                >
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </label>
            )}
          </form.Field>
        )}

        {modal.mode === 'create' && (
          <form.Field name="password">
            {(field) => (
              <div className="flex items-end gap-2">
                <TextField className="flex flex-1 flex-col gap-1.5 text-xs text-muted">
                  <Label>Initial password</Label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="rounded-[7px] border border-border bg-white px-2.5 py-2.5 text-[13px] text-ink"
                  />
                </TextField>
                <Button variant="ghostSmall" onPress={() => setShowPassword((v) => !v)}>
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
                <Button variant="ghostSmall" onPress={() => field.handleChange(randomPassword())}>
                  Generate
                </Button>
              </div>
            )}
          </form.Field>
        )}

        {editingUser && (
          <div className="flex items-center justify-end border-t border-border pt-1">
            <Button variant="ghostSmall" onPress={() => openModal({ kind: 'resetPassword', userId: editingUser.id })}>
              Reset password
            </Button>
          </div>
        )}

        <div className="mt-1.5 flex justify-between gap-2">
          {editingUser && (
            <Button
              variant="danger"
              onPress={() =>
                openModal({ kind: 'confirmDelete', target: 'user', id: editingUser.id, label: `user "${editingUser.name}"` })
              }
            >
              Delete user
            </Button>
          )}
          <div className="ml-auto flex gap-2">
            <Button variant="ghost" onPress={closeModal}>
              Cancel
            </Button>
            <Button type="submit">{modal.mode === 'create' ? 'Create user' : 'Save changes'}</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
