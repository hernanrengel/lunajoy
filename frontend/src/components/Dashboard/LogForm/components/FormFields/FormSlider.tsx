import React from 'react';
import { Slider, Typography, Box, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { FormSliderProps } from '../../types';

const FormSlider: React.FC<FormSliderProps> = ({
  name,
  value,
  onChange,
  min,
  max,
  step = 1,
  valueLabelDisplay = 'auto',
  marks,
  sx = {},
}) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ pl: 1, pr: 2 }}>
      <Slider
        name={name}
        value={value}
        onChange={(_, val) => onChange(val as number)}
        min={min}
        max={max}
        step={step}
        valueLabelDisplay={valueLabelDisplay}
        marks={marks}
        sx={{
          color: 'primary.main',
          height: 6,
          '& .MuiSlider-thumb': {
            width: 16,
            height: 16,
            '&:hover, &.Mui-focusVisible': {
              boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.primary.main, 0.16)}`,
            },
          },
          ...sx,
        }}
      />
      {marks && (
        <Box display="flex" justifyContent="space-between" mt={0.5}>
          {marks.map((mark, index) => (
            <Typography key={index} variant="caption" color="text.secondary">
              {mark.label}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FormSlider;
