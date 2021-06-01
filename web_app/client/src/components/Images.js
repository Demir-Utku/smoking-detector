import React, { useState, useEffect } from "react";
import "../App.css";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Popup from "./Popup/Popup";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    "& > *": {
      marginRight: theme.spacing(8),
      marginLeft: theme.spacing(8),
      width: theme.spacing(36),
      height: theme.spacing(36),
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default function Images(props) {
  const [hidden, setHidden] = useState("hidden");
  const [showPopup, setShowPopup] = useState(false);
  const [clickedItem, setClickedItem] = useState(-1);

  const classes = useStyles();

  async function postData(url, detected) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(detected)
    });
    return response.json();
  }

  const setItem = (detected) => {
    postData(`/api/${detected}`, {detected: detected})
      .then(detected => {detected.json()});
  }

  const setIp = (detected) => {
    postData(`/api/ip/${detected}`, {detected: detected})
      .then(detected => {detected.json()});
  }
  
  const togglePopup = (i) => {
    setShowPopup(!showPopup);
    setClickedItem(i);
    setItem(i);
    setIp(i);
  };

  function show() {
    setHidden("");
  }

  useEffect(() => {
    setTimeout(function () {
      show();
    }, props.wait);
  }, [props.wait]);

  const images = Array(props.length)
    .fill(1)
    .map((_, i) => (
      <>
        <a href={"#/" + i} onClick={() => togglePopup(i)}>
          <img
            className="arrayImage"
            src={"https://storage.googleapis.com/bitirme_1//detected/" + i + ".jpg"}
            alt={i.toString()}
            key={i.toString()}
            onError={(i) => (i.target.style.display = "none")}
          />
        </a>
        {showPopup && clickedItem === i && (
          <Popup
            image={i}
            rawImage={'https://storage.googleapis.com/bitirme_1//detected/' + i + ".jpg"}
            close={() => togglePopup(i)}
          />
        )}
      </>
    ));

  return (
    <div className={hidden === "hidden" ? "hide" : classes.root}>
      <Paper
        className="paper"
        elevation={2}
        style={{
          width: "75%",
          minHeight: "75vh",
          overflow: "auto",
          backgroundColor: "rgb(239, 239, 239)",
          marginLeft: '0',
          marginRight: '0',
        }}
      >
        <Grid className="grid" item>{ images }</Grid>
      </Paper>
    </div>
  );
}
