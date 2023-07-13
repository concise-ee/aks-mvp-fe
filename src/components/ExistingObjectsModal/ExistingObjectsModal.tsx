import React, { useContext, useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DraggableResizableModal from '../map/DraggableResizableModal/DraggableResizableModal';
import ExistingObjectsTable from './ExistingObjectsTable/ExistingObjectsTable';
import ExistingObjectsFilter from './ExistingObjectsFilter/ExistingObjectsFilter';
import { getAllAccommodations, getFilteredAccommodations } from '../../utils/address-objects/address-objects-requests';
import { Accommodation, AccommodationFilter } from '../../utils/address-objects/address-objects-types';
import ChangeExistingObjectModal from '../ChangeExistingObjectModal/ChangeExistingObjectModal';
import ExistingObjectHistoryModal from '../ExistingObjectHistoryModal/ExistingObjectHistoryModal';
import { drawAddressObjectPoint } from '../../utils/map-utils';
import MapContext from '../map/MapContainer/MapContext';
import { EXISTING_OBJECTS } from '../../configs/path-configs';

const defaultFilter: AccommodationFilter = {
  searchString: '',
  countyId: null,
  municipalityId: null,
  createdAt: null,
};

const ExistingObjectsModal = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { map } = useContext(MapContext);
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<Accommodation[]>([]);
  const [filterValues, setFilterValues] = useState<AccommodationFilter>(defaultFilter);
  const [selectedAddressToEdit, setSelectedAddressToEdit] = useState<number | null>(null);
  const [selectedAddressHistory, setSelectedAddressHistory] = useState<any | null>(null);

  useEffect(() => {
    if (pathname === EXISTING_OBJECTS) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    fetchAccommodations();
  }, []);

  const fetchAccommodations = async () => {
    setData(await getAllAccommodations());
  };

  const handleFilterChange = (key: keyof AccommodationFilter, value: string | number | Date | null) => {
    setFilterValues((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleFetchFilteredAccommodations = async () => {
    setData(await getFilteredAccommodations(filterValues));
  };

  const selectAddressToEdit = (id: number) => {
    setSelectedAddressToEdit(id);
  };

  const selectAddresToViewHistory = (id: number, name: string) => {
    setSelectedAddressHistory({ id, name });
  };

  const patchCallback = (accommodation: Accommodation) => {
    const filteredData = data.filter((acc) => acc.id !== accommodation.id);
    setData([...filteredData, accommodation]);
    setSelectedAddressToEdit(null);
  };

  const handleShowOnMap = (accommodation: Accommodation) => {
    if (!map) return;

    const activeAddress = accommodation.addresses.filter((address) => address.active);
    const coordinates = [Number(activeAddress[0].centroidX), Number(activeAddress[0].centroidY)];

    drawAddressObjectPoint(map, coordinates, true);
  };

  return (
    <div>
      <ExistingObjectHistoryModal
        accommodation={selectedAddressHistory}
        onClose={() => setSelectedAddressHistory(null)}
      />
      <ChangeExistingObjectModal
        selectedAddressId={selectedAddressToEdit}
        onPatchCallback={patchCallback}
        onClose={() => setSelectedAddressToEdit(null)}
      />
      <DraggableResizableModal
        fullHeight
        open={open}
        title='Eksisteerivad objektid'
        defaultSize={[950, 700]}
        onClose={() => navigate('/')}
      >
        <Grid item container spacing={1} flexDirection='column' flexWrap='nowrap'>
          <Grid item flexShrink={0} flexBasis='auto'>
            <ExistingObjectsFilter
              onChange={handleFilterChange}
              filterValues={filterValues}
              onSubmit={handleFetchFilteredAccommodations}
            />
          </Grid>
          <Grid item flexGrow={1} xs={12}>
            <ExistingObjectsTable
              data={data}
              selectAddressToEdit={selectAddressToEdit}
              selectAddresToViewHistory={selectAddresToViewHistory}
              showOnMap={handleShowOnMap}
            />
          </Grid>
        </Grid>
      </DraggableResizableModal>
    </div>
  );
};

export default ExistingObjectsModal;
