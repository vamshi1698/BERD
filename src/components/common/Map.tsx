import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Circle, Fill, Stroke } from 'ol/style';
import { Incident, SafeZone } from '../../types/incident';

interface EmergencyMapProps {
  incidents?: Incident[];
  safeZones?: SafeZone[];
  userLocation?: { latitude: number; longitude: number };
  onIncidentClick?: (incident: Incident) => void;
  onSafeZoneClick?: (safeZone: SafeZone) => void;
  onLocationSelected?: (lat: number, lng: number) => void;
  height?: string;
  interactive?: boolean;
}

const EmergencyMap: React.FC<EmergencyMapProps> = ({
  incidents = [],
  safeZones = [],
  userLocation,
  onIncidentClick,
  onSafeZoneClick,
  onLocationSelected,
  height = '500px',
  interactive = true,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([77.5946, 12.9716]),
        zoom: 12
      })
    });

    setMap(initialMap);

    return () => {
      if (initialMap) {
        initialMap.setTarget(undefined);
      }
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    incidents.forEach(incident => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([
          incident.location.longitude,
          incident.location.latitude
        ])),
        properties: { type: 'incident', data: incident }
      });

      const color = incident.severity === 'critical' ? '#f44336' :
                    incident.severity === 'high' ? '#ff9800' :
                    incident.severity === 'medium' ? '#ffc107' : '#4caf50';

      feature.setStyle(new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({ color }),
          stroke: new Stroke({
            color: '#ffffff',
            width: 2
          })
        })
      }));

      vectorSource.addFeature(feature);
    });

    safeZones.forEach(safeZone => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([
          safeZone.location.longitude,
          safeZone.location.latitude
        ])),
        properties: { type: 'safeZone', data: safeZone }
      });

      feature.setStyle(new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({ color: '#4caf50' }),
          stroke: new Stroke({
            color: '#ffffff',
            width: 2
          })
        })
      }));

      vectorSource.addFeature(feature);
    });

    // Add user location if available
    if (userLocation) {
      const feature = new Feature({
        geometry: new Point(fromLonLat([
          userLocation.longitude,
          userLocation.latitude
        ])),
        properties: { type: 'user' }
      });

      feature.setStyle(new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({ color: '#2196f3' }),
          stroke: new Stroke({
            color: '#ffffff',
            width: 2
          })
        })
      }));

      vectorSource.addFeature(feature);
    }

    map.addLayer(vectorLayer);

    // Add click handler
    if (interactive) {
      const clickHandler = map.on('click', (event) => {
        const feature = map.forEachFeatureAtPixel(event.pixel, feature => feature);
        if (feature) {
          const properties = feature.get('properties');
          if (properties?.type === 'incident' && onIncidentClick) {
            onIncidentClick(properties.data);
          } else if (properties?.type === 'safeZone' && onSafeZoneClick) {
            onSafeZoneClick(properties.data);
          }
        } else if (onLocationSelected) {
          const coords = map.getCoordinateFromPixel(event.pixel);
          const lonLat = fromLonLat(coords, 'EPSG:3857');
          onLocationSelected(lonLat[1], lonLat[0]);
        }
      });

      return () => {
        map.un('click', clickHandler);
        map.removeLayer(vectorLayer);
      };
    }

    return () => {
      map.removeLayer(vectorLayer);
    };
  }, [map, incidents, safeZones, userLocation, interactive, onIncidentClick, onSafeZoneClick, onLocationSelected]);

  return (
    <div ref={mapRef} style={{ height, width: '100%' }} />
  );
};

export default EmergencyMap;