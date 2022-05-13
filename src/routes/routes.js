import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import Route from "./RouteWrapper";
import { Auth } from '../util/Api/Auth';
import { XStorage as xsto } from "../util/XStorage";

import SignIn from "../pages/SignIn.js";

import Buy from "../pages/Buy.js";
import Orders from "../pages/Orders.js";
import Account from "../pages/Account.js";
import Welcome from "../pages/Welcome.js";
import Geo from "../pages/Geo.js";
import AddPlace from "../pages/AddPlace.js";
import OneClick from "../pages/OneClick.js";

export default function Routes() {
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		if (xsto.load("token") !== null) {
			// token present
			Auth.verifyToken().then((ox) => {
				if (typeof ox.error !== "undefined") {
					//error has occured
					xsto.clear();
					window.location.reload();
				} else {
					setLoading(false)
				}
			});
		} else {
			setLoading(false);
		}
	}, []);

	return (!loading ? 
		<BrowserRouter basename={process.env.REACT_APP_BASENAME}>
			<Switch>
				<Route path="/" exact component={SignIn} />
				<Route path="/one-click/:lang" component={OneClick} force />

				<Route path="/buy" component={Buy} isPrivate />
				<Route path="/orders" component={Orders} isPrivate />
				<Route path="/account" component={Account} isPrivate />
				<Route path="/welcome" component={Welcome} isPrivate />
				{/* <Route path="/search/:itemId/:geoLocation?" isPrivate><Geo mode={"add"} /></Route>
				<Route path="/add/:itemId/:geoLocation?" isPrivate><Geo mode={"add"} /></Route> */}
				<Route path="/search/:itemId/:geoLocation?" component={Geo} isPrivate />
				<Route path="/add/:itemId/:geoLocation?" component={Geo} isPrivate />
				<Route path="/create/:itemId?/:position?" component={AddPlace} isPrivate />

				{/* redirect user to SignIn page if route does not exist and user is not authenticated */}
				<Route component={SignIn} />
			</Switch>
		</BrowserRouter>
	:null);
}
