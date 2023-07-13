import React, { useState } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { ButtonBase, LabelDisplayedRowsArgs, Paper } from '@mui/material';
import { Edit, History, Room } from '@mui/icons-material';
import { Accommodation, Address } from '../../../utils/address-objects/address-objects-types';
import { getEstonianDateString } from '../../../utils/general-utils';

interface Props {
  data: Accommodation[];
  selectAddressToEdit: (id: number) => void;
  selectAddresToViewHistory: (id: number, name: string) => void;
  showOnMap: (object: Accommodation) => void;
}

const getColumns = (
  onClickEdit: (id: number) => void,
  onClickView: (id: number, name: string) => void,
  showOnMap: (object: Accommodation) => void
): GridColDef<Accommodation>[] => [
  {
    field: 'name',
    headerName: 'Objekti nimi',
    flex: 2,
    minWidth: 120,
  },
  {
    field: 'addresses',
    headerName: 'Aktiivne aadress',
    flex: 4,
    minWidth: 250,
    valueGetter: (params: GridValueGetterParams) => {
      const activeAddress = params.row.addresses.filter((address: Address) => address.active);

      return activeAddress[0].address || '';
    },
  },
  {
    field: ' ',
    headerName: 'Viimane aadressi muudatuse aeg',
    flex: 2,
    minWidth: 120,
    valueGetter: (params: GridValueGetterParams) => {
      const activeAddress = params.row.addresses.filter((address: Address) => address.active);

      return getEstonianDateString(activeAddress[0].createdAt) || '';
    },
  },
  {
    field: '  ',
    headerName: '',
    flex: 0.5,
    minWidth: 40,
    sortable: false,
    disableColumnMenu: false,
    renderCell: (params) => (
      <ButtonBase>
        <Room color='primary' onClick={() => showOnMap(params.row as Accommodation)} />
      </ButtonBase>
    ),
  },
  {
    field: '   ',
    headerName: '',
    flex: 0.5,
    minWidth: 40,
    sortable: false,
    disableColumnMenu: false,
    renderCell: (params) => (
      <ButtonBase>
        <History color='primary' onClick={() => onClickView(params.row.id, params.row.name)} />
      </ButtonBase>
    ),
  },
  {
    field: '    ',
    headerName: '',
    flex: 0.5,
    minWidth: 40,
    sortable: false,
    disableColumnMenu: false,
    renderCell: (params) => (
      <ButtonBase>
        <Edit color='primary' onClick={() => onClickEdit(params.row.id)} />
      </ButtonBase>
    ),
  },
];

const StyledDataGridPaper = styled(Paper)({
  height: '100%',
  width: '100%',
  '& .MuiDataGrid-root': {
    border: 'none',
  },
  '& > .MuiDataGrid-columnSeparator': {
    visibility: 'hidden',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 600,
  },
  backgroundColor: 'rgba(0,0,0,0)',
});

const ExistingObjectsTable = ({ data, selectAddressToEdit, selectAddresToViewHistory, showOnMap }: Props) => (
  <StyledDataGridPaper>
    <DataGrid
      disableRowSelectionOnClick
      rows={data}
      columns={getColumns(selectAddressToEdit, selectAddresToViewHistory, showOnMap)}
      slotProps={{
        pagination: {
          labelRowsPerPage: 'Ridu lehel',
          labelDisplayedRows: (paginationInfo: LabelDisplayedRowsArgs) =>
            `näidatavad read tabelis: ${paginationInfo.from}-${paginationInfo.to} ridu kokku: ${paginationInfo.count}`,
        },
      }}
      localeText={{
        noRowsLabel: 'Andmed puuduvad',
      }}
    />
  </StyledDataGridPaper>
);

export default ExistingObjectsTable;
