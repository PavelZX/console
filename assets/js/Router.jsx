import React from "react"

import { store, persistor, history } from './store/configureStore';
import { PersistGate } from 'redux-persist/lib/integration/react';

import { ApolloProvider } from 'react-apollo';
import apolloClient from './util/apolloClient'

// Routes
import { Provider } from 'react-redux';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import { Redirect } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from './components/routes/PrivateRoute.jsx';
import PublicRoute from './components/routes/PublicRoute.jsx';
import SocketHandler from './components/SocketHandler'
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import ResendVerification from './components/auth/ResendVerification.jsx';
import ForgotPassword from './components/auth/ForgotPassword.jsx';
import ResetPassword from './components/auth/ResetPassword.jsx';
import Home from './components/Home.jsx';
import Profile from './components/Profile.jsx';
import TwoFactorPrompt from './components/auth/TwoFactorPrompt.jsx';
import ConfirmEmailPrompt from './components/auth/ConfirmEmailPrompt.jsx';
import DeviceIndex from './components/devices/DeviceIndex';
import DeviceShow from './components/devices/DeviceShow';
import GatewayIndex from './components/gateways/GatewayIndex'
import GatewayNew from './components/gateways/GatewayNew'
import GatewayShow from './components/gateways/GatewayShow'
import ChannelIndex from './components/channels/ChannelIndex'
import ChannelShow from './components/channels/ChannelShow'
import ChannelNew from './components/channels/ChannelNew'
import TeamShow from './components/teams/TeamShow'
import NoTeamPrompt from './components/teams/NoTeamPrompt'
import Dashboard from './components/dashboard/Dashboard'
import Billing from './components/billing/Billing'
import Reports from './components/reports/Reports'
import Notifications from './components/notifications/Notifications'


class Router extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApolloProvider client={apolloClient}>
            <SocketHandler>
              { /* ConnectedRouter will use the store from Provider automatically */ }
              <ConnectedRouter history={history}>
                <Switch>
                  <Redirect exact from="/" to="/login" />
                  <PublicRoute path="/login" component={Login}/>
                  <PublicRoute path="/resend_verification" component={ResendVerification}/>
                  <PublicRoute path="/forgot_password" component={ForgotPassword}/>
                  <PublicRoute path="/reset_password/:token" component={ResetPassword}/>
                  <PublicRoute path="/register" component={Register}/>
                  <PublicRoute path="/confirm_email" component={ConfirmEmailPrompt}/>
                  <PrivateRoute path="/2fa_prompt" component={TwoFactorPrompt}/>
                  <PrivateRoute path="/profile" component={Profile}/>
                  <PrivateRoute exact path="/devices" component={DeviceIndex} />
                  <PrivateRoute path="/devices/:id" component={DeviceShow}/>
                  <PrivateRoute exact path="/gateways" component={GatewayIndex} />
                  <PrivateRoute exact path="/gateways/new" component={GatewayNew} />
                  <PrivateRoute exact path="/gateways/map" component={GatewayIndex} />
                  <PrivateRoute exact path="/gateways/:id" component={GatewayShow} />
                  <PrivateRoute exact path="/channels" component={ChannelIndex} />
                  <PrivateRoute exact path="/channels/new/:id?" component={ChannelNew} />
                  <PrivateRoute exact path="/channels/:id" component={ChannelShow} />
                  <PrivateRoute exact path="/teams/access" component={TeamShow} />
                  <PrivateRoute exact path="/teams/activity" component={TeamShow} />
                  <PrivateRoute exact path="/teams/none" component={NoTeamPrompt} />
                  <PrivateRoute exact path="/dashboard" component={Dashboard} />
                  <PrivateRoute exact path="/billing" component={Billing} />
                  <PrivateRoute exact path="/reports" component={Reports} />
                  <PrivateRoute exact path="/notifications" component={Notifications} />
                </Switch>
              </ConnectedRouter>
            </SocketHandler>
          </ApolloProvider>
        </PersistGate>
      </Provider>
    )
  }
}

export default Router
