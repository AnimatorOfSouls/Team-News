import React, { FC, useEffect, useState } from "react";
import {
  collection,
  Firestore,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { User } from "firebase/auth";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";

interface mapProps {
  store: Firestore;
  user: User | undefined | null;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
}

let Map: FC<mapProps> = ({ store, user, setLocation }) => {
  const personIcon = L.icon({
    iconUrl: "/assets/marker.png",
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24]
  });
  
  let [team, setTeam] = useState<JSX.Element[]>([]);
  let userID: string = user?.uid || "";
  let teams = collection(store, "teams");
  let q = query(teams, where("uid", "==", userID));

  async function getTeam() {
    let data = await getDocs(q);
    const members: JSX.Element[] = [];

    data.forEach((doc) => {
      let data = doc.data();
      members.push(
        <Marker icon={personIcon} position={[data.lat, data.long]}>
          <Popup>
            <b>{data.member_name}</b><br />
            {data.country[0]?.toUpperCase()+data.country.slice(1)}
            <br />
            <button onClick={() => setLocation(data.country)}>
              Show news here
            </button>
          </Popup>
        </Marker>
      );
    });
    setTeam(members);
  }

  useEffect(() => {
    getTeam();
  }, [user]);

  return (
    <div className="map-on-page">
      <div id="mapDiv">
        <MapContainer center={[0, 0]} zoom={2} scrollWheelZoom={false}>
          <TileLayer
            url={
              "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
            }
            attribution={
              'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
            }
            accessToken={
              "pk.eyJ1IjoiYW5pbWF0b3JvZnNvdWxzIiwiYSI6ImNreml0eXNtMTFvYWwycW5yY2VhaHI2MDAifQ.ZSNNSGLF4DixEuS3RrLtHQ"
            }
            maxZoom={18}
            minZoom={1}
            id="mapbox/streets-v11"
            tileSize={512}
            zoomOffset={-1}
          />
          {team}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
