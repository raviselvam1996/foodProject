import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
// import Tab from '@mui/material/Tab';
// import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
// import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
// import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

// import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { _roles, _userList, USER_STATUS_OPTIONS } from 'src/_mock';

// import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
// import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
// import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  // TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { UserTableRow } from './employee-table-row';
import { UserTableToolbar } from './employee-table-toolbar';
import { UserTableFiltersResult } from './employee-table-filters-result';
import { EmployeeSchema } from '../admin-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form';
import { useAddEmployeeMutation, useDelEmployeeMutation, useEditEmployeeMutation, useEmployeeRollChangeMutation, useEmployeeStatusChangeMutation, useGetEmployeeMutation } from 'src/services/admin';
import { handleApiError } from 'src/utils/errorHandler';


// ----------------------------------------------------------------------

export function EmployeeProfileTable() {
  const table = useTable();


  const [editId, setEditId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [delId, setDelId] = useState(null);
  const [head, setHead] = useState([
    { id: 'name', label: 'Employee Details' }]);

  const [addEmployee] = useAddEmployeeMutation();
  const [editEmployee] = useEditEmployeeMutation();
  const [delEmployee] = useDelEmployeeMutation();
  const [getEmployee] = useGetEmployeeMutation();
  const [employeeStatusChange] = useEmployeeStatusChangeMutation();
  const [employeeRollChange] = useEmployeeRollChangeMutation();

  const [tableData, setTableData] = useState([]);

  const filters = useSetState({ name: '', role: [], status: 'all' });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });


  const canReset =
    !!filters.state.name || filters.state.role.length > 0 || filters.state.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;




  const employeeAdd = useBoolean();
  const employeeDel = useBoolean();
  // Addon Item creation and Edit fun
  const employeeSubmit = async (data) => {
    try {
      // Create FormData instance
      const formData = data;
      let response;
      if (isEdit) {
        formData.id = editId
        response = await editEmployee(formData).unwrap();
      } else {
        response = await addEmployee(formData).unwrap();
        getEmployeeFun();
      }
      if (response.status) {
        toast.success(response.message);
        employeeReset({
          name: '',
          phone_number: '',
          password: '',
          email: '',
        });
        getEmployeeFun();
        employeeAdd.onFalse()
      } else {
        toast.success(response.message);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage)
    }
  };
  // Addon Item creation and Edit fun
  const delFun = async (id) => {
    try {
      // Create FormData instance
      const formData = {
        id: delId
      };
      const response = await delEmployee(formData).unwrap();

      if (response.status) {
        toast.success(response.message);
        employeeDel.onFalse()
        getEmployeeFun();

      } else {
        toast.success(response.message);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      toast.error(errorMessage)
    }
  };
  // Addon Item creation and Edit fun
  const getEmployeeFun = async () => {
    try {
      // Create FormData instance
      const response = await getEmployee().unwrap();

      if (response.status) {
        toast.success(response.message);
        setTableData(response.data || [])
        const headData = response?.title?.map((item, index) => {
          return {
            id: index,
            label: item
          }
        })
        setHead(headData)

      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage)
    }
  };
  // Addon Item creation and Edit fun
  const employeeStatusChanging = async (value, id, empId) => {
    try {
      const status = value ? 1 : 0
      const payload = {
        emp_id: empId,
        pid: id,
        status: status
      }
      // Create FormData instance
      const response = await employeeStatusChange(payload).unwrap();

      if (response.status) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage)
    }
  };
    // Employee  Roll change fun
    const employeeRollChanging = async (id) => {
      try {
        const payload = {
        id
        }
        // Create FormData instance
        const response = await employeeRollChange(payload).unwrap();  
        if (response.status) {
          toast.success(response.message);
          getEmployeeFun()
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        const errorMessage = handleApiError(error);
        toast.error(errorMessage)
      }
    };
  useEffect(() => {
    getEmployeeFun()
  }, [])

  // Form for the AddOn
  const employeeMethods = useForm({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      email: '',
      phone_number: '',
      password: '',
      name: '',
    },
  });
  const {
    handleSubmit: employeeHandleSubmit,
    watch: employeeWatch,
    reset: employeeReset,
    formState: { errors: employeeError },
  } = employeeMethods;

  // Form content for the Menu creation and edit
  const formContent = (
    <FormProvider {...employeeMethods}>
      <form onSubmit={employeeHandleSubmit(employeeSubmit)} noValidate className="p-3 flex flex-col gap-4">
        <RHFTextField name="name" label="Employee Name" size="small" />
        <RHFTextField name="email" label="Email Address" size="small" type='email' />
        <RHFTextField name="phone_number" label="Phone Number" size="small" />
        <RHFTextField name="password" label="Password" size="small" />

      </form>
    </FormProvider>
  );
  // Menu Submit Fun
  const handleExternalSubmit = employeeHandleSubmit(employeeSubmit);
  const openEditData = (val, id) => {
    setEditId(id);
    setIsEdit(true);
    employeeAdd.onTrue();
    employeeReset(val);

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
                employeeAdd.onTrue();
              }}
            >
              Add Employee
            </Button>
          </div>
        </div>
        {/* <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'User', href: paths.dashboard.user.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.user.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New user
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        /> */}

        <Card>
          {/* <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'banned' && 'error') ||
                      'default'
                    }
                  >
                    {['active', 'pending', 'banned', 'rejected'].includes(tab.value)
                      ? tableData.filter((user) => user.status === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs> */}

          <UserTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ roles: _roles }}
          />

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            {/* <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            /> */}

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={head}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                // onSelectAllRows={(checked) =>
                //   table.onSelectAllRows(
                //     checked,
                //     dataFiltered.map((row) => row.id)
                //   )
                // }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => {
                          setDelId(row.id);
                          employeeDel.onTrue();
                        }}
                        onEditRow={() => openEditData(row, row.id)}
                        employeeStatusChanging={employeeStatusChanging}
                        employeeRollChanging={employeeRollChanging}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>

 

      {/* Menu Creation and Edit Model */}
      < ConfirmDialog
        open={employeeAdd.value}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            employeeAdd.onFalse();
            employeeReset({
              name: '',
              phone_number: '',
              password: '',
              email: '',
            });
            setIsEdit(false);
          }
        }

        }
        title={isEdit ? 'Edit Employee' : 'Add Employee'}

        content={formContent}
        action={
          < Button onClick={handleExternalSubmit} variant="contained" color="primary" >
            Submit
          </Button >
        }
      />
      {/* Addon Item Delete Modal */}
      <ConfirmDialog
        open={employeeDel.value}
        onClose={employeeDel.onFalse}
        title="Delete Employee"
        content="Are you sure want to delete this Employee?"
        action={
          <Button onClick={delFun} variant="contained" color="error">
            Confirm
          </Button>
        }
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.role));
  }

  return inputData;
}
