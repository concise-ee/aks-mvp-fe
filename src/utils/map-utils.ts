import { Collection, Feature, Map, View } from 'ol';
import { get, ProjectionLike } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import ImageLayer from 'ol/layer/Image';
import { ImageWMS, XYZ } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import TileGrid from 'ol/tilegrid/TileGrid';
import { Coordinate } from 'ol/coordinate';
import { Geometry, Point } from 'ol/geom';
import BaseLayer from 'ol/layer/Base';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { getCenter } from 'ol/extent';
import mapConfig from '../configs/map-config';

interface VectorParams {
  edgeColor: string | number[] | CanvasGradient | CanvasPattern;
  features: Feature<Geometry>[];
  vertexColor?: string | number[] | CanvasGradient | CanvasPattern;
  hasFill?: boolean;
  width?: number;
  hasVertices?: boolean;
  minZoom?: number;
  isDashed?: boolean;
  vertexRadius?: number;
  fillColor?: string;
}

const { tileGridExtent, mapMinZoom, mapResolutions, projectionName } = mapConfig;

const mapTileGrid = new TileGrid({
  extent: tileGridExtent as [number, number, number, number],
  minZoom: mapMinZoom,
  resolutions: mapResolutions,
});

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

const getLayerByName = (layers: Collection<BaseLayer>, name: string): BaseLayer | null =>
  layers.getArray().find((layer: BaseLayer) => layer.get('name') === name) || null;

const createVector = ({ features, edgeColor }: VectorParams): VectorLayer<VectorSource<any>> => {
  const style = [
    new Style({
      stroke: new Stroke({
        color: edgeColor,
        width: 1,
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: edgeColor,
        }),
      }),
    }),
  ];

  return new VectorLayer({
    source: new VectorSource({
      features,
    }),
    style,
  });
};

export const zoomToGeometry = (map: Map, feature: Feature<Geometry>): void => {
  const geometry = feature.getGeometry();
  if (!geometry) return;

  const view = map.getView();
  const extent = geometry.getExtent();
  view.animate({
    center: getCenter(extent),
    resolution: view.getResolutionForExtent(extent) + 0.5,
    duration: 1000,
  });
};

export const drawAddressObjectPoint = (map: Map, coordinates: Coordinate, zoom?: boolean): void => {
  const feature = new Feature(new Point(coordinates));
  const objectPointsLayer = getLayerByName(map.getLayers(), 'objectPointsLayer') as VectorLayer<VectorSource<Geometry>>;
  if (zoom) {
    zoomToGeometry(map, feature);
  }

  if (objectPointsLayer) {
    const source = objectPointsLayer.getSource();
    source?.clear();
    source?.addFeature(feature);
  } else {
    const vector = createVector({
      features: [feature],
      edgeColor: '#0099ff',
    });

    vector.set('name', 'objectPointsLayer');
    map.addLayer(vector);
  }
};

export const drawAllPoints = (map: Map, coordinates: Coordinate[]): void => {
  const features = coordinates.map((coordinate: Coordinate) => new Feature(new Point(coordinate)));
  const allPointsLayer = getLayerByName(map.getLayers(), 'allPointsLayer') as VectorLayer<VectorSource<Geometry>>;

  if (allPointsLayer) {
    const source = allPointsLayer.getSource();
    source?.clear();
    source?.addFeatures(features);
  } else {
    const vector = createVector({
      features,
      edgeColor: '#005f9b',
    });

    vector.set('name', 'allPointsLayer');
    map.addLayer(vector);
  }
};

export const removeAddressObjectPointLayer = (map: Map) => {
  const pointLayer = map
    .getLayers()
    .getArray()
    .find((layer: BaseLayer) => layer.get('name') === 'objectPointsLayer');

  if (pointLayer) {
    map.removeLayer(pointLayer);
  }
};

export const removeAllPointsLayer = (map: Map) => {
  const pointLayer = map
    .getLayers()
    .getArray()
    .find((layer: BaseLayer) => layer.get('name') === 'allPointsLayer');

  if (pointLayer) {
    map.removeLayer(pointLayer);
  }
};
