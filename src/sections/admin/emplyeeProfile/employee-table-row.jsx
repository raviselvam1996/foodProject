import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
// import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

// import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Switch } from '@mui/material';
import { useEffect, useState } from 'react';

// import { UserQuickEditForm } from './user-quick-edit-form';

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
export function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, employeeStatusChanging,employeeRollChanging }) {
  const confirm = useBoolean();

  const popover = usePopover();

  const quickEdit = useBoolean();

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        {/* <TableCell padding="checkbox">
          <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row.name} src={row.avatarUrl} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link color="inherit" onClick={onEditRow} sx={{ cursor: 'pointer' }}>
                {row.name}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.email}
              </Box>
            </Stack>
          </Stack>
        </TableCell>
        {
          row?.permissions?.length > 0 &&
          row?.permissions?.map((item) => {
            return (
              <TableCell sx={{ whiteSpace: 'nowrap' }} key={item.id}>
                <div className='flex justify-center'>

                  <SwitchComponent
                    initialChecked={item.status == 1}
                    onToggle={(e) => {
                      employeeStatusChanging(e, item.id, row.id)
                    }
                    }
                  />
                </div>
              </TableCell>
            )
          })
        }

        {/* <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'active' && 'success') ||
              (row.status === 'pending' && 'warning') ||
              (row.status === 'banned' && 'error') ||
              'default'
            }
          >
            {row.status}
          </Label>
        </TableCell> */}

        <TableCell>
          <Stack direction="row" alignItems="center">
            {/* <Tooltip title="Quick Edit" placement="top" arrow>
              <IconButton
                color={quickEdit.value ? 'inherit' : 'default'}
                onClick={quickEdit.onTrue}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip> */}

            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      {/* <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} /> */}

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>

          <MenuItem
            onClick={() => {
              employeeRollChanging(row.id)
              popover.onClose();
            }}
          >
            <Iconify icon="solar:user-bold" />
            Setus Admin
          </MenuItem>
          <MenuItem
            onClick={onEditRow}
          >
            <Iconify icon="solar:pen-bold" />
            Edit Employee Info
          </MenuItem>
          <MenuItem
            onClick={onDeleteRow}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>


    </>
  );
}
