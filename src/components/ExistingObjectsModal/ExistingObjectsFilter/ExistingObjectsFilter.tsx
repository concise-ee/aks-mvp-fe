import React, { useEffect, useState } from 'react';
import { Autocomplete, Grid, TextField, Typography } from '@mui/material';
import { LoadingButton, DatePicker } from '@mui/lab';
import useApi from '../../../utils/hooks/useApi';
import { getCounties, getMunicipalities } from '../../../utils/address-objects/address-objects-requests';

interface Props {
  onChange?: () => void;
}

interface AddressFilter {
  county: string;
  municipality: string;
  lastChange: Date;
}

const ExistingObjectsFilter = ({ onChange }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [countyOptions, setCountyOptions] = useState<any[]>([]);
  const [municipalityOptions, setMunicipalityOptions] = useState<any[]>([]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    setCountyOptions(await getCounties());
    setMunicipalityOptions(await getMunicipalities());
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography>Filter</Typography>
      </Grid>
      <Grid item xs={3}>
        <Autocomplete
          size='small'
          fullWidth
          renderInput={(params) => <TextField {...params} label='Maakond' />}
          options={[]}
        />
      </Grid>
      <Grid item xs={3}>
        <Autocomplete
          size='small'
          fullWidth
          renderInput={(params) => <TextField {...params} label='Omavalitsus' />}
          options={[]}
        />
      </Grid>
      <Grid item xs={3}>
        <DatePicker
          label='Viimane muutmise kuupäev'
          // inputFormat='dd.MM.yyyy'
          renderInput={(params: any) => (
            <TextField
              {...params}
              inputProps={{
                ...params.inputProps,
                placeholder: '',
              }}
              style={{ margin: '5px' }}
              size='small'
              fullWidth
              variant='outlined'
              error={false}
            />
          )}
        />
      </Grid>
      <Grid item>
        <LoadingButton loading={loading} variant='contained' color='primary'>
          Filtreeri
        </LoadingButton>
      </Grid>
    </Grid>
  );
};
export default ExistingObjectsFilter;
