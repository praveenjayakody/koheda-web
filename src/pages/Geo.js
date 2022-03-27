import React, { useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Navigation from "../components/Navigation";

import CssBaseline from '@material-ui/core/CssBaseline';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';

import { XStorage as xsto } from '../util/XStorage.js'

import { useTranslation } from "react-i18next";
import { Auth } from "../util/Api/Auth";
import { Place } from "../util/Api/Place";

import { languages } from "../locales/list"

import {
  useParams
} from "react-router-dom";
import { Wrapper } from "@googlemaps/react-wrapper";

import { GMap, Marker } from "../components/Maps";

import fuelStation from "../images/pins/fuel-station.png";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

export default function Geo() {
  const classes = useStyles();

  const { t, i18n } = useTranslation(['geo']);

  const { itemId, geoLocation } = useParams();

  const _mapRender = (status) => {
    return <h1>{status}</h1>;
  };

  const [clicks, setClicks] = React.useState([]);
  const [zoom, setZoom] = React.useState(8); // initial zoom
  const [center, setCenter] = React.useState({
    lat: 7.765676800293702,
    lng: 80.76784081246987,
  });

  // places
  const [places, setPlaces] = useState([]);
  useEffect(() => {( async () => {
    setPlaces(await Place.list({ facility: itemId }));
  })()}, []);
  useEffect(() => {
    console.log(places);
  }, [places]);

  // set location and zoom on it if present
  useEffect(() => {
    let thisLocation = undefined;
    if (typeof geoLocation !== "undefined" && geoLocation !== "") {
      thisLocation = geoLocation.split(",");
      thisLocation = {
        lat: parseFloat(thisLocation[0]),
        lng: parseFloat(thisLocation[1])
      }
    } else if (places.length > 0) {
      thisLocation = {
        lat: parseFloat(places[0].location.coordinates[1]),
        lng: parseFloat(places[0].location.coordinates[0])
      }
    }
    if (typeof thisLocation !== "undefined") {
      setCenter(thisLocation);
      setZoom(12);
    }
  }, [places]);

  // marker selection
  const [selectedMap, setSelectedMarker] = useState(null);

  return (<div className={classes.root}>
		<CssBaseline />
    <main className={classes.content}>
      <Dialog onClose={() => setSelectedMarker(null)} open={selectedMap != null}>
        <DialogTitle>Set backup account</DialogTitle>
      </Dialog>
      <Wrapper apiKey={process.env.REACT_APP_GAPI_KEY} render={_mapRender}>
        <GMap
          center={center}
          zoom={zoom}
          style={{ flexGrow: "1", height: "100%" }}
        >
          {places.map((p, i) =>(
            <Marker
              key={i}
              optimized={false}
              onClick={(e) => {
                console.log(e);
                setSelectedMarker("");
              }}
              title={p.name}
              icon={fuelStation}
              position={{ lat: p.location.coordinates[1], lng: p.location.coordinates[0] }}
            />
          ))}
        </GMap>
      </Wrapper>
    </main>
  </div>);
}
