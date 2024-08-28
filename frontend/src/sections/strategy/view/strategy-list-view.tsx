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

import { deleteStrategy, useGetStrategy } from 'src/api/strategy';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { ISTRATEGY, ITSTRATEGY } from 'src/types/strategy';

import OwnerForm from '../strategy-edit-form';
import { RenderCellProduct } from '../strategy-table-row';

// ----------------------------------------------------------------------

export default function StrategyListView() {
  const { enqueueSnackbar } = useSnackbar();

  const settings = useSettingsContext();

  const { strategies, strategiesLoading } = useGetStrategy();

  const [currentStrategy, setCurrentStrategy] = useState<ITSTRATEGY>();

  const [openForm, setOpenForm] = useState<boolean>(false);

  const [tableData, setTableData] = useState<ITSTRATEGY[]>([]);

  useEffect(() => {
    if (strategies.length) {
      setTableData(strategies);
    }
  }, [strategies]);

  const handleDeleteRow = useCallback(
    async (id: string) => {
      const deletedData = await deleteStrategy(id);
      if (deletedData.success) {
        const deleteRow = tableData.filter((row) => row.id !== id);

        enqueueSnackbar('Delete success!');

        setTableData(deleteRow);
      }
    },
    [enqueueSnackbar, tableData]
  );

  const handleEditRow = useCallback((data: ISTRATEGY) => {
    setCurrentStrategy(data);
    setOpenForm(true);
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Telegram User Name',
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

  const handleUpdateData = (updatedResult: ITSTRATEGY) => {
    setCurrentStrategy({});
    const unchangedRow = tableData.filter((row) => row.id !== updatedResult.id);
    const updatedRow = [...unchangedRow, updatedResult];
    setTableData(updatedRow);
    setOpenForm(false);
  };

  const onCloseForm = () => {
    setCurrentStrategy({});
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
              name: 'Strategy',
              href: paths.dashboard.owner.root,
            },
            { name: 'List' },
          ]}
          action={
            <Button onClick={handleNewOwnerPopOver} variant="contained">
              New Strategy
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
            loading={strategiesLoading}
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
          {openForm && <> {currentStrategy?.id ? 'Edit Strategy' : 'Add Strategy'}</>}
        </DialogTitle>

        <OwnerForm
          currentStrategy={currentStrategy}
          handleUpdateData={handleUpdateData}
          onClose={onCloseForm}
        />
      </Dialog>
    </>
  );
}
