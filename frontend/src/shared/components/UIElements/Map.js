import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "./Map.css";

const Map = (props) => {
  const { center, zoom, className, style } = props;

  const position = [center.lat, center.lng];

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      className={`map ${className || ""}`}
      style={style}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>This is the exact location.</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
