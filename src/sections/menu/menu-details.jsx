import { TbEdit } from 'react-icons/tb';
import { FormProvider, useForm } from 'react-hook-form';
import { useState, useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Switch,
  Stack,
  IconButton,
  Card,
  Chip,
  CardContent,
  FormControlLabel,
  CircularProgress,
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
  useGetAddonItemsMutation,
  useMenuItemStatusChangeMutation,
  useImageUploadMutation,
  useDelAddOnItemMutation,
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
import { schema, itemSchema, addonSchema, addonItemSchema } from './menu-schema';
import { handleApiError } from "../../utils/errorHandler";

// ----------------------------------------------------------------------
const SwitchComponent = ({ initialChecked, onToggle }) => {
  const [checked, setChecked] = useState(initialChecked);

  useEffect(() => {
    setChecked(initialChecked);
  }, [initialChecked]); // Update when initialChecked changes

  const handleChange = (e) => {
    e.stopPropagation();
    setChecked(e.target.checked);
    if (onToggle) {
      onToggle(e.target.checked);
    }
  };

  return (
    <div className="flex justify-end">
      <Switch
        checked={checked}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
        inputProps={{ "aria-label": "controlled" }}
        size="small"
      />
    </div>
  );
};
export function MenuDetails() {
  const menu = useBoolean();
  const menuDel = useBoolean();
  const menuItemDel = useBoolean();
  const menuItem = useBoolean();
  const addon = useBoolean();
  const addOnDel = useBoolean();
  const addOnItemDel = useBoolean();

  const [file, setFile] = useState(null);
  const [controlled, setControlled] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [delId, setDelId] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [menuId, setMenuId] = useState(null);
  const [menuItemId, setMenuItemId] = useState(null);
  const [addOnId, setAddOnId] = useState(null);
  const [addOnData, setAddOnData] = useState([]);
  const [isAddOn, setIsAddOn] = useState(true);
  const [addOnItems, setAddOnItems] = useState([]);
  const [imgUrl, setImageUrl] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [menuName, setMenuName] = useState('');
  const imageBaseUrl = import.meta.env.VITE_DASHBOARD_BASE_URL;
  const [addMenu, { isLoading: statusLoad }] = useAddMenuMutation();
  const [editMenu, { isLoading: menuLoad }] = useEditMenuMutation();
  const {
    data: categoriesData,
    isLoading: loadingCategories,
    error: categoriesError,
    refetch,
  } = useGetSupplierCategoryQuery();
  const [menuStatusChange, { isLoading: satusLoad }] = useMenuStatusChangeMutation();
  const [menuItemStatusChange] = useMenuItemStatusChangeMutation();
  const [delMenu, { isLoading: menuDelLoad }] = useDelMenuMutation();
  const [getMenuItems, { isLoading: itemLoad }] = useGetMenuItemsMutation();
  const [addonCreate, { isLoading: addonLoad }] = useAddonCreateMutation();
  const [addonUpdate, { isLoading: addonEditLoad }] = useAddonUpdateMutation();
  const [delAddOn, { isLoading: addonDelLoad }] = useDelAddOnMutation();
  const [itemCreate, { isLoading: itemAddLoad }] = useItemCreateMutation();
  const [itemEdit, { isLoading: itemEditLoad }] = useItemEditMutation();
  const [delMenuItem, { isLoading: itemDelLoad }] = useDelMenuItemMutation();
  const [addonItemCreate, { isLoading: AddonitemAddLoad }] = useAddonItemCreateMutation();
  const [getAddonItems] = useGetAddonItemsMutation();
  const [imageUpload] = useImageUploadMutation();
  const [delAddOnItem, { isLoading: addonItemDelLoad }] = useDelAddOnItemMutation();

  // Form for the Menu
  const menuMethods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      short_desc: '',
    },
  });
  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = menuMethods;

  // Form for the Menu Item
  const methods = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      price: 0,
      food_type: 'veg', // Default empty selection
    },
  });
  const {
    reset: itemReset,
    handleSubmit: itemSubmit,
    formState: { errors: itemError },
  } = methods;

  // Form for the AddOn
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

  // Form for the AddOn Item
  const addonItemMethods = useForm({
    resolver: zodResolver(addonItemSchema),
    defaultValues: {
      name: '',
      price: 0,
    },
  });
  const {
    handleSubmit: addonItemHandleSubmit,
    reset: addonItemReset,
    formState: { errors: addonItemError },
  } = addonItemMethods;

  // For Image upload
  const handleDropSingleFile = async (acceptedFiles) => {
    const newFile = acceptedFiles[0];
    setFile(newFile); // Save file to state if needed
    setImageUrl(null);
    try {
      const formData = new FormData();
      formData.append('image', newFile);
      const response = await imageUpload(formData).unwrap();

      if (response.status) {
        toast.success(response.message);
        setImageUrl(response?.imagePath);
      } else {
        setImageUrl(null);
        toast.success(response?.message || 'Image Not Uploaded');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      toast.error(errorMessage)
    }
  };

  const imageUplaod = useCallback(
    async (val) => {
      try {
        const formData = new FormData();
        formData.append('image', val);
        const response = await imageUpload(formData).unwrap();

        if (response.status) {
          toast.success(response.message);
          setImageUrl(response?.imagePath);
        } else {
          setImageUrl(null);
          toast.success(response?.message || 'Image Not Uploaded');
        }
      } catch (error) {
        const errorMessage = handleApiError(error);
        console.error(errorMessage);
        toast.error(errorMessage)
      }
    },
    [imageUpload]
  ); // Dependencies that `imageUplaod` uses

  // useEffect(() => {
  //   if (file) imageUplaod(file);
  // }, [file, imageUplaod]); // Include `imageUplaod` here

  // For Accordian Change
  const handleChangeControlled = (panel) => (event, isExpanded) => {
    setControlled(isExpanded ? panel : null);
  };
  // Menu Creation and edit Fun
  const menuOnSubmit = async (data) => {
    try {
      // Create FormData instance
      // const formData = new FormData();
      // formData.append('name', data.name); // Append text field
      // formData.append('short_desc', data.short_desc); // Append text field
      // formData.append('image', formDatas); // Append the image file
      const payload = data;
      if (!imgUrl) {
        toast.error('Please upload a image');
        return
      }

// Remove the base URL
const modifiedUrl = imgUrl.replace("https://api.turkish-kebab-pizza-house.co.uk", "");
      payload.image = modifiedUrl;
      let response;
      if (isEdit) {
        payload.id = editId; // Append the image file
        response = await editMenu(payload).unwrap();
      } else {
        response = await addMenu(payload).unwrap();
      }
      if (response.status) {
        toast.success(response.message);
        setImageUrl(null)
        setFile(null);
        reset();
        refetch();
        menu.onFalse();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      toast.error(errorMessage)
    }
  };
  // Form content for the Menu creation and edit
  const formContent = (
    <FormProvider {...menuMethods}>
      <form onSubmit={handleSubmit(menuOnSubmit)} noValidate className="p-3 flex flex-col gap-4">
        <RHFTextField name="name" label="Menu Item Name" size="small" />
        <RHFTextField name="short_desc" label="Short Description" size="small" />
        <Stack direction="row" spacing={2}>
          <Upload value={file} onDrop={handleDropSingleFile} onDelete={() => setFile(null)} />
        </Stack>
      </form>
    </FormProvider>
  );
  // Menu Submit Fun
  const handleExternalSubmit = handleSubmit(menuOnSubmit);

  // Menu status change
  const changeMenuStatus = async (id, val) => {
    try {
      const payload = {
        id,
        status: val,
      };
      const response = await menuStatusChange(payload).unwrap();
      if (response.status) {
        toast.success(response.message);
        // if (response.status) refetch();
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      toast.error(errorMessage)
    }
  };
  // Menu status change
  const handleChange = (event, id) => {
    const value = event ? 'active' : 'inactive';
    changeMenuStatus(id, value);
  };
  // Edit menu
  const openEditMenuData = (val, id) => {
    setEditId(id);
    setIsEdit(true);
    menu.onTrue();
    reset(val);
    const img = imageBaseUrl + val?.image;
    setFile(img);
    setImageUrl(img)
  };
  // Delete menu
  const deleteMenu = async () => {
    try {
      const payload = {
        id: delId,
      };
      const response = await delMenu(payload).unwrap();
      if (response.status) {
        toast.success(response.message);
        menuDel.onFalse();
        refetch();
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      toast.error(errorMessage)
    }
  };

  // Get menu item Based on the menu id
  const menuItemsGet = useCallback(
    async (id) => {
      try {
        setSelectedCard(id); // Store the selected card ID
        setMenuId(id);
        const payload = { id };
        const response = await getMenuItems(payload).unwrap(); // ✅ Add `await`

        if (response.status) {
          setMenuItems(response.data);
        }
      } catch (error) {
        const errorMessage = handleApiError(error);
        console.error(errorMessage);
        toast.error(errorMessage)
      }
    },
    [getMenuItems] // ✅ Include `getMenuItems` as a dependency
  );
  // Get the menu items
  useEffect(() => {
    if (categoriesData?.data?.length > 0) {
      const { id, name } = categoriesData.data[0]; // Destructure here
      menuItemsGet(id);
      setMenuName(name);

    }
  }, [categoriesData, menuItemsGet]); // ✅ Include `menuItemsGet` so it updates properly

  // Menu item creation and edit fun
  const itemOnSubmit = async (data) => {
    try {
      // Create FormData instance
      const formData = data;
      formData.menu_id = menuId;
      if (!imgUrl) {
        toast.error('Please upload a image');
        return
      }
      const modifiedUrl = imgUrl.replace("https://api.turkish-kebab-pizza-house.co.uk", "");
      formData.image = modifiedUrl;
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
        menuItem.onFalse();
        menuItemsGet(menuId);
        setImageUrl(null)
        setFile(null)
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      toast.error(errorMessage)
    }
  };

  // Menu Item status change
  const changeMenuItemStatus = async (id, val) => {
    try {
      const payload = {
        id,
        status: val,
      };
      const response = await menuItemStatusChange(payload).unwrap();
      if (response.status) {
        toast.success(response.message);
        // menuItemsGet(menuId);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      toast.error(errorMessage)
    }
  };
  // Menu status change
  const handleItemChange = (event, id) => {
    const value = event ? 'active' : 'inactive';
    changeMenuItemStatus(id, value);
  };
  // Menu item edit data get fun
  const openEditMenuItemData = (val, id) => {
    setEditId(id);
    setIsEdit(true);
    menuItem.onTrue();
    itemReset(val);
    const img = imageBaseUrl + val?.image;
    setFile(img);
    setImageUrl(img)
  };
  // Menu item delete fun
  const deleteMenuItem = async () => {
    try {
      const payload = {
        id: delId,
      };
      const response = await delMenuItem(payload).unwrap();
      if (response.status) {
        toast.success(response.message);
        menuItemDel.onFalse();
        menuItemsGet(menuId);

        //  refetch();
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      toast.error(errorMessage)
    }
  };

  // Form content for the Menu item
  const itemFormContent = (
    <FormProvider {...methods}>
      <form onSubmit={itemSubmit(itemOnSubmit)} noValidate className="p-3 flex flex-col gap-4">
        <RHFTextField name="name" label="Menu Item Name" size="small" />

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
        <Stack direction="row" spacing={2}>
          <Upload value={file} onDrop={handleDropSingleFile} onDelete={() => setFile(null)} />
        </Stack>
      </form>
    </FormProvider>
  );
  // Menu item form submit
  const handleItemSubmit = itemSubmit(itemOnSubmit);

  //  Addon create and Edit fun
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
        if (isEdit) {
          setAddOnId(editId);
          addonItemsGet(addOnId);
        } else {
          setAddOnId(response?.id);
          addonItemsGet(response?.id);
        }
        menuItemsGet(menuId);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      toast.error(errorMessage)
    }
  };
  // Get Addon Edit data
  const openEditAddonData = (val, id) => {
    setAddOnId(id);
    setEditId(id);
    setIsEdit(true);
    addon.onTrue();
    addonReset(val);
    addonItemsGet(id);

  };
  // Addon delete fun
  const deleteAddon = async () => {
    try {
      const payload = {
        id: delId,
      };
      const response = await delAddOn(payload).unwrap();
      if (response.status) {
        toast.success(response.message);
        addOnDel.onFalse();
        menuItemsGet(menuId);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      toast.error(errorMessage)
    }
  };
  // Addon Item creation and Edit fun
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
        addonItemsGet(addOnId);
        menuItemsGet(menuId);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      toast.error(errorMessage)
    }
  };

  // Addon Item delete fun
  const deleteAddonItem = async () => {
    try {
      const payload = {
        id: [delId],
      };
      const response = await delAddOnItem(payload).unwrap();
      if (response.status) {
        toast.success(response.message);
        addOnItemDel.onFalse();
        setTimeout(() => {
          menuItemsGet(menuId);
        }, 100);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      toast.error(errorMessage)
    }
  };
  // Addon and Addon item Form content
  const addonFormContent = (
    <>
      <FormProvider {...addonMethods}>
        <form onSubmit={addonHandleSubmit(addonSubmit)} noValidate>
          <div
            className={`grid grid-cols-2 sm:grid-cols-3 p-3 ${!isAddOn && !isEdit ? 'pointer-events-none opacity-50' : ''}`}
          >
            <RHFTextField name="name" label="Add On Name" type="text" size="small" />

            <div className="flex items-center">
              {/* <SwitchComponent /> */}
              <RHFSwitch name="is_required" label="Required" />
              <RHFSwitch name="is_multi_select" label="Select Multiple" />
            </div>
            <div className="flex gap-2">
              {addonWatch('is_multi_select') && (
                <RHFTextField
                  name="select_upto"
                  label="Select Upto"
                  type="number"
                  size="small"
                  sx={{ maxWidth: 100 }}
                />
              )}
              {(isAddOn || isEdit) && (
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
      {(!isAddOn || isEdit) && (
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
      )}
      {addOnItems?.length > 0 && (
        <Card className="p-2">
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
            Addon items
          </Typography>
          <CardContent className="flex items-center flex-wrap gap-4">
            {addOnItems.map((addonItem, j) => (
              <div key={j}>
                <Chip
                  variant="outlined"
                  size="normal"
                  // avatar={<Avatar>M</Avatar>}
                  label={<p>{`${addonItem.name} |  ${addonItem.price}`}</p>}
                  onDelete={() => {
                    setDelId(addonItem.id);
                    addOnItemDel.onTrue();
                  }}
                  color="primary"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );

  const addonItemsGet = async (id) => {
    try {
      const payload = {
        id,
      };
      const response = await getAddonItems(payload).unwrap();
      if (response.status) {
        setAddOnItems(response.data);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      toast.error(errorMessage)
    }
  };

  const handleCardClick = (id, name) => {
    setSelectedCard(id); // Store the selected card ID
    if (menuId != id) {
      menuItemsGet(id)
    }
    setMenuName(name)
  };

  const handleToggle = (newState, id) => {
    handleChange(newState, id);
  };
  const handleItemToggle = (newState, id) => {
    handleItemChange(newState, id);
  };

  return (
    <>
      <div className="flex mb-3">
        <div>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              setIsEdit(false);
              menu.onTrue();
            }}
          >
            Add Menu
          </Button>
        </div>
      </div>
      {
        loadingCategories ?
          <div className='flex justify-center items-center mt-10'>
            <CircularProgress color="primary" />
          </div> :
          <>

            {(categoriesData?.data &&
              (categoriesData?.data?.length > 0)) ?


              <div className="grid grid-cols-1 lg:grid-cols-3">
                <Card className="col-span-1 p-2">
                  <div className="flex items-center  pb-2 mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Menu</h2>
                  </div>

                  <div className="flex flex-col space-y-2">
                    {categoriesData?.data &&
                      categoriesData?.data?.length > 0 &&
                      categoriesData?.data?.map((item, index) => (

                        <Card
                          key={index}
                          className={`grid grid-cols-3 space-x-4 px-2 cursor-pointer transition-all duration-200 shadow-xl ${selectedCard == item.id ? "border border-purple-500" : "bg-gray-200"
                            }`}
                          onClick={() => handleCardClick(item.id, item.name)}
                        >
                          <div className="flex items-center gap-2 col-span-1">
                            <div className="w-15 h-15 flex items-center justify-center overflow-hidden">
                              <img
                                src={imageBaseUrl + item.image}
                                alt="Item"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex justify-between col-span-2 pt-2">
                            <p className="text-gray-700 break-words whitespace-normal max-w-[100px]">
                              {item.name}
                            </p>

                            <div className="flex flex-col">
                              <div className='flex justify-end'>
                                <SwitchComponent
                                  initialChecked={item.status === "active"}
                                  onToggle={(e) => {

                                    handleToggle(e, item.id)
                                  }
                                  }
                                />
                              </div>

                              <div className="flex items-center">
                                <IconButton color="primary" onClick={(e) => {
                                  e.preventDefault(); // Prevent default behavior
                                  e.stopPropagation(); // Prevents the accordion from expanding
                                  openEditMenuData(item, item.id)
                                }}>
                                  <TbEdit className="cursor-pointer hover:text-red-500 transition" />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  onClick={(e) => {
                                    e.preventDefault(); // Prevent default behavior
                                    e.stopPropagation(); // Prevents the accordion from expanding
                                    setDelId(item.id);
                                    menuDel.onTrue();
                                  }}
                                >
                                  <MdOutlineDeleteOutline className="cursor-pointer hover:text-red-500 transition" />
                                </IconButton>
                              </div>
                            </div>
                          </div>


                        </Card>
                      ))}
                  </div>
                </Card >
                <Card className="col-span-1 lg:col-span-2 p-3">
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{menuName}</h2>

                    </div>
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                          setIsEdit(false);

                          menuItem.onTrue();
                        }}
                      >
                        Add Item
                      </Button>
                    </div>
                  </div>
                  <div className='flex flex-col w-full items-center'>
  {
    !itemLoad ? (
      <>
        {menuItems?.length > 0 ? (
          <div className="w-full">
            {menuItems.map((item, index) => (
              <Accordion
                key={item.id}
                expanded={controlled === item.id}
                onChange={handleChangeControlled(item.id)}
              >
                <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                  <div className="flex items-center justify-between w-full">
                    {/* Left Side: Name */}
                    <div className="flex items-center gap-2">
                      <div className="w-15 h-15 flex items-center justify-center overflow-hidden">
                        <img
                          src={imageBaseUrl + item.image}
                          alt="Item"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-gray-700 break-words whitespace-normal max-w-[100px] md:max-w-[250px]">
                        {item.name}
                      </p>
                    </div>

                    {/* Right Side: Switch and Icons */}
                    <div className="flex items-center gap-6">
                      <SwitchComponent
                        initialChecked={item.status === "active"}
                        onToggle={(e) => handleItemToggle(e, item.id)}
                      />
                      <div className="flex items-center gap-3 text-xl text-red-700">
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openEditMenuItemData(item, item.id);
                          }}
                        >
                          <TbEdit className="cursor-pointer hover:text-red-500 transition" />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
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
                          <Card className="p-3 mt-3" key={i}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2">
                              <TextField
                                variant="outlined"
                                readOnly
                                fullWidth
                                label="Add On Name"
                                value={addons.name}
                                size="small"
                              />
                              <FormControlLabel
                                control={<Switch checked={addons.is_required} size="small" readOnly />}
                                label="Required"
                              />
                              <FormControlLabel
                                control={<Switch checked={addons.is_multi_select} size="small" readOnly />}
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
                                    value={addons.select_upto || ''}
                                    size="small"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-end gap-3 text-xl text-red-700">
                              <IconButton
                                color="primary"
                                onClick={() => {
                                  setMenuItemId(item.id);
                                  openEditAddonData(addons, addons.id);
                                }}
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
                              <div className="px-5">
                                <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                                  AddOn Items
                                </Typography>
                                <div className="flex items-center flex-wrap gap-4 mt-2">
                                  {addons?.items?.map((itemss, j) => (
                                    <div key={j}>
                                      <Chip
                                        variant="outlined"
                                        size="normal"
                                        label={<p>{`${itemss.name} |  ${itemss.price}`}</p>}
                                        onDelete={() => {
                                          setDelId(itemss.id);
                                          addOnItemDel.onTrue();
                                        }}
                                        color="primary"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </Card>
                        ))}
                      </>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => {
                        setMenuItemId(item.id);
                        setAddOnData(item.add_ons);
                        addon.onTrue();
                        setIsEdit(false);
                      }}
                    >
                      Add Add on
                    </Button>
                  </div>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        ) : (
          <div className='flex items-center justify-center mt-10'>
            <p>No items added, Please add Menu items!</p>
          </div>
        )}
      </>
    ) : (
      <div className='flex justify-center items-center mt-10'>
        <CircularProgress color="primary" />
      </div>
    )
  }
</div>

                </Card>
              </div >
              :
              <div className='flex items-center justify-center mt-10'>
                <p>No Menu added,Please add Menu !</p>

              </div>
            }
          </>
      }
      {/* Menu Creation and Edit Model */}
      < ConfirmDialog
        open={menu.value}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            menu.onFalse();
            reset({
              name: '',
              short_desc: '',
            });
            setIsEdit(false);
            setImageUrl(null)
            setFile(null)
          }
        }
        }
        title={isEdit ? 'Edit Menu' : 'Add Menu'}
        content={formContent}
        action={
          < Button onClick={handleExternalSubmit} variant="contained" color="primary" >
            Submit
          </Button >
        }
      />
      {/* Menu delete model */}
      <ConfirmDialog
        open={menuDel.value}
        onClose={menuDel.onFalse}
        title="Delete Menu"
        content="Are you sure want to delete this menu?"
        action={
          <Button onClick={deleteMenu} variant="contained" color="error">
            Confirm
          </Button>
        }
      />
      {/* Menu Item Creation and Edit Model */}
      <ConfirmDialog
        open={menuItem.value}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            menuItem.onFalse();
            itemReset({
              name: '',
              price: 0,
              food_type: 'veg',
            });
            setIsEdit(false);
            setImageUrl(null)
            setFile(null)
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
      {/* Menu Item delete model */}
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
      {/* AddOn and Addon Item Creation and Edit Model */}
      <ConfirmDialog
        maxWidth="lg"
        open={addon.value}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            addon.onFalse();
            addonReset({
              name: '',
              is_required: false,
              is_multi_select: false,
              select_upto: 1,
            });
            addonItemReset({
              name: '',
              price: 0,
            });
            setIsAddOn(true);
            setIsEdit(false);
            // menuItemsGet(menuId);
            setAddOnItems([]);
          }
        }}
        title={isEdit ? 'Edit AddOn' : 'Create AddOn'}
        content={addonFormContent}
      />
      {/* Addon Delete Modal */}
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

      {/* Addon Item Delete Modal */}
      <ConfirmDialog
        open={addOnItemDel.value}
        onClose={addOnItemDel.onFalse}
        title="Delete AddOn Item"
        content="Are you sure want to delete this AddOn Item?"
        action={
          <Button onClick={deleteAddonItem} variant="contained" color="error">
            Confirm
          </Button>
        }
      />
    </>
  );
}
