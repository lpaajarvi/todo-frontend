import React from 'react'

import Button from '@material-ui/core/Button'

// This is taken quite directly from youtube-tutorial, have to admit, works very well for our use like this

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles,
  Typography,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  dialog: {
    padding: theme.spacing(2),
    position: 'absolute',
    top: theme.spacing(5),
  },
  dialogContent: {
    textAlign: 'center',
  },
  dialogAction: {
    justifyContent: 'center',
  },
}))
export default function ConfirmDialog(props) {
  const { confirmDialog, setConfirmDialog } = props
  const classes = useStyles()

  return (
    <Dialog open={confirmDialog.isOpen} classes={{ paper: classes.dialog }}>
      <DialogTitle></DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Typography variant="h6">{confirmDialog.title}</Typography>
        <Typography variant="subtitle2">{confirmDialog.subTitle}</Typography>
      </DialogContent>
      <DialogActions className={classes.dialogAction}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={confirmDialog.onConfirm}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
