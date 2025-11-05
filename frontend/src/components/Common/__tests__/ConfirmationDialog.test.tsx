import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmationDialog } from '../ConfirmationDialog';

describe('ConfirmationDialog', () => {
  const onClose = jest.fn();
  const onConfirm = jest.fn();
  const defaultProps = {
    open: true,
    title: 'Confirm Action',
    content: 'Are you sure you want to perform this action?',
    onClose,
    onConfirm,
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dialog with title and content', () => {
    render(
      <ConfirmationDialog
        open={true}
        title="Confirm Action"
        message="Are you sure you want to perform this action?"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to perform this action?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    const onCancel = jest.fn();
    const onConfirm = jest.fn();
    
    render(
      <ConfirmationDialog
        open={true}
        title="Test"
        message="Test message"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('calls onConfirm when Confirm button is clicked', () => {
    const onCancel = jest.fn();
    const onConfirm = jest.fn();
    
    render(
      <ConfirmationDialog
        open={true}
        title="Test"
        message="Test message"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
    
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });
});
