import { Map, View } from 'ol';
import { get, ProjectionLike } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import ImageLayer from 'ol/layer/Image';
import { ImageWMS, XYZ } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import TileGrid from 'ol/tilegrid/TileGrid';
import mapConfig from '../configs/map-config';

const { tileGridExtent, mapMinZoom, mapResolutions, projectionName } = mapConfig;

const mapTileGrid = new TileGrid({
  extent: tileGridExtent as [number, number, number, number],
  minZoom: mapMinZoom,
  resolutions: mapResolutions,
});

// eslint-disable-next-line import/prefer-default-export
export const initMap = (mapElement: HTMLElement): Map =>
  new Map({
    target: mapElement,
    view: new View({
      zoom: mapConfig.mapInitialZoom,
      center: mapConfig.mapCenter,
      projection: get(mapConfig.projectionName) as ProjectionLike,
      extent: mapConfig.mapExtent as [number, number, number, number],
    }),
    controls: defaultControls({ rotate: false }),
    layers: [
      new TileLayer({
        source: new XYZ({
          projection: get(projectionName) as ProjectionLike,
          tileGrid: mapTileGrid,
          url: 'https://tiles.maaamet.ee/tm/tms/1.0.0/kaart2@LEST/{z}/{x}/{-y}.jpg',
          wrapX: false,
          crossOrigin: 'anonymous',
        }),
      }),
      new ImageLayer({
        source: new ImageWMS({
          url: 'https://kaart.maaamet.ee/wms/kaart?',
          projection: get(projectionName) as ProjectionLike,
          params: {
            VERSION: '1.1.1',
            LAYERS: 'CORINE,BAASKAART,KAART24,HALDUSPIIRID,TEED_VALGED,KYLAD,KAART24L',
          },
          crossOrigin: 'anonymous',
        }),
      }),
    ],
    overlays: [],
  });
