import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    backgroundColor: 'rgb(230, 230, 255)',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
    color: 'black',
  },
  pos: {
    marginBottom: 12,
  },
})

export default function SimpleCard({ message, icon }) {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} gutterBottom>
          {icon}
          {message}
        </Typography>
      </CardContent>
      <CardActions>
        <Link to="/">
          <Button color="primary" size="small">
            BACK TO NORMAL MODE
          </Button>
        </Link>
      </CardActions>
    </Card>
  )
}
