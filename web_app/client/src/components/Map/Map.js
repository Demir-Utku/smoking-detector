import React from "react";
import { Gmaps, Marker } from "react-gmaps";

// Parameters for Google Map Authorization
const params = { v: "3.exp", key: "AIzaSyDmYasmhax_EUigIZk346To00e4w2A0kNI" };

export default function Map(props) {
  const onMapCreated = (map) => {
    map.setOptions({ disableDefaultUI: true });
  };

  return (
    <div>
      <Gmaps
        width="55vw"
        height="45vh"
        lat={props.lat}
        lng={props.lng}
        zoom={14}
        loadingMessage={"Loading Map"}
        onMapCreated={onMapCreated}
        params={params}
        style={{ fontSize: "1.1vw" }}
      >
        <Marker
          // Specifies where the marker will be on
          lat={props.lat}
          lng={props.lng}
        />
      </Gmaps>
    </div>
  );
}
