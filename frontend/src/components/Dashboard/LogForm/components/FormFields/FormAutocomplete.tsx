import React from 'react';
import { Autocomplete, TextField, Chip, Typography } from '@mui/material';
import type { FormFieldProps } from '../../types';

interface FormAutocompleteProps extends Omit<FormFieldProps, 'value' | 'onChange'> {
  value: string[];
  onChange: (value: string[]) => void;
  options: { value: string; label: string }[];
}

const FormAutocomplete: React.FC<FormAutocompleteProps> = ({
  name,
  label,
  value = [],
  onChange,
  options,
  tooltip,
  sx = {},
  fullWidth = true,
}) => {
  // Convert string values to option objects for the Autocomplete
  const selectedOptions = React.useMemo(() => {
    return options.filter(option => value.includes(option.value));
  }, [value, options]);

  return (
    <>
      <Autocomplete
        multiple
        id={name}
        options={options}
        value={selectedOptions}
        getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onChange={(_, newValue) => {
          // Extract just the values to store in the form
          const newValues = newValue.map(item => 
            typeof item === 'string' ? item : item.value
          );
          onChange(newValues);
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.value}
              label={option.label}
              size="small"
              sx={{ 
                mr: 0.5, 
                mb: 0.5,
                '& .MuiChip-deleteIcon': {
                  ml: 0.5,
                  mr: 0,
                }
              }}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            size="small"
            fullWidth={fullWidth}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                paddingTop: '8.5px',
                paddingBottom: '8.5px',
                '& fieldset': {
                  borderColor: 'divider',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                  borderWidth: '1px',
                },
              },
              ...sx,
            }}
          />
        )}
        freeSolo
        autoSelect
        filterSelectedOptions
        fullWidth={fullWidth}
        sx={{ mb: 1 }}
      />
      {tooltip && (
        <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
          {tooltip}
        </Typography>
      )}
    </>
  );
};

export default FormAutocomplete;
