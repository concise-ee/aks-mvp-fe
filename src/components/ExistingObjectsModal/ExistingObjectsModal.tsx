import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import DraggableResizableModal from '../map/DraggableResizableModal/DraggableResizableModal';
import ExistingObjectsTable from './ExistingObjectsTable/ExistingObjectsTable';
import { AddressObject } from '../../utils/address-objects/address-objects';
import ExistingObjectsFilter from './ExistingObjectsFilter/ExistingObjectsFilter';

const ExistingObjectsModal = () => {
  const [data, setData] = useState<AddressObject[]>([]);
  return (
    <DraggableResizableModal open title='Eksisteerivad objektid' defaultSize={[1200, 700]}>
      <Grid item container spacing={1} flexDirection='column' flexWrap='nowrap'>
        <Grid item flexShrink={0} flexBasis='auto'>
          <ExistingObjectsFilter />
        </Grid>
        <Grid item flexGrow={1} xs={12}>
          <ExistingObjectsTable data={data} />
        </Grid>
      </Grid>
    </DraggableResizableModal>
  );
};

export default ExistingObjectsModal;
