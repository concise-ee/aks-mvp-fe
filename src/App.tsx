import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import etLocale from 'date-fns/locale/et';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import { EDIT_OBJECT, NEW_OBJECT } from './configs/path-configs';
import MapContainer from './components/map/MapContainer/MapContainer';

const App = () => (
  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={etLocale}>
    <Suspense fallback={<LoadingSpinner />}>
      <div
        style={{
          height: '100%',
          display: 'flex',
        }}
      >
        <main
          style={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              height: '100%',
            }}
          >
            <Routes>
              <Route path={EDIT_OBJECT} />
              <Route path={NEW_OBJECT} />
              <Route path='/*' element={<MapContainer />} />
            </Routes>
          </div>
        </main>
      </div>
    </Suspense>
  </LocalizationProvider>
);

export default App;
