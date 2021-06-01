import React, { useState, useEffect } from "react";
import "./Popup.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from '../Loader';
import CloseIcon from "@material-ui/icons/Close";
import GetAppIcon from "@material-ui/icons/GetApp";
import Paper from "@material-ui/core/Paper";
import Map from "../Map/Map";
import axios from 'axios';

export default function Popup(props) {
  const [detail, setDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const [metadatas, setMetadatas] = useState({});
  const [metaIp, setMetaIp] = useState({});

  useEffect(() => {
    async function fetchMetadata() {
      await axios.get(`/api/${props.image}`)
        .then(metadatas => {
          setMetadatas(metadatas.data);
        });
    }
    fetchMetadata();
  });

  

  useEffect(() => {
    async function fetchMetaIP() {
      await axios.get(`/api/ip/${props.image}`)
        .then(ip => {
          setMetaIp(ip.data);
        });
    }
    fetchMetaIP();
  });

  const ip = metaIp.metadata;
  console.log(ip);

  useEffect(() => {
    async function fetchIp() { 
      await axios.get(`http://ip-api.com/json/${ip}`)
        .then(response => {
          setDetail(response.data);
          setLoading(false);
        });
    }
    fetchIp();
  }, [ip]);

  console.log(detail);

  if (loading) {
    return (
      <div className="loader">
        <Loader
          className="circles"
          type="Circles"
          width={100}
          timeout={2000}
        />
      </div>
    );
  }

  return (
    <div className={"popup"} id={props.image}>
      <a href="#!" className="popup-overlay"></a>
      <Paper
        className="popup_inner"
        elevation={1}
        style={{
          overflow: "auto",
          backgroundColor: "rgb(239, 239, 239)",
        }}
      >
        <div className="inside-container">
          <div className="image">
            <img
              src={"https://storage.googleapis.com/bitirme_1//detected/" + props.image + ".jpg"}
              alt={props.image.toString()}
              key={props.image}
              width={600}
              height={350}
            />
          </div>
          <div className="download-button">
            <span>
              <a className="download" href={props.rawImage} download>
                <GetAppIcon className="download-icon" style={{ color: "#1DA1F2" }} fontSize="large"/>
              </a>
            </span>
          </div>
          <div className="metadata-info">
            <ul className="cus-ul">
                <p className="cus-li" key={metadatas.id}>{metadatas.metadata}</p>
                <p className="cus-li" key={metadatas.id}>{metaIp.metadata}</p>
            </ul>
          </div>
          <div className="map">
            <div className="location"><p>{`Country: ${detail.country}, City: ${detail.city}`}</p></div>
            <Map className="gmap" lat={detail.lat} lng={detail.lon} />
          </div>
          <div className="close">
            <CloseIcon
              className="close-icon"
              style={{ color: "red" }}
              fontSize="large"
              onClick={props.close}
            />
          </div>
        </div>
      </Paper>
    </div>
  );
}
