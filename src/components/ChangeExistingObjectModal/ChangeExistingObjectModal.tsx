import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Autocomplete,
  TextField,
  DialogActions,
  IconButton,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Close } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getAddresses, patchAccommodation } from '../../utils/address-objects/address-objects-requests';
import useDebounce from '../../utils/hooks/useDebounce';
import { Accommodation } from '../../utils/address-objects/address-objects-types';

interface Props {
  selectedAddressId: number | null;
  onPatchCallback: (accommodation: Accommodation) => void;
  onClose: () => void;
}

const ChangeExistingObjectModal = ({ selectedAddressId, onPatchCallback, onClose }: Props) => {
  const [addressOptions, setAddresOptions] = useState<any[]>([]);
  const [newAddress, setNewAddress] = useState<string>('');
  const [selectedAddress, setSelectedAddres] = useState<string>();
  const [loadingOptions, setLoadingOptions] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const debouncedValue = useDebounce<string>(newAddress, 300);

  useEffect(() => {
    if (debouncedValue.length > 1) {
      fetchAddresses(debouncedValue);
    }
  }, [debouncedValue]);

  const handleValueChange = (value: string) => {
    setNewAddress(value);
  };

  const handleValueSelect = (value: string | undefined) => {
    setSelectedAddres(value);
  };

  const fetchAddresses = async (value: string) => {
    setLoadingOptions(true);
    const response = await getAddresses(value);
    setLoadingOptions(false);

    if (response?.addresses) {
      setAddresOptions(response.addresses);
    }
  };

  const updateAccommodation = async () => {
    if (!selectedAddressId || !selectedAddress?.length) return;

    setLoading(true);
    const patchResponse = await patchAccommodation(selectedAddressId, selectedAddress);
    setLoading(false);

    if (patchResponse) {
      toast.success('Aadress edukalt muudetud!');
      onPatchCallback(patchResponse);
    } else {
      toast.error('Aadressi muutmisel esines viga.');
    }
  };

  return (
    <Dialog open={!!selectedAddressId} maxWidth='xs' fullWidth onClose={onClose}>
      <DialogTitle sx={{ alignItems: 'center' }}>
        Muuda aadress
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>{' '}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
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
              options={addressOptions.map(({ ads_oid, pikkaadress }) => ({ label: pikkaadress, value: ads_oid }))}
              onChange={(event, newValue) => handleValueSelect(newValue?.value)}
              renderInput={(params) => (
                <TextField {...params} onChange={(event) => handleValueChange(event.target.value)} />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <LoadingButton variant='contained' loading={loading} onClick={updateAccommodation}>
          Muuda
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeExistingObjectModal;
