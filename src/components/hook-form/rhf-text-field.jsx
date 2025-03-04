import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

export function RHFTextField({ name, helperText, type, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
        {...field}
        fullWidth
        type={type}
        value={field.value ?? ''} // Ensure 0 is displayed
        onChange={(event) => {
          if (type === 'number') {
            field.onChange(event.target.value === '' ? '' : Number(event.target.value)); // Handle empty string separately
          } else {
            field.onChange(event.target.value);
          }
        }}
        error={!!error}
        helperText={error?.message ?? helperText}
        inputProps={{
          autoComplete: 'off',
        }}
        {...other}
      />
      
      )}
    />
  );
}
