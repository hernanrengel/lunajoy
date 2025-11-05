import React from 'react';
import { Button, Box } from '@mui/material';
import type { FormActionsProps } from '../types';

const FormActions: React.FC<FormActionsProps> = ({
  activeStep,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  isSubmitting,
  hasErrors,
}) => {
  return (
    <Box 
      sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        borderTop: '1px solid', 
        borderColor: 'divider',
        position: 'sticky',
        bottom: 0,
        backgroundColor: 'background.paper',
        zIndex: 1,
      }}
    >
      <Button
        onClick={onBack}
        disabled={activeStep === 0 || isSubmitting}
        variant="outlined"
        sx={{
          minWidth: 100,
          textTransform: 'none',
          fontWeight: 500,
        }}
      >
        Atrás
      </Button>
      
      {activeStep === totalSteps - 1 ? (
        <Button
          type="submit"
          onClick={onSubmit}
          variant="contained"
          disabled={isSubmitting || hasErrors}
          sx={{
            minWidth: 120,
            textTransform: 'none',
            fontWeight: 500,
            '&:disabled': {
              backgroundColor: 'action.disabledBackground',
              color: 'text.disabled',
            },
          }}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
      ) : (
        <Button
          onClick={onNext}
          variant="contained"
          disabled={isSubmitting || hasErrors}
          sx={{
            minWidth: 120,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Siguiente
        </Button>
      )}
    </Box>
  );
};

export default FormActions;
