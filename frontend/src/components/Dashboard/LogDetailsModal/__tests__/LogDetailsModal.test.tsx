import { render, screen } from '@testing-library/react';
import { LogDetailsModal } from '../LogDetailsModal';

describe('LogDetailsModal', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    getMoodColor: () => '#4caf50', // Mock implementation that returns a green color
    log: {
      id: '1',
      userId: 'user-123',
      date: '2025-01-01T00:00:00.000Z',
      createdAt: '2025-01-01T00:00:00.000Z',
      mood: 7,
      sleepHours: 8,
      sleepQuality: 8,
      physicalActivity: {
        type: 'running',
        duration: 30,
      },
      socialInteractions: 7,
      stress: 4,
      symptoms: 'headache, fatigue',
      notes: 'Feeling good today',
      user: {
        id: 'user-123',
        googleSub: 'google-123',
        name: 'Test User',
        email: 'test@example.com',
        pictureUrl: undefined, // Make it undefined instead of null
        createdAt: '2025-01-01T00:00:00.000Z'
      }
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal with log details', () => {
    render(<LogDetailsModal {...defaultProps} />);
    
    // Check for the modal title
    expect(screen.getByText('Log Details')).toBeInTheDocument();
    
    // Check for the formatted date
    expect(screen.getByText('Tuesday, December 31, 2024 at 08:00 PM')).toBeInTheDocument();
    
    // Check for mood display
    expect(screen.getByText('Mood')).toBeInTheDocument();
    expect(screen.getByText('7/10')).toBeInTheDocument();
    
    // Check for stress level
    expect(screen.getByText('Stress Level')).toBeInTheDocument();
    expect(screen.getByText('4/10')).toBeInTheDocument();
    
    // Check for sleep hours
    expect(screen.getByText('Sleep Hours')).toBeInTheDocument();
    expect(screen.getByText('8h')).toBeInTheDocument();
    
    // Check for sleep quality
    expect(screen.getByText('Sleep Quality')).toBeInTheDocument();
    expect(screen.getByText('8/10')).toBeInTheDocument();
    
    // Check for symptoms
    expect(screen.getByText('Symptoms')).toBeInTheDocument();
    expect(screen.getByText('headache, fatigue')).toBeInTheDocument();
    
    // Check for notes
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByText('Feeling good today')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    render(<LogDetailsModal {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    closeButton.click();
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});
