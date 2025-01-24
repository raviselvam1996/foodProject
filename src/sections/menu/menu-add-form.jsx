import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAddMenuMutation } from 'src/services/menu';

import { Upload } from 'src/components/upload';
import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------
// Zod Schema
const schema = z.object({
  menuName: z.string().nonempty('Menu Name is required'),
  shortDescription: z.string().nonempty('Short Description is required'),
});

export function MenuAddForm() {
  const dialog = useBoolean();
  const [file, setFile] = useState(null);
  const [formDatas, setFormData] = useState(null);

  const [addMenu, { isLoading: statusLoad }] = useAddMenuMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log('Form Data:', data);
    try {
      // Create FormData instance
      const formData = new FormData();
      formData.append('name', data.menuName); // Append text field
      formData.append('short_desc', data.shortDescription); // Append text field
      formData.append('image', formDatas); // Append the image file

      const response = await addMenu(formData).unwrap();
      if (response.status) {
        toast.success(response.message);
        if (response.status);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDropSingleFile = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];

    setFormData(newFile); // Save file to state if needed
    setFile(newFile); // Save file to state if needed
  }, []);
  // Expose handleSubmit to a custom button
  const handleExternalSubmit = handleSubmit(onSubmit);
  return (
    <div>
      <Button variant="contained" color="primary" size="small" onClick={dialog.onTrue}>
        Form Dialogs
      </Button>

      <Dialog open={dialog.value} onClose={dialog.onFalse}>
        <DialogTitle> Add Menu</DialogTitle>

        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              {...register('menuName')}
              autoFocus
              fullWidth
              type="text"
              margin="dense"
              variant="outlined"
              label="Menu Name"
              size="small"
              error={!!errors.menuName}
              helperText={errors.menuName?.message}
            />
            <TextField
              {...register('shortDescription')}
              fullWidth
              type="text"
              margin="dense"
              variant="outlined"
              label="Short Description"
              size="small"
              error={!!errors.shortDescription}
              helperText={errors.shortDescription?.message}
            />
            <Stack direction="row" spacing={2}>
              <Upload value={file} onDrop={handleDropSingleFile} onDelete={() => setFile(null)} />
            </Stack>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={dialog.onFalse} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button onClick={handleExternalSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
