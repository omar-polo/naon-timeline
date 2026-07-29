import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

function Demo() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <Button onPress={() => setIsOpen(true)}>Reopen modal</Button>
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <h2 className="mb-[18px] text-[15px] font-semibold text-ink">Example dialog</h2>
        <p className="text-[13px] text-muted">Press Escape or click the backdrop to close.</p>
        <div className="mt-[22px] flex justify-end gap-2">
          <Button variant="ghost" onPress={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onPress={() => setIsOpen(false)}>Save changes</Button>
        </div>
      </Modal>
    </>
  );
}

const meta = {
  title: 'UI/Modal',
  component: Demo,
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
