import { render, screen, fireEvent } from '@testing-library/react';
import FormActions from '../FormActions';

describe('FormActions', () => {
  const defaultProps = {
    activeStep: 1,
    totalSteps: 3,
    onBack: jest.fn(),
    onNext: jest.fn(),
    onSubmit: jest.fn(),
    isSubmitting: false,
    hasErrors: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the back and next buttons', () => {
    render(<FormActions {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /atrás/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /siguiente/i })).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    render(<FormActions {...defaultProps} />);
    
    const backButton = screen.getByRole('button', { name: /atrás/i });
    fireEvent.click(backButton);
    
    expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
  });

  it('calls onNext when next button is clicked', () => {
    render(<FormActions {...defaultProps} />);
    
    const nextButton = screen.getByRole('button', { name: /siguiente/i });
    fireEvent.click(nextButton);
    
    expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
  });

  it('shows submit button on last step', () => {
    render(<FormActions {...defaultProps} activeStep={2} />);
    
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /siguiente/i })).not.toBeInTheDocument();
  });

  it('calls onSubmit when submit button is clicked on last step', () => {
    render(<FormActions {...defaultProps} activeStep={2} />);
    
    const submitButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(submitButton);
    
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('disables the back button on first step', () => {
    render(<FormActions {...defaultProps} activeStep={0} />);
    
    const backButton = screen.getByRole('button', { name: /atrás/i });
    expect(backButton).toBeDisabled();
  });

  it('disables the next button when hasErrors is true', () => {
    render(<FormActions {...defaultProps} hasErrors={true} />);
    
    const nextButton = screen.getByRole('button', { name: /siguiente/i });
    expect(nextButton).toBeDisabled();
  });

  it('shows loading state when isSubmitting is true', () => {
    render(<FormActions {...defaultProps} activeStep={2} isSubmitting={true} />);
    
    const submitButton = screen.getByRole('button', { name: /guardando.../i });
    expect(submitButton).toBeDisabled();
  });

  it('disables the submit button when hasErrors is true on last step', () => {
    render(<FormActions {...defaultProps} activeStep={2} hasErrors={true} />);
    
    const submitButton = screen.getByRole('button', { name: /guardar/i });
    expect(submitButton).toBeDisabled();
  });
});
