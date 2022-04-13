/**
 * Shows a celebratory message
 * 
 * Adapted from https://jsfiddle.net/elin/7m3bL/
 */

import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { useTranslation } from "react-i18next";

import { Backdrop, Button, Paper, Slide } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './Celebration.css';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
}));

export function Pyro () {
    return (
        <div className="pyro">
            <div className="before"></div>
            <div className="after"></div>
        </div>
    );
}
export default function Celebration({ children, open, onClose, mainText, subText, hideButton, invisible }) {
    const classes = useStyles();
    const { t, i18n } = useTranslation(['general']);
    
    const [textShown, setTextShown] = useState(false);
    
    useEffect(() => {
        if (open) {
            setTimeout(() => setTextShown(true), 200);
        }
    }, [open]);


    return (
        <Backdrop className={classes.backdrop} open={open} onClick={onClose} invisible={invisible}>
            <Grid container justifyContent="center">
                <Grid item>
                    <Pyro />
                </Grid>
                <Grid item>
                    {typeof mainText !== "undefined" ? <Slide direction="up" in={textShown} mountOnEnter unmountOnExit>
                        <Paper elevation={2} style={{padding: 10}}>
                            <Typography variant="h6">{mainText}</Typography>
                        </Paper>
                    </Slide>: null}
                    {typeof subText !== "undefined" ? <Slide direction="up" in={textShown} mountOnEnter unmountOnExit style={{ transitionDelay: "300ms" }}>
                        <Paper elevation={1} style={{padding: 10, marginTop: 15, marginBottom: 15}}>
                            <Typography variant="caption">{subText}</Typography>
                        </Paper>
                    </Slide>: null}
                    
                    {typeof hideButton === "undefined" || !hideButton ? <Grid container justifyContent="center">
                        <Grid item>
                            <Slide direction="up" in={textShown} mountOnEnter unmountOnExit style={{ transitionDelay: "500ms" }}>
                                <Button variant="contained" color="secondary" onClick={onClose} startIcon={<ArrowBackIcon />}>{t("general:done")}</Button>
                            </Slide>
                        </Grid>
                    </Grid>: null}
                </Grid>
            </Grid>
        </Backdrop>
    )
}
