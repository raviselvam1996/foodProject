import { z } from 'zod';
import { TbEdit } from 'react-icons/tb';
import { FormProvider, useForm } from 'react-hook-form';
import { useState, useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Switch,
  Stack,
  IconButton,
  Card,
  Avatar,
  Chip,
  CardHeader,
  CardContent,
  FormControlLabel,
} from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import {
  useGetSupplierCategoryQuery,
  useMenuStatusChangeMutation,
  useAddMenuMutation,
  useDelMenuMutation,
  useGetMenuItemsMutation,
  useItemCreateMutation,
  useAddonCreateMutation,
  useAddonItemCreateMutation,
  useEditMenuMutation,
  useDelMenuItemMutation,
  useItemEditMutation,
  useAddonUpdateMutation,
  useDelAddOnMutation,
} from 'src/services/menu';

import { useBoolean } from 'src/hooks/use-boolean';

import { Upload } from 'src/components/upload';
import { toast } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { RHFRadioGroup, RHFSwitch, RHFTextField } from 'src/components/hook-form';

import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Iconify } from 'src/components/iconify';
// ----------------------------------------------------------------------
// Zod Schema
const schema = z.object({
  name: z.string().nonempty('Menu Name is required'),
  short_desc: z.string().nonempty('Short Description is required'),
});
const itemSchema = z.object({
  name: z.string().nonempty('Menu Name is required'),
  price: z.number().min(1, { message: 'required!' }),

  food_type: z.string(),
});
const addonSchema = z
  .object({
    name: z.string().min(1, { message: 'AddOn Name is required!' }),
    select_upto: z.number(), // Prevents 0 and negative numbers
    is_required: z.boolean(),
    is_multi_select: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.is_multi_select) {
        return data.select_upto !== null && data.select_upto >= 1;
      }
      return true; // If is_multi_select is false, select_upto can be null
    },
    {
      message: 'Select Upto is required!',
      path: ['select_upto'],
    }
  );
const addonItemSchema = z.object({
  name: z.string().min(1, { message: 'required!' }),
  price: z.number().min(1, { message: 'required!' }),
});
export function MenuDetails() {
  const confirm = useBoolean();
  const confirm2 = useBoolean();
  const menuItemDel = useBoolean();
  const confirm3 = useBoolean();
  const addon = useBoolean();
  const addOnDel = useBoolean();

  const [file, setFile] = useState(null);
  const [formDatas, setFormData] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  // const [isMenuItemEdit, setIsMenuItemEdit] = useState(false);
  const [delId, setDelId] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [menuId, setMenuId] = useState(null);
  const [menuItemId, setMenuItemId] = useState(null);
  const [addOnId, setAddOnId] = useState(null);
  const [addOnData, setAddOnData] = useState([]);
  const [isAddOn, setIsAddOn] = useState(true);

  const [addMenu, { isLoading: statusLoad }] = useAddMenuMutation();
  const [editMenu, { isLoading: menuLoad }] = useEditMenuMutation();
  const {
    data: categoriesData,
    isLoading: loadingCategories,
    error: categoriesError,
    refetch,
  } = useGetSupplierCategoryQuery();
  const [menuStatusChange, { isLoading: satusLoad }] = useMenuStatusChangeMutation();
  const [delMenu, { isLoading: menuDelLoad }] = useDelMenuMutation();
  const [getMenuItems, { isLoading: itemLoad }] = useGetMenuItemsMutation();
  const [addonCreate, { isLoading: addonLoad }] = useAddonCreateMutation();
  const [addonUpdate, { isLoading: addonEditLoad }] = useAddonUpdateMutation();
  const [delAddOn, { isLoading: addonDelLoad }] = useDelAddOnMutation();
  const [itemCreate, { isLoading: itemAddLoad }] = useItemCreateMutation();
  const [itemEdit, { isLoading: itemEditLoad }] = useItemEditMutation();
  const [delMenuItem, { isLoading: itemDelLoad }] = useDelMenuItemMutation();
  const [addonItemCreate, { isLoading: AddonitemAddLoad }] = useAddonItemCreateMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const methods = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      price: 0,
      food_type: 'veg', // Default empty selection
    },
  });

  const {
    register: itemRegister,
    reset: itemReset,
    handleSubmit: itemSubmit,
    formState: { errors: itemError },
  } = methods;

  const addonMethods = useForm({
    resolver: zodResolver(addonSchema),
    defaultValues: {
      name: '',
      is_required: false,
      is_multi_select: false,
      select_upto: 1, // Default empty selection
    },
  });

  const {
    handleSubmit: addonHandleSubmit,
    watch: addonWatch,
    reset: addonReset,
    formState: { errors: addonError },
  } = addonMethods;

  const addonItemMethods = useForm({
    resolver: zodResolver(addonItemSchema),
    defaultValues: {
      name: '',
      price: 0,
    },
  });

  const {
    handleSubmit: addonItemHandleSubmit,
    formState: { errors: addonItemError },
  } = addonItemMethods;
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
        formData.append('id', editId); // Append the image file
        response = await editMenu(formData).unwrap();
      } else {
        response = await addMenu(formData).unwrap();
      }
      if (response.status) {
        toast.success(response.message);
        if (response.status) {
          reset();
          refetch();
          confirm.onFalse();
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

  const deleteMenu = async () => {
    try {
      const payload = {
        id: delId,
      };
      const response = await delMenu(payload).unwrap();
      if (response.status) {
        toast.success(response.message);
        confirm2.onFalse();
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openEditMenuData = (val, id) => {
    setEditId(id);
    setIsEdit(true);
    confirm.onTrue();
    reset(val);
    const img = `http://localhost:3000${val.image}`;
    setFile(img);
  };
  const openEditMenuItemData = (val, id) => {
    setEditId(id);
    setIsEdit(true);
    confirm3.onTrue();
    itemReset(val);
  };
  const openEditAddonData = (val, id) => {
    setEditId(id);
    setIsEdit(true);
    addon.onTrue();
    addonReset(val);
  };
  const formContent = (
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
        <Upload value={file} onDrop={handleDropSingleFile} onDelete={() => setFile(null)} />
      </Stack>
    </form>
  );

  // For menu item
  const menuItemsGet = useCallback(
    async (id) => {
      try {
        const payload = { id };
        const response = await getMenuItems(payload).unwrap(); // ✅ Add `await`

        if (response.status) {
          setMenuItems(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [getMenuItems] // ✅ Include `getMenuItems` as a dependency
  );

  useEffect(() => {
    if (categoriesData?.data?.length > 0) {
      menuItemsGet(categoriesData.data[0].id);
    }
  }, [categoriesData, menuItemsGet]); // ✅ Include `menuItemsGet` so it updates properly

  const itemOnSubmit = async (data) => {
    try {
      // Create FormData instance
      const formData = data;
      formData.menu_id = 1;
      let response;
      if (isEdit) {
        formData.id = editId;
        response = await itemEdit(formData).unwrap();
      } else {
        response = await itemCreate(formData).unwrap();
      }
      if (response.status) {
        toast.success(response.message);
        itemReset();
        confirm3.onFalse();
        // menuItemsGet()
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteMenuItem = async () => {
    try {
      const payload = {
        id: delId,
      };
      const response = await delMenuItem(payload).unwrap();
      if (response.status) {
        toast.success(response.message);
        menuItemDel.onFalse();
        //  refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteAddon = async () => {
    try {
      const payload = {
        id: delId,
      };
      const response = await delAddOn(payload).unwrap();
      if (response.status) {
        toast.success(response.message);
        addOnDel.onFalse();
        //  refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const itemFormContent = (
    <FormProvider {...methods}>
      <form onSubmit={itemSubmit(itemOnSubmit)} noValidate>
        <TextField
          {...itemRegister('name')}
          autoFocus
          fullWidth
          type="text"
          margin="dense"
          variant="outlined"
          label="Menu Name"
          size="small"
          error={!!itemError.name}
          helperText={itemError.name?.message}
        />
        {/* <TextField
          {...itemRegister('price')}
          fullWidth
          type="number"
          margin="dense"
          variant="outlined"
          label="Price"
          size="small"
          error={!!itemError.price}
          helperText={itemError.price?.message}
        /> */}
        <RHFTextField name="price" label="Price" type="number" size="small" />

        <RHFRadioGroup
          row
          name="food_type"
          label="Food Type"
          options={[
            { label: 'VEG', value: 'veg' },
            { label: 'NON-VEG', value: 'non-veg' },
          ]}
          sx={{ gap: 4 }}
        />
      </form>
    </FormProvider>
  );
  const handleItemSubmit = itemSubmit(itemOnSubmit);
  const [controlled, setControlled] = useState(null);

  const handleChangeControlled = (panel) => (event, isExpanded) => {
    setControlled(isExpanded ? panel : null);
  };
  const addonSubmit = async (data) => {
    try {
      // Create FormData instance
      const formData = data;
      formData.menu_item_id = menuItemId;
      let response;
      if (isEdit) {
        formData.id = editId;
        response = await addonUpdate(formData).unwrap();
      } else {
        response = await addonCreate(formData).unwrap();
        menuItemsGet(menuItemId);
      }
      if (response.status) {
        toast.success(response.message);
        setIsAddOn(false);
        if(isEdit){
          setAddOnId(editId);
        }else{
          setAddOnId(response.id);
        }

        // addonReset()
        // if (response.status) {
        //   reset();
        //   confirm.onFalse();
        // }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const addonItemSubmit = async (data) => {
    console.log(data);
    try {
      // Create FormData instance
      const formData = data;
      formData.addon_id = addOnId;
      let response;
      if (isEdit) {
        response = await addonItemCreate(formData).unwrap();
      } else {
        response = await addonItemCreate(formData).unwrap();
        menuItemsGet(menuItemId);
      }
      if (response.status) {
        toast.success(response.message);
        // addonReset()
        // if (response.status) {
        //   reset();
        //   confirm.onFalse();
        // }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };
  const addonFormContent = (
    <>
      <FormProvider {...addonMethods}>
        <form onSubmit={addonHandleSubmit(addonSubmit)} noValidate>
          <div
            className={`grid grid-cols-2 sm:grid-cols-4 p-3 ${!isAddOn ? 'pointer-events-none opacity-50' : ''}`}
          >
            <RHFTextField name="name" label="Add On Name" type="text" size="small" />

            <div className="flex items-center">
              {/* <SwitchComponent /> */}
              <RHFSwitch name="is_required" label="Required" />
              <RHFSwitch name="is_multi_select" label="Select Multiple" />
            </div>
            {addonWatch('is_multi_select') && (
              <RHFTextField name="select_upto" label="Select Upto" type="number" size="small" />
            )}
            <div className="ml-5">
              {isAddOn && (
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
      {!isAddOn && (
        <>
          <FormProvider {...addonItemMethods}>
            <form onSubmit={addonItemHandleSubmit(addonItemSubmit)} noValidate>
              <div className="grid grid-cols-2  sm:grid-cols-4 gap-6 p-3">
                <RHFTextField
                  name="name"
                  id="djskfh"
                  label="Add On Item Name"
                  type="text"
                  size="small"
                />

                <RHFTextField name="price" label="Price" type="number" size="small" />
                <div className="ml-5">
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
          <Card>
            <CardHeader title="Addon item" />
            <CardContent>
              {' '}
              <Chip
                variant="outlined"
                size="normal"
                avatar={<Avatar>M</Avatar>}
                label="Small"
                onDelete={handleDelete}
                color="info"
              />
            </CardContent>
          </Card>
        </>
      )}
    </>
  );

  // const addonHandleSubmitFin = addonHandleSubmit(addonSubmit);

  return (
    <>
      <div className="flex justify-end">
        <div>
          <Button variant="contained" color="primary" size="small" onClick={confirm.onTrue}>
            Add Menu
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3">
        <Card className="col-span-1 p-3">
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
                      <span className="flex items-center gap-3 text-xl text-red-700">
                        <IconButton color="primary" onClick={() => openEditMenuData(item, item.id)}>
                          <TbEdit className="cursor-pointer hover:text-red-500 transition" />{' '}
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => {
                            setDelId(item.id);
                            confirm2.onTrue();
                          }}
                        >
                          <MdOutlineDeleteOutline className="cursor-pointer hover:text-red-500 transition" />
                        </IconButton>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Card>
        <Card className="col-span-2 p-3">
          <div className="flex justify-start">
            <div>
              <Button variant="contained" color="primary" size="small" onClick={confirm3.onTrue}>
                Add Item
              </Button>
            </div>
          </div>
          <div>
            {menuItems?.length > 0 &&
              menuItems.map((item, index) => (
                <Accordion
                  key={item.id}
                  expanded={controlled === item.id}
                  onChange={handleChangeControlled(item.id)}
                >
                  <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                    <div className="flex items-center justify-between w-full">
                      {/* Left Side: Name */}
                      <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                        {item.name}
                      </Typography>

                      {/* Right Side: Switch and Icons */}
                      <div className="flex items-center gap-6">
                        <Switch
                          checked={item.status === 'active'}
                          onChange={(e) => handleChange(e, item.id)}
                          inputProps={{ 'aria-label': 'controlled' }}
                          size="small"
                        />
                        <div className="flex items-center gap-3 text-xl text-red-700">
                          <IconButton
                            color="primary"
                            onClick={() => openEditMenuItemData(item, item.id) }
                          >
                            <TbEdit className="cursor-pointer hover:text-red-500 transition" />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => {
                              setDelId(item.id);
                              menuItemDel.onTrue();
                            }}
                          >
                            <MdOutlineDeleteOutline className="cursor-pointer hover:text-red-500 transition" />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="flex flex-col">
                      {item?.add_ons?.length > 0 && (
                        <>
                          {item?.add_ons.map((addons, i) => (
                            <Card className="p-3 mt-3">
                              <div key={i} className="grid grid-cols-2  md:grid-cols-4 gap-4 p-2">
                                <TextField
                                  variant="outlined"
                                  readOnly
                                  fullWidth
                                  label="Add On Name"
                                  value={addons.name} // Manually setting the value
                                  size="small"
                                />

                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={addons.is_required}
                                      inputProps={{ 'aria-label': 'Required' }}
                                      size="small"
                                      readOnly
                                    />
                                  }
                                  label="Required"
                                />
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={addons.is_multi_select}
                                      inputProps={{ 'aria-label': 'Select Multiple' }}
                                      size="small"
                                      readOnly
                                    />
                                  }
                                  label="Multiple"
                                />

                                {addons.is_multi_select && (
                                  <div className="flex justify-end w-full">
                                    <TextField
                                      sx={{ maxWidth: 100 }}
                                      variant="outlined"
                                      readOnly
                                      fullWidth
                                      label="Select Upto"
                                      value={addons.select_upto || ''} // Manually setting the value
                                      size="small"
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center justify-end gap-3 text-xl text-red-700">
                                <IconButton
                                  color="primary"
                                  onClick={() =>{
                                    setMenuItemId(item.id);
                                    openEditAddonData(addons, addons.id)
                                  } }
                                >
                                  <TbEdit className="cursor-pointer hover:text-red-500 transition" />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  onClick={() => {
                                    setDelId(addons.id);
                                    addOnDel.onTrue();
                                  }}
                                >
                                  <MdOutlineDeleteOutline className="cursor-pointer hover:text-red-500 transition" />
                                </IconButton>
                              </div>
                              {addons.items.length > 0 && (
                                <Card className="p-2">
                                  <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                                    Addon items
                                  </Typography>
                                  <CardContent className="flex items-center flex-wrap gap-4">
                                    {addons.items.map((itemss, j) => (
                                      <div key={j}>
                                        <Chip
                                          variant="outlined"
                                          size="normal"
                                          // avatar={<Avatar>M</Avatar>}
                                          label={<p>{`${itemss.name} |  ${itemss.price}`}</p>}
                                          onDelete={handleDelete}
                                          color="primary"
                                        />
                                      </div>
                                    ))}
                                  </CardContent>
                                </Card>
                              )}
                            </Card>
                          ))}
                        </>
                      )}
                    </div>{' '}
                    <div className="flex justify-end">
                      <div>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => {
                            setMenuItemId(item.id);
                            setAddOnData(item.add_ons);
                            addon.onTrue();
                          }}
                        >
                          Add Add on
                        </Button>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))}
          </div>
        </Card>
      </div>
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
      <ConfirmDialog
        open={confirm2.value}
        onClose={confirm2.onFalse}
        title="Delete Menu"
        content="Are you sure want to delete this menu?"
        action={
          <Button onClick={deleteMenu} variant="contained" color="error">
            Confirm
          </Button>
        }
      />
      <ConfirmDialog
        open={confirm3.value}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            confirm3.onFalse();
          }
        }}
        title={isEdit ? 'Edit Menu Item' : 'Add Menu Item'}
        content={itemFormContent}
        action={
          <Button onClick={handleItemSubmit} variant="contained" color="primary">
            Submit
          </Button>
        }
      />
      <ConfirmDialog
        open={menuItemDel.value}
        onClose={menuItemDel.onFalse}
        title="Delete Menu Item"
        content="Are you sure want to delete this Menu Item?"
        action={
          <Button onClick={deleteMenuItem} variant="contained" color="error">
            Confirm
          </Button>
        }
      />
      <ConfirmDialog
        maxWidth="lg"
        open={addon.value}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            addon.onFalse();
          }
        }}
        title={isEdit ? 'Edit AddOn' : 'Create AddOn'}
        content={addonFormContent}
      />
          <ConfirmDialog
        open={addOnDel.value}
        onClose={addOnDel.onFalse}
        title="Delete AddOn"
        content="Are you sure want to delete this AddOn?"
        action={
          <Button onClick={deleteAddon} variant="contained" color="error">
            Confirm
          </Button>
        }
      />
    </>
  );
}
