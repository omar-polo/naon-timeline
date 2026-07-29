import { useNavigate } from '@tanstack/react-router';
import useDashboard from '../../state/useDashboard';
import ConfirmDialog from '../ui/ConfirmDialog';

export default function ModalHost() {
  const { modal, closeModal, deleteUser, deleteEvent } = useDashboard();
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
            deleteUser(modal.id);
          } else {
            deleteEvent(modal.id);
            navigate({ to: '/events' });
          }
        }}
      />
    );
  }

  // userForm / resetPassword are rendered by their own dedicated components
  // (added alongside UsersPage), which read `modal` from context directly.
  return null;
}
