import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import pick from 'lodash/pick'
import { deleteDevice, updateDevice } from '../../actions/device'
import EventsTable from '../events/EventsTable'
import RandomEventButton from '../events/RandomEventButton'
import DashboardLayout from '../common/DashboardLayout'
import GroupsControl from '../common/GroupsControl'
import PacketGraph from '../common/PacketGraph'
import userCan from '../../util/abilities'
import UserCan from '../common/UserCan'
import { DEVICE_FRAGMENT } from '../../graphql/devices'

// GraphQL
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

// MUI
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

class DeviceShow extends Component {
  render() {
    const { deleteDevice, updateDevice } = this.props
    const { loading, device } = this.props.data

    if (loading) return <DashboardLayout />

    return(
      <DashboardLayout title={device.name}>
        <Card>
          <CardContent>
            <Typography variant="headline" component="h3">
              Device Details
            </Typography>

            <div style={{display: 'flex'}}>
              <div style={{width: '50%'}}>
                <Typography component="p">
                  ID: {device.id}
                </Typography>
                <Typography component="p">
                  Name: {device.name}
                </Typography>
                <Typography component="p">
                  MAC: {device.mac}
                </Typography>
              </div>
              <div style={{width: '50%'}}>
                <GroupsControl
                  groups={device.groups.map(e => e.name)}
                  handleUpdate={(groups) => updateDevice(device.id, {groups: groups})}
                  editable={userCan('update', 'device', device)}
                />
              </div>
            </div>
          </CardContent>

          <CardActions>
            <UserCan action="create" itemType="event">
              <RandomEventButton device_id={device.id} />
            </UserCan>
            <UserCan action="delete" itemType="device" item={device}>
              <Button
                size="small"
                color="secondary"
                onClick={() => deleteDevice(device.id, true)}
              >
                Delete Device
              </Button>
            </UserCan>
          </CardActions>
        </Card>

        <Card style={{marginTop: 24}}>
          <CardContent>
            <Typography variant="headline" component="h3">
              Event Log
            </Typography>
            <EventsTable contextName="devices" contextId={device.id} />
          </CardContent>
        </Card>

        <Card style={{marginTop: 24}}>
          <CardContent>
            <Typography variant="headline" component="h3">
              Real Time Packets
            </Typography>
            <div className="chart-legend left">
              <div className="chart-legend-bulb red"></div>
              <Typography component="p">
                Live Data
              </Typography>
            </div>
            <div className="chart-legend right">
              <div className="chart-legend-bulb blue"></div>
              <Typography component="p">
                From Device
              </Typography>
              <div className="chart-legend-bulb green"></div>
              <Typography component="p">
                To Device
              </Typography>
            </div>
            <PacketGraph contextName="devices" contextId={device.id} />
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ deleteDevice, updateDevice }, dispatch);
}

const queryOptions = {
  options: props => ({
    variables: {
      id: props.match.params.id
    }
  })
}

const query = gql`
  query DeviceShowQuery ($id: ID!) {
    device(id: $id) {
      ...DeviceFragment
      groups {
        name
      }
    }
  }
  ${DEVICE_FRAGMENT}
`

const DeviceShowWithData = graphql(query, queryOptions)(DeviceShow)

export default connect(mapStateToProps, mapDispatchToProps)(DeviceShowWithData);
