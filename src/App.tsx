import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import etLocale from 'date-fns/locale/et';
import { Slide, ToastContainer } from 'react-toastify';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import MapContainer from './components/map/MapContainer/MapContainer';
import 'react-toastify/dist/ReactToastify.min.css';
import HeaderNavigationContainer from './components/header/HeaderNavigationContainer/HeaderNavigationContainer';

const App = () => (
  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={etLocale}>
    <Suspense fallback={<LoadingSpinner />}>
      <div
        style={{
          height: '100%',
          display: 'flex',
        }}
      >
        <ToastContainer
          position='top-center'
          autoClose={4500}
          transition={Slide}
          hideProgressBar
          closeOnClick
          rtl={false}
        />
        <HeaderNavigationContainer />
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
              <Route path='/*' element={<MapContainer />} />
            </Routes>
          </div>
        </main>
      </div>
    </Suspense>
  </LocalizationProvider>
);

export default App;
