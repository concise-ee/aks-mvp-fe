import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import {ButtonBase, LabelDisplayedRowsArgs, Paper, Grid, Tooltip} from '@mui/material';
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
    field: 'addressess',
    headerName: 'Aktiivne aadress',
    flex: 4,
    minWidth: 250,
    valueGetter: (params: GridValueGetterParams) => {
      const activeAddress = params.row.addresses.find((address: Address) => address.active);

      return activeAddress?.address || '';
    },
  },
  {
    field: 'lastModified',
    headerName: 'Viimane aadressi muudatuse aeg',
    flex: 2,
    minWidth: 120,
    valueGetter: (params: GridValueGetterParams) => {
      const activeAddress = params.row.addresses.find((address: Address) => address.active);
      return getEstonianDateString(activeAddress?.createdAt) || '';
    },
  },
  {
    field: '  ',
    headerName: '',
    minWidth: 120,
    sortable: false,
    disableColumnMenu: false,
    renderCell: (params) => (
      <Grid container spacing={1}>
        <Grid item>
          <Tooltip title='Kuva kaardil'>
            <ButtonBase>
              <Room color='primary' onClick={() => showOnMap(params.row as Accommodation)}/>
            </ButtonBase>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title='Kuva aadresside ajalugu'>
            <ButtonBase>
              <History color='primary' onClick={() => onClickView(params.row.id, params.row.name)}/>
            </ButtonBase>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title='Muuda aadressi'>
            <ButtonBase>
              <Edit color='primary' onClick={() => onClickEdit(params.row.id)}/>
            </ButtonBase>
          </Tooltip>
        </Grid>
      </Grid>
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
      getRowId={(address: Accommodation) => address.id}
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
