import React, { useContext, useEffect, useRef, useState } from 'react';
import { Control } from 'ol/control';
import { IconButton, InputBase, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close, Search } from '@mui/icons-material';
import useDebounce from '../../../utils/hooks/useDebounce';
import { getAddresses } from '../../../utils/address-objects/address-objects-requests';
import { parseInAddressResponse } from '../../../utils/general-utils';
import { InAddress } from '../../../utils/address-objects/address-objects-types';
import ObjectInfoModal from './ObjectInfoModal/ObjectInfoModal';
import SearchResults from './SearchResults/SearchResults';
import MapContext from '../MapContainer/MapContext';
import { drawAddressObjectPoint, removeAddressObjectPointLayer } from '../../../utils/map-utils';

interface Props {
  selectAddress: (address: InAddress | null) => void;
}

const StyledPaper = styled(Paper)({
  display: 'flex',
  position: 'absolute',
  width: '100%',
  background: 'white',
  maxWidth: '320px',
  left: '54px',
  top: '16px',
  zIndex: 100,
});

const AddressSearchContainer = ({ selectAddress }: Props) => {
  const { map } = useContext(MapContext);
  const selectRef = useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<InAddress[]>([]);

  const debouncedValue = useDebounce<string>(searchValue, 300);

  useEffect(() => {
    if (!map || !selectRef.current) return;

    const selectControl = new Control({
      element: selectRef.current,
    });

    map.addControl(selectControl);
  }, [selectRef]);

  useEffect(() => {
    if (debouncedValue.length > 1) {
      fetchAddresses(debouncedValue);
    }
  }, [debouncedValue]);

  const fetchAddresses = async (value: string) => {
    setLoading(true);
    const response = await getAddresses(value);
    setLoading(false);

    if (response?.addresses) {
      setSearchResults(response.addresses);
    }
  };

  const handleClear = () => {
    setSearchResults([]);
    setSearchValue('');
  };

  const handleChangeSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleAddressSelect = (address: InAddress) => {
    setSearchResults([]);
    setSearchValue('');
    selectAddress(address);
  };

  return (
    <div>
      <div ref={selectRef}>
        <StyledPaper>
          <IconButton>
            <Search color='primary' />
          </IconButton>
          <InputBase
            fullWidth
            value={searchValue}
            onChange={handleChangeSearchValue}
            placeholder='otsi'
            endAdornment={
              <IconButton size='small' onClick={handleClear}>
                <Close />
              </IconButton>
            }
          />
        </StyledPaper>
        <SearchResults searchResults={searchResults} selectAddress={handleAddressSelect} />
      </div>
    </div>
  );
};

export default AddressSearchContainer;
