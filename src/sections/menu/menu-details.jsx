import { z } from 'zod';
import { TbEdit } from 'react-icons/tb';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Switch, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


import {
  useGetSupplierCategoryQuery,
  useMenuStatusChangeMutation,
  useAddMenuMutation,
} from 'src/services/menu';

import { useBoolean } from 'src/hooks/use-boolean';

import { Upload } from 'src/components/upload';
import { toast } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------
// Zod Schema
const schema = z.object({
  name: z.string().nonempty('Menu Name is required'),
  short_desc: z.string().nonempty('Short Description is required'),
});
export function MenuDetails() {
  const dialog = useBoolean();
  const confirm = useBoolean();

  const [file, setFile] = useState(null);
  const [formDatas, setFormData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [addMenu, { isLoading: statusLoad }] = useAddMenuMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log('Form Data:', data);
    try {
      // Create FormData instance
      const formData = new FormData();
      formData.append('name', data.name); // Append text field
      formData.append('short_desc', data.short_desc); // Append text field
      formData.append('image', formDatas); // Append the image file
      let response;
      if (isEdit) {
        response = await addMenu(formData).unwrap();
      } else {
        response = await addMenu(formData).unwrap();
      }
      if (response.status) {
        toast.success(response.message);
        if (response.status) {
          reset();
          refetch();
          dialog.onFalse();
        }
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

  const handleChange = (event, id) => {
    console.log(id);

    const value = event.target.checked ? 'active' : 'inactive';
    changeMenuStatus(id, value);
    // setMenuStatus(value);
  };

  const {
    data: categoriesData,
    isLoading: loadingCategories,
    error: categoriesError,
    refetch,
  } = useGetSupplierCategoryQuery();
  const [menuStatusChange, { isLoading: satusLoad }] = useMenuStatusChangeMutation();

  const changeMenuStatus = async (id, val) => {
    try {
      const payload = {
        id,
        status: val,
      };
      const response = await menuStatusChange(payload).unwrap();
      if (response.status) {
        toast.success(response.message);
        if (response.status) refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openEditMenuData = (val) => {
    setIsEdit(true);
    dialog.onTrue();
    reset(val);
    const img = `http://localhost:3000${val.image}`;
    setFile(img);
  };
  const formContent =     
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
  <TextField
    {...register('name')}
    autoFocus
    fullWidth
    type="text"
    margin="dense"
    variant="outlined"
    label="Menu Name"
    size="small"
    error={!!errors.name}
    helperText={errors.name?.message}
  />
  <TextField
    {...register('short_desc')}
    fullWidth
    type="text"
    margin="dense"
    variant="outlined"
    label="Short Description"
    size="small"
    error={!!errors.short_desc}
    helperText={errors.short_desc?.message}
  />
  <Stack direction="row" spacing={2}>
    <Upload
      value={file}
      onDrop={handleDropSingleFile}
      onDelete={() => setFile(null)}
    />
  </Stack>
</form>
  return (
    <>
      <div className="flex justify-end">
        <div>
          <Button variant="contained" color="primary" size="small" onClick={confirm.onTrue}>
            Add Menu
          </Button>
{/* 
          <Dialog
            open={dialog.value}
            onClose={(event, reason) => {
              if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                dialog.onFalse();
              }
            }}
          >
            <DialogTitle>{isEdit ? 'Edit Menu' : 'Add Menu'}</DialogTitle>

            <DialogContent>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                  {...register('name')}
                  autoFocus
                  fullWidth
                  type="text"
                  margin="dense"
                  variant="outlined"
                  label="Menu Name"
                  size="small"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
                <TextField
                  {...register('short_desc')}
                  fullWidth
                  type="text"
                  margin="dense"
                  variant="outlined"
                  label="Short Description"
                  size="small"
                  error={!!errors.short_desc}
                  helperText={errors.short_desc?.message}
                />
                <Stack direction="row" spacing={2}>
                  <Upload
                    value={file}
                    onDrop={handleDropSingleFile}
                    onDelete={() => setFile(null)}
                  />
                </Stack>
              </form>
            </DialogContent>

            <DialogActions>
              <Button
                onClick={() => {
                  setIsEdit(false);
                  dialog.onFalse();
                }}
                variant="outlined"
                color="inherit"
              >
                Cancel
              </Button>
              <Button onClick={handleExternalSubmit} variant="contained" color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog> */}

          <ConfirmDialog
        open={confirm.value}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            confirm.onFalse();
          }
        }}
        title={isEdit ? 'Edit Menu' : 'Add Menu'}
        content={formContent}
        action={
          <Button onClick={handleExternalSubmit} variant="contained" color="primary">
          Submit
        </Button>
        }
      />
        </div>
      </div>

      <div className="max-w-sm p-4 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <h2 className="text-xl font-bold text-gray-800">Menu</h2>
          <span className="text-sm text-gray-500">d</span>
        </div>

        <div className="flex flex-col space-y-4">
          {categoriesData?.data &&
            categoriesData?.data?.length > 0 &&
            categoriesData?.data?.map((item, index) => (
              <div key={index} className="flex items-center justify-between  space-x-4">
                <div className="flex items-center gap-5">
                  <div className="w-15 h-15 flex items-center justify-center overflow-hidden">
                    <img
                      src={`http://localhost:3000${item.image}`}
                      alt="Item"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="text-gray-700">{item.name}</p>
                </div>

                <div className="flex items-center gap-6">
                  {/* <SwitchComponent /> */}
                  <Switch
                    checked={item.status === 'active'}
                    onChange={(e) => handleChange(e, item.id)}
                    inputProps={{ 'aria-label': 'controlled' }}
                    size="small"
                  />
                  <div>
                    <span className="text-red-700 text-xl">
                      <TbEdit onClick={() => openEditMenuData(item)} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
