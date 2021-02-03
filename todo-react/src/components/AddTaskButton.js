import React from 'react'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

export default function AddTaskButton() {
  return (
    <Fab
      color="primary"
      aria-label="add"
      style={{ padding: '40px' }}
      size="large"
      display="table"
      margin="auto"
      text-align="center"
    >
      <AddIcon />
    </Fab>
  )
}
