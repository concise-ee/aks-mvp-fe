import React from 'react';
import { Map } from 'ol';

interface ContextValue {
  map: Map | null;
}

const MapContext = React.createContext<ContextValue>({ map: null });

export default MapContext;
