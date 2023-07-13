import React, { useContext, useEffect, useState } from 'react';
import { Autocomplete, Button, Grid, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { MapBrowserEvent } from 'ol';
import { useDispatch } from 'react-redux';
import { EventsKey } from 'ol/events';
import { unByKey } from 'ol/Observable';
import { Coordinate } from 'ol/coordinate';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { setClickCoordinate } from '../../redux/slices/mapSlice';
import DraggableResizableModal from '../map/DraggableResizableModal/DraggableResizableModal';
import { NewAccommodation, ParsedInAddressResponse } from '../../utils/address-objects/address-objects-types';
import {
  addNewAccommodation,
  getAddressByCoordinates,
  getAddresses,
} from '../../utils/address-objects/address-objects-requests';
import useDebounce from '../../utils/hooks/useDebounce';
import MapContext from '../map/MapContainer/MapContext';
import { SelectMode } from '../../utils/types';
import { useAppSelector } from '../../redux/reduxHooks';
import { parseInAddressResponse } from '../../utils/general-utils';
import { NEW_OBJECT } from '../../configs/path-configs';
import { drawAddressObjectPoint } from '../../utils/map-utils';

const initialAccommodation = {} as NewAccommodation;

interface Props {
  selectMode: SelectMode;
  setMode: (mode: SelectMode) => void;
  isActive: boolean;
}

const NewObjectModal = ({ selectMode, setMode, isActive }: Props) => {
  const { map } = useContext(MapContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const [eventKey, setEventKey] = useState<EventsKey | EventsKey[] | null>(null);
  const [loadingOptions, setLoadingOptions] = useState<boolean>(false);
  const [addressOptions, setAddresOptions] = useState<ParsedInAddressResponse[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<ParsedInAddressResponse | null>(null);
  const [newAddress, setNewAddress] = useState<string>('');
  const [newAccommodation, setNewAccommodation] = useState<NewAccommodation>(initialAccommodation);
  const [loading, setLoading] = useState<boolean>(false);
  const clickCooordinate = useAppSelector((state) => state.map.clickCoordinate);

  const debouncedValue = useDebounce<string>(newAddress, 300);

  useEffect(() => {
    if (pathname === NEW_OBJECT) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (debouncedValue.length > 1) {
      fetchAddresses(debouncedValue);
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (!map) return;

    if (clickCooordinate?.length && selectMode === SelectMode.SET_POSITION) {
      fetchObjectByCoordiantes(clickCooordinate);
    }
  }, [map, clickCooordinate]);

  useEffect(() => {
    if (clickCooordinate?.length && addressOptions.length) {
      setSelectedAddress(addressOptions[0]);
    }
  }, [addressOptions]);

  const fetchObjectByCoordiantes = async (coordinate: Coordinate) => {
    const response = await getAddressByCoordinates(coordinate[0], coordinate[1]);

    if (response?.addresses) {
      const parsedResponse = parseInAddressResponse(response);

      setAddresOptions(parsedResponse);
      setNewAccommodation((prevState) => ({ ...prevState, adsOid: parsedResponse[0].value }));
      if (map) {
        drawAddressObjectPoint(map, coordinate);
      }
    }
  };

  useEffect(() => {
    if (!map) return;

    if (eventKey) {
      unByKey(eventKey);
      setEventKey(null);
    }

    if (isActive) {
      const key = map.on('singleclick', handleClickPosition);
      setEventKey(key);
    }
  }, [isActive, map]);

  const handleClickPosition = async ({ coordinate }: MapBrowserEvent<UIEvent>) => {
    if (!map) return;

    dispatch(setClickCoordinate(coordinate));
    setMode(SelectMode.INFO_MODAL);
  };

  const fetchAddresses = async (value: string) => {
    setLoadingOptions(true);
    const response = await getAddresses(value);
    setLoadingOptions(false);

    if (response?.addresses) {
      setAddresOptions(parseInAddressResponse(response));
    }
  };

  const handleAddresValueChange = (value: string) => {
    setNewAddress(value);
  };

  const handleChangeAccommodationValueChange = (key: keyof NewAccommodation, value: string | null) => {
    setNewAccommodation((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleAddressSelectWithCoordinates = () => {
    setMode(SelectMode.SET_POSITION);
    toast.info('Vali asukoht kaardile vajutades.');
  };

  const handleAddNewAccommodation = async () => {
    if (!newAccommodation.name) {
      toast.error('Nimi väli peab olema täidetud.');
      return;
    }

    if (!newAccommodation.adsOid) {
      toast.error('Aadressi väli peab olema täidetud.');
      return;
    }

    setLoading(true);
    const resposne = await addNewAccommodation(newAccommodation);
    setLoading(false);

    if (resposne) {
      handleResetValues();
      toast.success('Uus objekt edukalt lisatud!');
    } else {
      toast.error('Uue objekti lisamisel esines viga.');
    }
  };

  const handleResetValues = () => {
    setAddresOptions([]);
    setSelectedAddress(null);
    setNewAddress('');
    dispatch(setClickCoordinate(null));
    setNewAccommodation(initialAccommodation);
    setMode(SelectMode.INFO_MODAL);
  };

  const handleClearAddress = () => {
    setAddresOptions([]);
    dispatch(setClickCoordinate(null));
    setSelectedAddress(null);
    handleChangeAccommodationValueChange('adsOid', null);
  };

  const handleClose = () => {
    handleResetValues();
    navigate('/');
  };

  return (
    <div>
      <DraggableResizableModal open={open} title='Uue objekti lisamine' defaultSize={[500, 500]} onClose={handleClose}>
        <Grid container spacing={2}>
          <Grid container item>
            <Grid item xs={3}>
              <Typography>Nimi</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                size='small'
                fullWidth
                value={newAccommodation.name || ''}
                onChange={(event) => handleChangeAccommodationValueChange('name', event.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container item>
            <Grid item xs={3}>
              <Typography>Aadress</Typography>
            </Grid>
            <Grid item xs={9}>
              <Autocomplete
                fullWidth
                size='small'
                noOptionsText='Aadressid puuduvad'
                loading={loadingOptions}
                loadingText='Pärimine...'
                options={addressOptions}
                value={selectedAddress}
                onChange={(event, newValue, reason) => {
                  if (reason === 'clear') {
                    handleClearAddress();
                  } else {
                    handleChangeAccommodationValueChange('adsOid', newValue?.value as string);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder='Aadressi valimiseks alustage kirjutamist'
                    onChange={(event) => handleAddresValueChange(event.target.value)}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid container mt={1}>
          <Grid item alignSelf='start'>
            <Button onClick={handleAddressSelectWithCoordinates}>Vali kaardil</Button>
          </Grid>
        </Grid>
        <Grid container justifyContent='flex-end'>
          <Grid item alignSelf='end'>
            <LoadingButton variant='contained' loading={loading} onClick={handleAddNewAccommodation}>
              Lisa
            </LoadingButton>
          </Grid>
        </Grid>
      </DraggableResizableModal>
    </div>
  );
};

export default NewObjectModal;
