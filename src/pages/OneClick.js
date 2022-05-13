import React, { useEffect, useState} from "react";
import { Grid, Button } from '@material-ui/core';


import { makeStyles } from '@material-ui/core/styles';

import { XStorage as xsto } from '../util/XStorage.js'
import { Auth } from '../util/Api/Auth.js'

import { GoogleLogin } from 'react-google-login';

import { useTranslation, Trans } from "react-i18next";
import {
	useParams
} from "react-router-dom";

import { languages } from "../locales/list"

const useStyles = makeStyles((theme) => ({
	root: {
	  /*display: 'flex',
	  flexWrap: 'wrap',*/
	  flexGrow: 1,
	}
  }));

export default function OneClick() {
	const styles = useStyles();
	const redirectUrl = `${(window.location.protocol.indexOf("https") > -1 ? "https": "http")}://${window.location.host}/app/`;

	const { lang } = useParams();

	const { t, i18n } = useTranslation(['home']);
	const [language, setLanguage] = useState("en");
	useEffect(() => {
		setLanguage(lang);
	}, []);
	useEffect(() => {
		i18n.changeLanguage(language);
		xsto.set("lang", language);
	}, [language]);

	const [loggedIn, setLoggedIn] = useState(false);
	const _gSignIn = (email, idToken) => {
		Auth.gauthenticate(email, idToken).then((result)=>{
			console.log(result);
			if (typeof result.error !== "undefined") {
				//an error has ocurred
				alert("Invalid user details");
			} else {
				xsto.set("token", result.token);
				setLoggedIn(true);
				window.parent.location.href = redirectUrl;
			}
		});
	};


	return (
		<Grid container spacing={2} justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
			<Grid item container justifyContent="center">

				<Grid item container justifyContent="center">
					<Grid item container justifyContent="center">
						{typeof Auth.userInfo === "undefined" && !loggedIn ? 
						<GoogleLogin
							clientId={process.env.REACT_APP_GCLIENT_ID}
							buttonText={t("signin_google")}
							onSuccess={(e) => { _gSignIn(e.profileObj.email, e.tokenId); }}
							onFailure={(e) => {
								console.log(e);
								if (
									e.error != "idpiframe_initialization_failed" &&
									e.error != "popup_closed_by_user"
								) {
									alert("Unexpected error occured!");
								}
							}}
						/>
						:
						<Button
							variant="contained"
							color="primary"
							onClick={() => { window.parent.location.href = redirectUrl }}
						>
							{t("openPage")}
						</Button>
						}
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}
