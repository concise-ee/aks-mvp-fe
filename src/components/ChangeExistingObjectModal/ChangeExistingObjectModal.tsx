import React, { useState } from 'react';
import { Dialog, DialogTitle } from '@mui/material';

interface Props {
  selectedAddressId: number | undefined;
}

const ChangeExistingObjectModal = ({ selectedAddressId }: Props) => {
  const [newAddress, setNewAddress] = useState<string>();

  return (
    <Dialog open={!!selectedAddressId}>
      <DialogTitle>Muuda aadress</DialogTitle>
    </Dialog>
  );
};

export default ChangeExistingObjectModal;
