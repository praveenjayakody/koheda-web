import React, { useEffect, useState } from "react";


import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import LinearProgress from '@material-ui/core/LinearProgress';
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
import { DialogActions, DialogContent, DialogContentText, Select, MenuItem, Typography } from "@material-ui/core";

import { XStorage as xsto } from '../util/XStorage.js'

import { useTranslation } from "react-i18next";
import { Place } from "../util/Api/Place";
import { Finding } from "../util/Api/Finding";
import { Auth } from "../util/Api/Auth";

import colorGradient from "javascript-color-gradient";

import {
  useParams
} from "react-router-dom";
import { Wrapper } from "@googlemaps/react-wrapper";

import { GMap, Marker } from "../components/Maps";

import Zoom from '@material-ui/core/Zoom';
import SendIcon from '@material-ui/icons/Send';

import myLocationIcon from "../images/my-location.png"

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
  floatingButton: {
    position: "absolute",
    bottom: 0,
    zIndex: 9000,
    borderRadius: 0
  },
  floatingLabel: {
    position: "absolute",
    top: 70,
    zIndex: 9000,
    background: "rgba(0, 0, 0, .8)",
    padding: 10,
    color: "#fff",
    width: "100%",
    textAlign: "center"
  }
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

function getRatingFromTime (updated_at) {
  /**
   * Provided the updated_at time (UTC string), a value between 0.33 and 0.95 is provided
   */

   const updatedAt = new Date(updated_at);
   const dayDifference = ((new Date()) - updatedAt)/(1000*60*60*24); // number of days elapsed betwen last updated time and now
   const opacity = (20*Math.exp(-1 * dayDifference) + 10)/31.5; // o = (10 + 20e^-t)/31.5

   return opacity;
}

function generateMarker(rating, updated_at) {
  // to edit SVG paths, use https://yqnn.github.io/svg-path-editor/
  const badColor = { red: 255, green: 0, blue: 0 };
  const goodColor = { red: 0, green: 255, blue: 0 };


  const svgMarker = {
    path: "M 10.453 14.016 q 2.906 0 4.945 2.039 t 2.039 4.945 q 0 1.453 -0.727 3.328 t -1.758 3.516 t -2.039 3.07 t -1.711 2.273 l -0.75 0.797 q -0.281 -0.328 -0.75 -0.867 t -1.688 -2.156 t -2.133 -3.141 t -1.664 -3.445 t -0.75 -3.375 q 0 -2.906 2.039 -4.945 t 4.945 -2.039 z",
    fillColor: colorGradient.setGradient("#FF0000", "ffa500", "00ff00").setMidpoint(10).getColor(rating == 0 ? 1: rating),
    fillOpacity: 0.95,
    strokeWeight: 3,
    strokeOpacity: getRatingFromTime(updated_at),
    // strokeColor: colorGradient.setGradient("#ff0000", "#00ff00").setMidpoint(10).getColor(opacity * 10),
    rotation: 0,
    scale: 2
  };

  if (typeof window.google !== "undefined") {
    svgMarker['anchor'] = new window.google.maps.Point(15, 30);
  }

  return svgMarker;
}

export default function Geo({ mode }) {
  const classes = useStyles();

  const { t, i18n } = useTranslation(['geo']);
  useEffect(() => {
		i18n.changeLanguage(xsto.load("lang") ?? "en");
	}, []);

  const { itemId, geoLocation } = useParams();

  const _mapRender = (status) => {
    return <h1>{status}</h1>;
  };

  const [snackbar, setSnackbar] = useState(null);
  const [loading, setLoading] = useState(true);

  // location selection on map
  const [selection, setSelection] = useState(undefined);
  const _selectPlace = (lat, lng) => {
    if (mode === "add" && Auth.userInfo.permissions.indexOf("add locations") > -1) {
      setSelection({lat, lng});
    }
  }

  const [zoom, setZoom] = React.useState(8); // initial zoom
  const [center, setCenter] = React.useState({
    lat: 7.765676800293702,
    lng: 80.76784081246987,
  });

  const [markersReady, setMarkersReady] = useState(false);
  useEffect(() => {
    // TODO: implement a more elegant way of waiting till the window.google object has become available
    window.readyTimer = setInterval(() => {
      console.log("Checking for window.google");
      if (typeof window.google !== "undefined") {
        setMarkersReady(true);
        setLoading(false);
        clearInterval(window.readyTimer);
      }
    }, 1000);
  }, []);

  // places
  const [places, setPlaces] = useState([]);
  useEffect(() => {( async () => {
    setPlaces(await Place.list({ facility: itemId }));
  })()}, []);
  // useEffect(() => {
  //   for (var i =0; i < places.length; i++) {
  //     places[i].opacity = getRatingFromTime(places[i].facilities.find(e => e.facility == itemId).updated_at)
  //   }
  //   console.log(places);
  // }, [places]);

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

  // selected facility - controls which facility is shown on the dialog box
  const [facilityId, setFacilityId] = useState(itemId);

  // rate place (and facility)
  const _doRate = async (e) => {
    if (xsto.load("ratingSubmitted") !== null || window.confirm(t("submit_rating"))) {
      xsto.set("ratingSubmitted", true);

      setLoading(true);
      try {
        let resp = await Finding.store({
          place_id: selectedPlace.id,
          facility: facilityId,
          rating: e.target.value
        });
        if (typeof resp.errors === 'undefined') {
          setSnackbar(t("rating_appreciated"));
        } else {
          setSnackbar(t("general:validation_error"));
        }
      } catch (err) {
        console.log(err);
        setSnackbar(t("general:network_error"));
      }
      setLoading(false);
    }
  }

  return (<div className={classes.root}>
		<CssBaseline />
    <main className={classes.content}>
      {loading ? <LinearProgress color="secondary" style={{ position: "absolute", width: "100%", zIndex: 9000 }} />: null}
      <Snackbar open={snackbar !== null} autoHideDuration={6000} onClose={() => setSnackbar(null)} message={snackbar} />
      <Dialog onClose={() => setSelectedMarker({})} open={typeof selectedPlace.id !== "undefined"}>
        <DialogTitle>{selectedPlace.name}</DialogTitle>
        <DialogContent>
          <DialogContentText style={{textAlign: "center"}}>
            {
              typeof selectedPlace.updated_at != "undefined" ?
              t("last_updated", { date: (new Date(selectedPlace.facilities.find(e => e.facility == itemId).updated_at)).toLocaleString() })
              : ""
            }
          </DialogContentText>
          <Grid container alignItems="center" direction="column">
            <Grid item style={{ marginBottom: 10 }}>
              <Select
                value={facilityId}
                onChange={(e) => setFacilityId(e.target.value)}
              >
                {typeof selectedPlace.facilities !== "undefined" ? selectedPlace.facilities.map((f, i) => (
                  <MenuItem key={i} value={f.facility}>{t("general:item." + f.facility)}</MenuItem>
                )): null}
              </Select>
            </Grid>
            <Grid item>
              <Rating 
                value={(() => {
                  let rating = typeof selectedPlace.facilities !== "undefined" ?
                  selectedPlace.facilities.find(e => e.facility == facilityId).quality/2
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
      {typeof selection !== "undefined" ?
      <Zoom
        in={true}
        timeout={500}
        unmountOnExit
      >
        <Button
          disableElevation
          fullWidth
          variant="contained"
          size="large"
          color="secondary"
          className={classes.floatingButton}
          endIcon={<SendIcon />}
          onClick={() => window.location.href = process.env.REACT_APP_BASENAME + "/create/" + itemId + "/" + selection.lat + "," + selection.lng}
        >
          {t("add_place")}
        </Button>
      </Zoom>: null}
      {mode === "add" && Auth.userInfo.permissions.indexOf("add locations") > -1 ? <Typography variant="caption" className={classes.floatingLabel}>{t("add_place_banner")}</Typography>: null}
      <Wrapper apiKey={process.env.REACT_APP_GAPI_KEY} render={_mapRender}>
        <GMap
          center={center}
          zoom={zoom}
          style={{ flexGrow: "1", height: "100%" }}
          onClick={(e) => _selectPlace(e.latLng.lat(), e.latLng.lng())}
        >
          {typeof geoLocation !== "undefined" ?
            <Marker
              optimized={true}
              title={t("your_location")}
              icon={myLocationIcon}
              position={{ lat: parseFloat(geoLocation.split(",")[0]), lng: parseFloat(geoLocation.split(",")[1]) }}
            />
          : null}

          {markersReady && places.map((p, i) =>(
            <Marker
              key={i}
              optimized={false}
              onClick={(e) => {
                setFacilityId(itemId);
                setSelectedMarker(p);
              }}
              title={p.name}
              icon={generateMarker(p.facilities.find(e => e.facility == itemId).quality, p.facilities.find(e => e.facility == itemId).updated_at)}
              position={{ lat: p.location.coordinates[1], lng: p.location.coordinates[0] }}
            />
          ))}
          {typeof selection != "undefined" && <Marker position={selection} />}
        </GMap>
      </Wrapper>
    </main>
  </div>);
}
