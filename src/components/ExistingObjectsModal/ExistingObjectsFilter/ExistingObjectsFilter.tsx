import React, { useEffect, useState } from 'react';
import { Autocomplete, Button, Grid, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { County, Municipality } from '../../../utils/types';
import { getCounties, getMunicipalities } from '../../../utils/address-objects/address-objects-requests';
import { AccommodationFilter } from '../../../utils/address-objects/address-objects-types';

interface Props {
  onChange: (key: keyof AccommodationFilter, value: string | number | Date | null) => void;
  onSubmit: () => void;
  filterValues: AccommodationFilter;
}

const ExistingObjectsFilter = ({ onChange, filterValues, onSubmit }: Props) => {
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
    <Grid container spacing={1} alignItems='flex-end'>
      <Grid item xs={12}>
        <Typography variant='h6'>Filter</Typography>
      </Grid>
      <Grid item xs={2.5}>
        <Grid fontSize='0.875rem'>Nimi või aadress</Grid>
        <TextField
          fullWidth
          size='small'
          value={filterValues.searchString}
          onChange={(event) => onChange('searchString', event.target.value)}
        />
      </Grid>
      <Grid item xs={2.5}>
        <Grid fontSize='0.875rem'>Maakond</Grid>
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
          renderInput={(params) => <TextField {...params} />}
        />
      </Grid>
      <Grid item xs={2.5}>
        <Grid fontSize='0.875rem'>Omavalitsus</Grid>
        <Autocomplete
          id='municipalityId'
          size='small'
          fullWidth
          options={municipalityOptions.map(({ name, id }) => ({ label: name, value: id }))}
          getOptionLabel={(option) => option.label}
          onChange={(event, newValue) => {
            onChange('municipalityId' as keyof AccommodationFilter, newValue?.value || null);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </Grid>
      <Grid item xs={3}>
        <Grid fontSize='0.875rem'>Viimane muutus (alates)</Grid>
        <DatePicker
          format='dd.MM.yyyy'
          localeText={{
            fieldDayPlaceholder: () => 'pp',
            fieldMonthPlaceholder: () => 'kk',
            fieldYearPlaceholder: () => 'aaaa',
            clearButtonLabel: 'Puhasta'
          }}
          slotProps={{
            textField: {
              InputProps: { size: 'small', fullWidth: true },
            },
            actionBar: { actions: ['clear'] }
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
      <Grid item xs={1.5}>
        <Button color='primary' onClick={onSubmit}>
          Filtreeri
        </Button>
      </Grid>
    </Grid>
  );
};
export default ExistingObjectsFilter;
