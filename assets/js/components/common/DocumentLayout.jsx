import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles';
import withTheme from './withTheme.jsx'

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    zIndex: 1,
    position: 'relative',
    display: 'flex',
    width: '100%',
    backgroundColor: theme.palette.background.default,
  },
  main: {
    flexGrow: 1,
    margin: theme.spacing.unit * 4
  },

});

@withTheme
@withStyles(styles)
class DocumentLayout extends Component {
  render() {
    const { classes, title } = this.props;

    return (
      <div className={classes.root}>
        <main className={classes.main}>
          {this.props.children}
        </main>
      </div>
    )
  }
}

export default DocumentLayout
