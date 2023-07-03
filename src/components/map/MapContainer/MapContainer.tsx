import React, { useMemo, useState, Suspense, useEffect, useRef } from 'react';
import { Map } from 'ol';
import { CircularProgress } from '@mui/material';
import { debounce } from 'lodash';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';
import BaseLayer from 'ol/layer/Base';
import { Route, Routes } from 'react-router-dom';
import MapContext from './MapContext';
import { initMap } from '../../../utils/map-utils';
import mapConfig from '../../../configs/map-config';
import { EXISTING_OBJECTS } from '../../../configs/path-configs';
import ExistingObjectsModal from '../../ExistingObjectsModal/ExistingObjectsModal';

const { projectionName, projectionDef } = mapConfig;
proj4.defs(projectionName, projectionDef);
register(proj4);

const createResizeObserver = (width: number, observable: HTMLDivElement): ResizeObserver => {
  const resizeObserver = new ResizeObserver(
    debounce((entries: ResizeObserverEntry[]) => {
      width = entries[0].contentRect.width;
    }, 100)
  );
  resizeObserver.observe(observable);
  return resizeObserver;
};

const MapContainer = () => {
  const containerWidth = useRef<number>(0);
  const [mapRef, setMapRef] = useState<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map | null>(null);

  const mapValue = useMemo(() => ({ map }), [map]);

  useEffect(() => {
    if (!mapRef) return;

    const mapObject = initMap(mapRef);
    setMap(mapObject);

    const mapSize = mapObject.getSize();
    containerWidth.current = mapSize ? mapSize[0] : 0;
    const resizeObserver = createResizeObserver(containerWidth.current, mapRef);

    return () => {
      mapObject.setTarget(undefined);
      resizeObserver.disconnect();
    };
  }, [mapRef]);

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <MapContext.Provider value={mapValue}>
        <Suspense fallback={<CircularProgress />}>
          <div
            ref={(el: HTMLDivElement | null) => {
              setMapRef(el);
            }}
            style={{ height: '100%' }}
          >
            <Routes>
              <Route path={EXISTING_OBJECTS} element={<ExistingObjectsModal />} />
            </Routes>
          </div>
        </Suspense>
      </MapContext.Provider>
    </div>
  );
};

export default MapContainer;
