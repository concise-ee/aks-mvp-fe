import React, { useState } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { ButtonBase, Paper } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { Accommodation, Address } from '../../../utils/address-objects/address-objects';
import { getEstonianDateString } from '../../../utils/general-utils';
import ChangeExistingObjectModal from '../../ChangeExistingObjectModal/ChangeExistingObjectModal';

interface Props {
  data: Accommodation[];
}

const getColumns = (onClick: (id: number) => void): GridColDef<Accommodation>[] => [
  {
    field: 'name',
    headerName: 'Objekti nimi',
    flex: 2,
    minWidth: 120,
  },
  {
    field: 'addresses',
    headerName: 'Aktiivne aadress',
    flex: 3,
    minWidth: 200,
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
    headerName: 'Muuda',
    flex: 1,
    minWidth: 120,
    renderCell: (params) => (
      <ButtonBase>
        <Edit color='primary' onClick={() => onClick} />
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

const ExistingObjectsTable = ({ data }: Props) => {
  const [selectedAddress, setSelectedAddress] = useState<number>();

  const selectAddress = (id: number) => {
    setSelectedAddress(id);
  };

  return (
    <>
      <ChangeExistingObjectModal selectedAddressId={selectedAddress} />
      <StyledDataGridPaper>
        <DataGrid columns={getColumns(selectAddress)} rows={data} />
      </StyledDataGridPaper>
    </>
  );
};

export default ExistingObjectsTable;
