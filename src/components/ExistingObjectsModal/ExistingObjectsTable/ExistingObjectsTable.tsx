import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';
import { AddressObject } from '../../../utils/address-objects/address-objects';

interface Props {
  data: AddressObject[];
}

const columns: GridColDef<AddressObject>[] = [
  {
    field: 'name',
    headerName: 'Objekti nimi',
    flex: 3,
    minWidth: 120,
  },
  {
    field: 'activeAddress',
    headerName: 'Aktiivne aadress',
    flex: 3,
    minWidth: 120,
  },
  {
    field: ' ',
    headerName: 'Viimane aadressi muudatuse aeg',
    flex: 3,
    minWidth: 120,
  },
  {
    field: '  ',
    headerName: '',
    flex: 3,
    minWidth: 120,
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

const ExistingObjectsTable = ({ data }: Props) => {
  const test = '';

  // @ts-ignore
  return (
    <StyledDataGridPaper>
      <DataGrid columns={columns} rows={data} />
    </StyledDataGridPaper>
  );
};

export default ExistingObjectsTable;
