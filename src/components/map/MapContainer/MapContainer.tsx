import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Map, MapBrowserEvent } from 'ol';
import { CircularProgress } from '@mui/material';
import { debounce } from 'lodash';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';
import { Route, Routes } from 'react-router-dom';
import { unByKey } from 'ol/Observable';
import { useDispatch } from 'react-redux';
import { EventsKey } from 'ol/events';
import { Coordinate } from 'ol/coordinate';
import MapContext from './MapContext';
import { drawAddressObjectPoint, initMap, removeAddressObjectPointLayer } from '../../../utils/map-utils';
import mapConfig from '../../../configs/map-config';
import { EXISTING_OBJECTS, NEW_OBJECT } from '../../../configs/path-configs';
import ExistingObjectsModal from '../../ExistingObjectsModal/ExistingObjectsModal';
import NewObjectModal from '../../NewObjectModal/NewObjectModal';
import { SelectMode } from '../../../utils/types';
import AddressSearchContainer from '../AddressSearchContainer/AddressSearchContainer';
import { setClickCoordinate } from '../../../redux/slices/mapSlice';
import { useAppSelector } from '../../../redux/reduxHooks';
import ObjectInfoModal from '../AddressSearchContainer/ObjectInfoModal/ObjectInfoModal';
import { InAddress } from '../../../utils/address-objects/address-objects-types';
import { getAddressByCoordinates } from '../../../utils/address-objects/address-objects-requests';

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
  const dispatch = useDispatch();
  const [selectedAddress, setSelectedAddress] = useState<InAddress | null>(null);
  const [eventKey, setEventKey] = useState<EventsKey | EventsKey[] | null>(null);
  const containerWidth = useRef<number>(0);
  const [selectMode, setSelectMode] = useState<SelectMode>(SelectMode.INFO_MODAL);
  const [mapRef, setMapRef] = useState<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const clickCooordinate = useAppSelector((state) => state.map.clickCoordinate);

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

  useEffect(() => {
    if (clickCooordinate?.length && map && selectMode === SelectMode.INFO_MODAL) {
      handleFetchByCoordinates(map, clickCooordinate);
    }
  }, [clickCooordinate, map]);

  useEffect(() => {
    if (!map || !selectedAddress || clickCooordinate?.length) return;

    const coordinates = [Number(selectedAddress.viitepunkt_x), Number(selectedAddress.viitepunkt_y)];
    drawAddressObjectPoint(map, coordinates, true);
  }, [map, selectedAddress]);

  useEffect(() => {
    if (!map) return;

    if (eventKey) {
      unByKey(eventKey);
      setEventKey(null);
    }

    if (selectMode === SelectMode.INFO_MODAL) {
      const key = map.on('singleclick', handleAddressClickPosition);
      setEventKey(key);
    }
  }, [selectMode, map]);

  const handleFetchByCoordinates = async (mapObject: Map, coordinate: Coordinate) => {
    const response = await getAddressByCoordinates(coordinate[0], coordinate[1]);
    if (response?.addresses) {
      drawAddressObjectPoint(mapObject, coordinate);
      setSelectedAddress(response.addresses[0]);
    }
  };

  const handleAddressClickPosition = async ({ coordinate }: MapBrowserEvent<UIEvent>) => {
    if (!map) return;

    dispatch(setClickCoordinate(coordinate));
  };

  const setMode = (mode: SelectMode) => {
    setSelectMode(mode);
  };

  const handleAddressSelect = (address: InAddress | null) => {
    setSelectedAddress(address);
  };

  const handleInfoModalClose = () => {
    setSelectedAddress(null);
    if (map) {
      removeAddressObjectPointLayer(map);
    }
  };

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
            <div>
              <AddressSearchContainer selectAddress={handleAddressSelect} />
              <ObjectInfoModal data={selectedAddress} handleClose={handleInfoModalClose} />
            </div>
            <Routes>
              <Route path={EXISTING_OBJECTS} element={<ExistingObjectsModal />} />
              <Route
                path={NEW_OBJECT}
                element={
                  <NewObjectModal
                    selectMode={selectMode}
                    setMode={setMode}
                    isActive={selectMode === SelectMode.SET_POSITION}
                  />
                }
              />
            </Routes>
          </div>
        </Suspense>
      </MapContext.Provider>
    </div>
  );
};

export default MapContainer;
