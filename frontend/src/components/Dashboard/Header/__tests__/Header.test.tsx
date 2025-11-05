import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

// Mock de useNavigate
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Header', () => {
  const defaultProps = {
    onLogout: jest.fn(),
    onNewEntry: jest.fn(),
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      pictureUrl: null,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the greeting message with the first name', () => {
    render(<Header {...defaultProps} />);
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello, Test! 👋');
  });

  it('renders the action buttons', () => {
    render(<Header {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /new entry/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
  });

  it('calls onNewEntry when New Entry button is clicked', () => {
    render(<Header {...defaultProps} />);
    
    const newEntryButton = screen.getByRole('button', { name: /new entry/i });
    newEntryButton.click();
    
    expect(defaultProps.onNewEntry).toHaveBeenCalledTimes(1);
  });

  it('calls onLogout when Sign Out button is clicked', () => {
    render(<Header {...defaultProps} />);
    
    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    signOutButton.click();
    
    expect(defaultProps.onLogout).toHaveBeenCalledTimes(1);
  });
});
