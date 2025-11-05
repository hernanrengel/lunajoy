import React from 'react';
import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import type { FormSectionProps } from '../../types';

interface IconProps {
  sx?: SxProps<Theme>;
  [key: string]: any;
}

const FormSection: React.FC<FormSectionProps> = ({ title, icon, children, sx = {} }) => {
  return (
    <Box sx={{ mb: 3, ...sx }}>
      <Box display="flex" alignItems="center" mb={2}>
        {React.cloneElement(icon as React.ReactElement<IconProps>, { 
          sx: { 
            mr: 1.5, 
            fontSize: 28,
            ...(icon as React.ReactElement<IconProps>).props.sx 
          } 
        })}
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ pl: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default FormSection;
