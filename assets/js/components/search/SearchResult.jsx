import React, { Component } from 'react'

// MUI
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { withStyles } from '@material-ui/core/styles';

// Icons
import DevicesIcon from '@material-ui/icons/Memory';
import GatewaysIcon from '@material-ui/icons/Router';
import ChannelsIcon from '@material-ui/icons/CompareArrows';
import AccessIcon from '@material-ui/icons/People';
import BillingIcon from '@material-ui/icons/CreditCard';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ReportsIcon from '@material-ui/icons/TrackChanges';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import AccountCircle from '@material-ui/icons/AccountCircle'
import NotificationsIcon from '@material-ui/icons/Notifications'
import MapIcon from '@material-ui/icons/MyLocation'

const styles = theme => ({
  selected: {
    backgroundColor: "#E3F2FD !important"
  }
})

@withStyles(styles)
class SearchResult extends Component {

  render() {
    const { selected, result, classes, gotoResult } = this.props

    return (
      <MenuItem
        button
        onClick={() => gotoResult(result)}
        selected={selected}
        classes={{selected: classes.selected}}
      >
        <ListItemIcon>
          <SearchResultIcon category={result.category} />
        </ListItemIcon>
        <ListItemText
          primary={result.title}
          secondary={result.description}
        />
        <JumpTo show={selected} />
      </MenuItem>
    )
  }
}

const JumpTo = (props) => (
  <span className="jumpto">
    {props.show &&
      <span className="jumpto--inner">
        Jump to <KeyboardReturnIcon />
      </span>
    }
  </span>
)

const SearchResultIcon = (props) => {
  switch (props.category) {
    case "devices":
      return <DevicesIcon style={{color: '#616161'}} />
    case "gateways":
      return <GatewaysIcon style={{color: '#616161'}} />
    case "channels":
      return <ChannelsIcon style={{color: '#616161'}} />
    case "access":
      return <AccessIcon style={{color: '#616161'}} />
    case "dashboard":
      return <DashboardIcon style={{color: '#616161'}} />
    case "profile":
      return <AccountCircle style={{color: '#616161'}} />
    case "map":
      return <MapIcon style={{color: '#616161'}} />
    case "billing":
      return <BillingIcon style={{color: '#616161'}} />
    case "reports":
      return <ReportsIcon style={{color: '#616161'}} />
    case "notifications":
      return <NotificationsIcon style={{color: '#616161'}} />
    default:
      return <DevicesIcon style={{color: '#616161'}} />
  }
}

export default SearchResult
