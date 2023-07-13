import React from 'react';
import { List, ListItem, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { InAddress } from '../../../../utils/address-objects/address-objects-types';

interface Props {
  searchResults: InAddress[];
  selectAddress: (address: InAddress) => void;
}

const StyledDiv = styled('div')({
  position: 'absolute',
  width: '320px',
  left: '30px',
  zIndex: 100,
  top: '46px',
  padding: '24px',
});

const SearchResults = ({ searchResults, selectAddress }: Props) => {
  const renderSearchResults = () =>
    searchResults.map((address) => (
      <ListItem key={address.ads_oid} sx={{ cursor: 'pointer' }} onClick={() => selectAddress(address)}>
        {address.pikkaadress}
      </ListItem>
    ));

  return (
    <StyledDiv>
      {searchResults.length ? (
        <List component={Paper} elevation={1}>
          {renderSearchResults()}
        </List>
      ) : null}
    </StyledDiv>
  );
};

export default SearchResults;
