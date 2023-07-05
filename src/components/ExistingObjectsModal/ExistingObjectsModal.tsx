import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import DraggableResizableModal from '../map/DraggableResizableModal/DraggableResizableModal';
import ExistingObjectsTable from './ExistingObjectsTable/ExistingObjectsTable';
import ExistingObjectsFilter from './ExistingObjectsFilter/ExistingObjectsFilter';
import {
  getAllAccommodations,
  getCounties,
  getFilteredAccommodations,
  getMunicipalities,
} from '../../utils/address-objects/address-objects-requests';
import { County, Municipality } from '../../utils/types';
import { AccommodationFilter } from '../../utils/address-objects/address-objects';

const defaultFilter: AccommodationFilter = {
  countyId: null,
  municipalityId: null,
  createdAt: null,
};

const ExistingObjectsModal = () => {
  const [data, setData] = useState<any[]>([]);
  const [filterValues, setFilterValues] = useState<AccommodationFilter>(defaultFilter);

  useEffect(() => {
    fetchAccommodations();
  }, []);

  const fetchAccommodations = async () => {
    setData(await getAllAccommodations());
  };

  const handleFilterChange = (key: keyof AccommodationFilter, value: number | Date | null) => {
    setFilterValues((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleFetchFilteredAccommodations = async () => {
    setData(await getFilteredAccommodations(filterValues));
  };

  return (
    <DraggableResizableModal open title='Eksisteerivad objektid' defaultSize={[1200, 700]}>
      <Grid item container spacing={1} flexDirection='column' flexWrap='nowrap'>
        <Grid item flexShrink={0} flexBasis='auto'>
          <ExistingObjectsFilter
            onChange={handleFilterChange}
            filterValues={filterValues}
            onSubmit={handleFetchFilteredAccommodations}
          />
        </Grid>
        <Grid item flexGrow={1} xs={12}>
          <ExistingObjectsTable data={data} />
        </Grid>
      </Grid>
    </DraggableResizableModal>
  );
};

export default ExistingObjectsModal;
