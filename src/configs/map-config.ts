export default {
  mapExtent: [300500, 6320000, 854500, 6700000],
  tileGridExtent: [40500, 5993000, 1064500, 7017000],
  mapMinZoom: 3,
  mapMaxZoom: 13,
  mapInitialZoom: 8,
  mapCenter: [550000, 6500000],
  mapResolutions: [
    4000, 2000, 1000, 500, 250, 125, 62.5, 31.25, 15.625, 7.8125, 3.90625, 1.953125, 0.9765625, 0.48828125, 0.244140625,
  ],
  projectionName: 'EPSG:3301',
  projectionDef:
    '+proj=lcc +lat_1=59.33333333333334 +lat_2=58 +lat_0=57.51755393055556 +lon_0=24 +x_0=500000 +y_0=6375000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  wgsProjectionName: 'EPSG:4326',
  wgsProjectionDef: '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees',
};
