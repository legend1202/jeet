'use client';

import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Dialog, DialogTitle } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { deleteTwitterAccount, useGetTwitterAccount } from 'src/api/twitterAccount';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { ITwitterAccount, ITTwitterAccount } from 'src/types/twitter';

import OwnerForm from '../twitterAccount-edit-form';
import {
  RenderCellSB,
  RenderCellAge,
  RenderCellTrb,
  RenderCellOwner,
  RenderCellGhosty,
  RenderCellStrategy,
  RenderCellUserName,
} from '../twitterAccount-table-row';

// ----------------------------------------------------------------------

export default function TwitterAccountListView() {
  const { enqueueSnackbar } = useSnackbar();

  const settings = useSettingsContext();

  const { twitterAccounts, twitterAccountsLoading } = useGetTwitterAccount();

  const [currentTwitterAccount, setCurrentTwitterAccount] = useState<ITTwitterAccount>();

  const [openForm, setOpenForm] = useState<boolean>(false);

  const [tableData, setTableData] = useState<ITwitterAccount[]>([]);

  useEffect(() => {
    if (twitterAccounts.length) {
      setTableData(twitterAccounts);
    }
  }, [twitterAccounts]);

  const handleDeleteRow = useCallback(
    async (id: string) => {
      const deletedData = await deleteTwitterAccount(id);
      if (deletedData.success) {
        const deleteRow = tableData.filter((row) => row.id !== id);

        enqueueSnackbar('Delete success!');

        setTableData(deleteRow);
      }
    },
    [enqueueSnackbar, tableData]
  );

  const handleEditRow = useCallback((data: ITTwitterAccount) => {
    setCurrentTwitterAccount(data);
    setOpenForm(true);
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'User Name',
      flex: 1,
      minWidth: 140,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellUserName params={params} />,
    },
    {
      field: 'sb',
      headerName: 'Search Ban',
      flex: 1,
      minWidth: 140,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellSB params={params} />,
    },
    {
      field: 'vstatus',
      headerName: 'Visiblity Status',
      flex: 1,
      minWidth: 140,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellGhosty params={params} />,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 140,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellTrb params={params} />,
    },
    {
      field: 'owner',
      headerName: 'Owner',
      flex: 1,
      minWidth: 140,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellOwner params={params} />,
    },
    {
      field: 'strategy',
      headerName: 'Strategy',
      flex: 1,
      minWidth: 140,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellStrategy params={params} />,
    },
    {
      field: 'age',
      headerName: 'Age',
      flex: 1,
      minWidth: 140,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellAge params={params} />,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => handleEditRow(params.row)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => {
            handleDeleteRow(params.row.id);
          }}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  const handleNewOwnerPopOver = () => {
    setOpenForm(true);
  };

  const handleUpdateData = (updatedResult: ITwitterAccount) => {
    setCurrentTwitterAccount({});
    const unchangedRow = tableData.filter((row) => row.id !== updatedResult.id);
    const updatedRow = [...unchangedRow, updatedResult];
    setTableData(updatedRow);
    setOpenForm(false);
  };

  const onCloseForm = () => {
    setCurrentTwitterAccount({});
    setOpenForm(false);
  };

  return (
    <>
      <Container
        maxWidth={settings.themeStretch ? false : 'lg'}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'Twitter Account',
              href: paths.dashboard.owner.root,
            },
            { name: 'List' },
          ]}
          action={
            <Button onClick={handleNewOwnerPopOver} variant="contained">
              New Account
            </Button>
          }
          sx={{
            mb: {
              xs: 3,
              md: 5,
            },
          }}
        />

        <Card
          sx={{
            height: { xs: 800, md: 2 },
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            checkboxSelection
            disableRowSelectionOnClick
            rows={tableData}
            columns={columns}
            loading={twitterAccountsLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            slots={{
              toolbar: () => (
                <GridToolbarContainer>
                  <GridToolbarQuickFilter />
                </GridToolbarContainer>
              ),
              noRowsOverlay: () => <EmptyContent title="No Data" />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
          />
        </Card>
      </Container>

      <Dialog fullWidth maxWidth="md" open={openForm} onClose={onCloseForm}>
        <DialogTitle sx={{ minHeight: 76 }}>
          {openForm && <> {currentTwitterAccount?.id ? 'Edit Account' : 'Add Account'}</>}
        </DialogTitle>

        <OwnerForm
          currentTwitterAccount={currentTwitterAccount}
          handleUpdateData={handleUpdateData}
          onClose={onCloseForm}
        />
      </Dialog>
    </>
  );
}
