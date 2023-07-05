import React, { useEffect, useMemo, useState } from 'react';
import { Autocomplete, Grid, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import { format, formatISO, parseISO, toDate } from 'date-fns';
import { County, Municipality } from '../../../utils/types';
import { getCounties, getMunicipalities } from '../../../utils/address-objects/address-objects-requests';
import { AccommodationFilter } from '../../../utils/address-objects/address-objects';

interface Props {
  onChange: (key: keyof AccommodationFilter, value: number | Date | null) => void;
  onSubmit: () => void;
  filterValues: AccommodationFilter;
}

const timeZone = 'Europe/Estonia';

const ExistingObjectsFilter = ({ onChange, onSubmit, filterValues }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [countyOptions, setCountyOptions] = useState<County[]>([]);
  const [municipalityOptions, setMunicipalityOptions] = useState<Municipality[]>([]);

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
          id='countyId'
          size='small'
          fullWidth
          options={countyOptions.map(({ name, id }) => ({
            label: name,
            value: id,
          }))}
          getOptionLabel={(option) => option.label}
          onChange={(event, newValue) => {
            onChange('countyId' as keyof AccommodationFilter, newValue?.value || null);
          }}
          renderInput={(params) => <TextField {...params} label='Maakond' />}
        />
      </Grid>
      <Grid item xs={3}>
        <Autocomplete
          id='municipalityId'
          size='small'
          fullWidth
          renderInput={(params) => <TextField {...params} label='Omavalitsus' />}
          options={municipalityOptions.map(({ name, id }) => ({ label: name, value: id }))}
          getOptionLabel={(option) => option.label}
          onChange={(event, newValue) => {
            onChange('municipalityId' as keyof AccommodationFilter, newValue?.value || null);
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <DatePicker
          label='Viimane muutmise kuupäev'
          format='dd.MM.yyyy'
          slotProps={{
            textField: {
              InputProps: { size: 'small', fullWidth: true },
            },
          }}
          onChange={(event) => {
            if (event) {
              const changedDate = new Date(event as Date);
              const timezoneOffset = changedDate.getTimezoneOffset() * 60000;
              const currentDate = new Date(changedDate.getTime() - timezoneOffset);
              onChange('createdAt', currentDate);
            } else {
              onChange('createdAt', null);
            }
          }}
        />
      </Grid>
      <Grid item>
        <LoadingButton loading={loading} variant='contained' color='primary' onClick={onSubmit}>
          Filtreeri
        </LoadingButton>
      </Grid>
    </Grid>
  );
};
export default ExistingObjectsFilter;
