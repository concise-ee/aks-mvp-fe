import React from 'react';
import { Grid, Typography } from '@mui/material';
import { InAddress } from '../../../../utils/address-objects/address-objects-types';
import DraggableResizableModal from '../../DraggableResizableModal/DraggableResizableModal';

interface Props {
  data: InAddress | null;
  handleClose: () => void;
}

const ObjectInfoModal = ({ data, handleClose }: Props) => (
  <div>
    <DraggableResizableModal open={!!data} title='Info' onClose={handleClose} defaultSize={[500, 350]}>
      <Grid container spacing={1}>
        {data?.nimi ? (
          <>
            <Grid item xs={3}>
              <Typography>Nimi</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography>{data?.nimi}</Typography>
            </Grid>
          </>
        ) : null}
        <Grid item xs={3}>
          <Typography>Aadress</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography>{data?.pikkaadress}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography>Tunnus</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography>{data?.tunnus}</Typography>
        </Grid>
      </Grid>
    </DraggableResizableModal>
  </div>
);

export default ObjectInfoModal;
