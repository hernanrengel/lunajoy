import { render, screen } from '@testing-library/react';
import FormSection from '../FormSection';

describe('FormSection', () => {
  const defaultProps = {
    title: 'Sección de Prueba',
    icon: <span>📝</span>,
    children: <div data-testid="test-children">Contenido de prueba</div>,
  };

  it('renders the section title and children', () => {
    render(<FormSection {...defaultProps} />);
    
    expect(screen.getByText('Sección de Prueba')).toBeInTheDocument();
    expect(screen.getByTestId('test-children')).toBeInTheDocument();
  });

  // No se prueba className ya que no es una propiedad aceptada por el componente
});
