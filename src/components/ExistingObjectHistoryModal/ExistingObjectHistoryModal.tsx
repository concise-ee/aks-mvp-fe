import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import DraggableResizableModal from '../map/DraggableResizableModal/DraggableResizableModal';
import { getAccommodationHistory } from '../../utils/address-objects/address-objects-requests';
import { Address } from '../../utils/address-objects/address-objects-types';
import { getEstonianDateString } from '../../utils/general-utils';

interface Props {
  accommodation: { id: number; name: string } | null;
  onClose: () => void;
}

const ExistingObjectHistoryModal = ({ accommodation, onClose }: Props) => {
  const [historyData, setHistoryData] = useState<Address[]>([]);

  useEffect(() => {
    if (accommodation) {
      fetchAccommodationHistory(accommodation.id);
    }
  }, [accommodation]);

  const fetchAccommodationHistory = async (id: number) => {
    const response = await getAccommodationHistory(id);

    if (response) {
      setHistoryData(response);
    }
  };

  const renderHistorySections = () => {
    if (historyData.length) {
      return historyData.map((data) => (
        <Grid container key={data.address} mt={1}>
          <Grid item xs={3}>
            <Typography>{getEstonianDateString(data.createdAt)}</Typography>
          </Grid>
          <Grid xs={9}>
            <Typography>{data.address}</Typography>
          </Grid>
        </Grid>
      ));
    }
    return (
      <Grid item xs={12} alignSelf='center' marginTop={2}>
        <Typography textAlign='center' fontWeight='bold'>
          Ajalugu puudub
        </Typography>
      </Grid>
    );
  };

  return (
    <DraggableResizableModal
      title='Ajalugu'
      open={!!accommodation}
      onClose={onClose}
      defaultSize={[450, 400]}
      left={1075}
    >
      <Grid container>
        <Grid item xs={3}>
          <Typography fontWeight='bold'>Objekti nimi</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography>{accommodation?.name}</Typography>
        </Grid>
      </Grid>
      {renderHistorySections()}
    </DraggableResizableModal>
  );
};

export default ExistingObjectHistoryModal;
