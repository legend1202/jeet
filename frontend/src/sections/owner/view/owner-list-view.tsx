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

import { deleteOwner, useGetOnwers } from 'src/api/owner';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { IOwner } from 'src/types/owner';

import OwnerForm from '../owner-edit-form';
import { RenderCellProduct } from '../owner-table-row';

// ----------------------------------------------------------------------

export default function OwnerListView() {
  const { enqueueSnackbar } = useSnackbar();

  const settings = useSettingsContext();

  const { owners, ownersLoading } = useGetOnwers();

  const [currentOwner, setCurrentOwner] = useState<IOwner>({ id: '', name: '' });

  const [openForm, setOpenForm] = useState<boolean>(false);

  const [tableData, setTableData] = useState<IOwner[]>([]);

  useEffect(() => {
    if (owners.length) {
      setTableData(owners);
    }
  }, [owners]);

  const handleDeleteRow = useCallback(
    async (id: string) => {
      const deletedData = await deleteOwner(id);
      if (deletedData.success) {
        const deleteRow = tableData.filter((row) => row.id !== id);

        enqueueSnackbar('Delete success!');

        setTableData(deleteRow);
      }
    },
    [enqueueSnackbar, tableData]
  );

  const handleEditRow = useCallback((data: IOwner) => {
    setCurrentOwner(data);
    setOpenForm(true);
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Username',
      flex: 1,
      minWidth: 360,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellProduct params={params} />,
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

  const handleUpdateData = (updatedResult: IOwner) => {
    const unchangedRow = tableData.filter((row) => row.id !== updatedResult.id);
    const updatedRow = [
      ...unchangedRow,
      { id: updatedResult.id, name: updatedResult.name, bio: updatedResult.bio },
    ];
    setTableData(updatedRow);
    setOpenForm(false);
    setCurrentOwner({ id: '', name: '' });
  };

  const onCloseForm = () => {
    setOpenForm(false);
    setCurrentOwner({ id: '', name: '' });
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
              name: 'Owner',
              href: paths.dashboard.owner.root,
            },
            { name: 'List' },
          ]}
          action={
            <Button onClick={handleNewOwnerPopOver} variant="contained">
              New Owner
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
            loading={ownersLoading}
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

      <Dialog fullWidth maxWidth="xs" open={openForm} onClose={onCloseForm}>
        <DialogTitle sx={{ minHeight: 76 }}>
          {openForm && <> {currentOwner?.id ? 'Edit Owner' : 'Add Owner'}</>}
        </DialogTitle>

        <OwnerForm
          currentOwner={currentOwner}
          handleUpdateData={handleUpdateData}
          onClose={onCloseForm}
        />
      </Dialog>
    </>
  );
}
