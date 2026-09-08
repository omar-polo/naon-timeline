import { useNavigate } from '@tanstack/react-router';
import useDashboard from '../../state/useDashboard';
import useDeleteEvent from '../../queries/useDeleteEvent';
import useDeleteUser from '../../queries/useDeleteUser';
import { ConfirmDialog } from '@naon-timeline/ui';

export default function ModalHost() {
  const { modal, closeModal, showToast } = useDashboard();
  const deleteEventMutation = useDeleteEvent();
  const deleteUserMutation = useDeleteUser();
  const navigate = useNavigate();

  if (!modal) return null;

  if (modal.kind === 'confirmDelete') {
    return (
      <ConfirmDialog
        isOpen
        onOpenChange={(open) => !open && closeModal()}
        label={modal.label}
        onConfirm={() => {
          if (modal.target === 'user') {
            deleteUserMutation.mutate(modal.id, {
              onSuccess: () => {
                closeModal();
                showToast('Deleted');
              },
              onError: () => showToast('Failed to delete user'),
            });
          } else {
            deleteEventMutation.mutate(modal.id, {
              onSuccess: () => {
                closeModal();
                showToast('Deleted');
                navigate({ to: '/events' });
              },
              onError: () => showToast('Failed to delete event'),
            });
          }
        }}
      />
    );
  }

  // userForm / resetPassword are rendered by their own dedicated components
  // (added alongside UsersPage), which read `modal` from context directly.
  return null;
}
