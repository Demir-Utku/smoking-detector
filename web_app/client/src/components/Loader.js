import React from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import LoaderSpinner from "react-loader-spinner";

export default function Loader(props) {
  return (
    <div>
      <LoaderSpinner
        className={props.className}
        type={props.type}
        color="#00BFFF"
        height={props.width}
        width={props.width}
        timeout={props.timeout || 0}
      />
    </div>
  );
}
