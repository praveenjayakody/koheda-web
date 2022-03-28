import React, { useEffect, useState } from "react";


import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Rating from '@material-ui/lab/Rating';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Call from '@material-ui/icons/Call';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import { DialogActions, DialogContent, DialogContentText, Typography } from "@material-ui/core";

import { XStorage as xsto } from '../util/XStorage.js'

import { useTranslation } from "react-i18next";
import { Place } from "../util/Api/Place";

import colorGradient from "javascript-color-gradient";

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

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon />,
    label: 'Very Dissatisfied',
  },
  2: {
    icon: <SentimentDissatisfiedIcon />,
    label: 'Dissatisfied',
  },
  3: {
    icon: <SentimentSatisfiedIcon />,
    label: 'Neutral',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon />,
    label: 'Satisfied',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon />,
    label: 'Very Satisfied',
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

function generateMarker(rating) {
  // to edit SVG paths, use https://yqnn.github.io/svg-path-editor/
  const badColor = { red: 255, green: 0, blue: 0 };
  const goodColor = { red: 0, green: 255, blue: 0 };

  const svgMarker = {
    path: "M 10.453 14.016 q 2.906 0 4.945 2.039 t 2.039 4.945 q 0 1.453 -0.727 3.328 t -1.758 3.516 t -2.039 3.07 t -1.711 2.273 l -0.75 0.797 q -0.281 -0.328 -0.75 -0.867 t -1.688 -2.156 t -2.133 -3.141 t -1.664 -3.445 t -0.75 -3.375 q 0 -2.906 2.039 -4.945 t 4.945 -2.039 z",
    fillColor: colorGradient.setGradient("#FF0000", "ffa500", "00ff00").setMidpoint(10).getColor(rating == 0 ? 1: rating),
    fillOpacity: 0.95,
    strokeWeight: 3,
    rotation: 0,
    scale: 2
  };

  if (typeof window.google !== "undefined") {
    svgMarker['anchor'] = new window.google.maps.Point(15, 30);
  }

  return svgMarker;
}

export default function Geo() {
  const classes = useStyles();

  const { t, i18n } = useTranslation(['geo']);

  const { itemId, geoLocation } = useParams();

  const _mapRender = (status) => {
    return <h1>{status}</h1>;
  };

  const [snackbar, setSnackbar] = useState(null);

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
  const [selectedPlace, setSelectedMarker] = useState({});

  // rate place (and facility)
  const _doRate = async (e) => {
    if (xsto.load("ratingSubmitted") !== null || window.confirm(t("submit_rating"))) {
      xsto.set("ratingSubmitted", true);
      setSnackbar(t("rating_appreciated"));
    }
  }

  return (<div className={classes.root}>
		<CssBaseline />
    <main className={classes.content}>
      <Snackbar open={snackbar !== null} autoHideDuration={6000} onClose={() => setSnackbar(null)} message={snackbar} />
      <Dialog onClose={() => setSelectedMarker({})} open={typeof selectedPlace.id !== "undefined"}>
        <DialogTitle>{selectedPlace.name}</DialogTitle>
        <DialogContent>
          <DialogContentText style={{textAlign: "center"}}>
            {
              typeof selectedPlace.updated_at != "undefined" ?
              t("last_updated", { date: (new Date(selectedPlace.updated_at)).toLocaleString() })
              : ""
            }
          </DialogContentText>
          <Grid container alignItems="center" direction="column">
            <Grid item>
              <Rating 
                value={(() => {
                  let rating = typeof selectedPlace.facilities !== "undefined" ?
                  selectedPlace.facilities.find(e => e.facility == itemId).quality/2
                  :0;
                  if (rating == 0) rating = 1;
                  return rating;
                })()}
                IconContainerComponent={IconContainer}
                onChange={_doRate}
                name={"facility-rating"}
              />
            </Grid>
            <Grid item>
              <Typography variant="caption" color="textSecondary">{t("encourage_rating")}</Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {typeof selectedPlace.mobile === "undefined" || selectedPlace.mobile === null ? null:
            <Button fullWidth endIcon={<Call />} onClick={() => window.open("tel:" + selectedPlace.mobile)}>
              {t("call")}
            </Button>
          }
          <Button fullWidth endIcon={<ArrowForwardIcon />} onClick={() => {
            let url = "";
            url = "https://www.google.com/maps/dir/?api=1&destination=" + selectedPlace.location.coordinates[1] +"," + selectedPlace.location.coordinates[0];
            window.open(url);
          }}>{t("navigate")}</Button>
        </DialogActions>
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
                setSelectedMarker(p);
              }}
              title={p.name}
              icon={generateMarker(p.facilities.find(e => e.facility == itemId).quality)}
              position={{ lat: p.location.coordinates[1], lng: p.location.coordinates[0] }}
            />
          ))}
        </GMap>
      </Wrapper>
    </main>
  </div>);
}
