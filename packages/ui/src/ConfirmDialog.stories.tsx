import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import Button from './Button';

function Demo() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <Button variant="danger" onPress={() => setIsOpen(true)}>
        Delete user
      </Button>
      <ConfirmDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        label='user "Sofia Ricci"'
        onConfirm={() => {}}
      />
    </>
  );
}

const meta = {
  title: 'UI/ConfirmDialog',
  component: Demo,
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
