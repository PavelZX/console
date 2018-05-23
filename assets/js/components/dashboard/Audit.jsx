import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import DashboardLayout from '../common/DashboardLayout'
import { formatDatetime } from '../../util/time'

// GraphQL
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

// MUI
import Typography from 'material-ui/Typography';
import Card, { CardContent } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination } from 'material-ui/Table';

// Icons
import DashboardIcon from 'material-ui-icons/Dashboard';

class Audit extends Component {
  constructor(props) {
    super(props)

    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)

    this.state = {
      page: 1,
      pageSize: 10
    }
  }

  handleChangeRowsPerPage(pageSize) {
    this.setState({ pageSize, page: 1 })
    const { fetchMore } = this.props.data

    fetchMore({
      variables: { page: 1, pageSize },
      updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult
    })
  }

  handleChangePage(page) {
    this.setState({ page })
    const { fetchMore } = this.props.data
    const { pageSize } = this.state

    fetchMore({
      variables: { page, pageSize },
      updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult
    })
  }

  render() {
    if (this.props.data.loading) {
      return (
        <DashboardLayout title="Audit Trails">
          <Paper style={{textAlign: 'center', padding: '5em'}}>
            <Typography variant="display1" style={{color: "#e0e0e0"}}>
              Loading...
            </Typography>
          </Paper>
        </DashboardLayout>
      )
    }
    const { auditTrails } = this.props.data
    const { page } = this.state

    return (
      <DashboardLayout title="Audit Trails">
        <Card>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Object</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.data.auditTrails.entries.map(action => (
                  <TableRow key={action.id}>
                    <TableCell>{action.userEmail}</TableCell>
                    <TableCell>{action.object}</TableCell>
                    <TableCell>{action.action}</TableCell>
                    <TableCell>{action.description}</TableCell>
                    <TableCell>{formatDatetime(action.updatedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TablePagination
                  count={auditTrails.totalEntries}
                  onChangePage={(e, page) => this.handleChangePage(page + 1)}
                  onChangeRowsPerPage={(e) => this.handleChangeRowsPerPage(e.target.value)}
                  page={page - 1}
                  rowsPerPage={auditTrails.pageSize}
                />
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }
}

const query = gql`
  query AuditTrailsQuery ($page: Int, $pageSize: Int) {
    auditTrails (page: $page, pageSize: $pageSize) {
      entries {
        id
        userEmail
        object
        action
        description
        updatedAt
      },
      totalEntries,
      totalPages,
      pageSize,
      pageNumber
    }
  }
`

const queryOptions = {
  options: props => ({
    fetchPolicy: 'network-only',
    variables: {
      page: 1,
      pageSize: 10
    }
  })
}

const AuditWithData = graphql(query, queryOptions)(Audit)
export default AuditWithData