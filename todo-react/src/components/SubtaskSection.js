import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import timeConverter from '../utils/timeConverter.js'
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)'

const IOSSlider = withStyles({
  root: {
    color: '#3880ff',
    height: 2,
    padding: '40px 0 10px 10px',
  },
  thumb: {
    height: 28,
    width: 28,
    backgroundColor: 'violet',
    boxShadow: iOSBoxShadow,
    marginTop: -14,
    marginLeft: -14,
    '&:focus, &:hover, &$active': {
      boxShadow:
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 12px)',
    fontSize: '1em',
    width: 50,
    top: -22,
    '& *': {
      background: 'transparent',
      color: '#000',
    },
  },
  track: {
    height: 2,
  },
  rail: {
    height: 2,
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  mark: {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    marginTop: -3,
  },
  markActive: {
    opacity: 1,
    backgroundColor: 'currentColor',
  },
})(Slider)

export default function SubtaskSection({
  title,
  minutes,
  isCompleted,
  handleSubTitleChange,
  handleSubSliderChange,
  handleSubCompletedChange,
}) {
  return (
    <>
      <div>
        <TextField
          autoFocus={true}
          value={title}
          label="Subtask Name"
          style={{ margin: 8 }}
          placeholder="Enter task name here"
          helperText=""
          fullWidth={true}
          margin="normal"
          onChange={handleSubTitleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      <div className="slider-width">
        <Typography id="discrete-slider" gutterBottom style={{ margin: 8 }}>
          Subtask length
        </Typography>

        <IOSSlider
          defaultValue={minutes}
          style={{ margin: 8 }}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={15}
          marks
          min={15}
          max={480}
          onChange={handleSubSliderChange}
          valueLabelFormat={timeConverter.minutesToSlider(minutes)}
        />
      </div>

      <div>
        <Checkbox
          style={{ color: 'purple' }}
          checked={isCompleted}
          onChange={() => handleSubCompletedChange()}
          size="small"
          inputProps={{ 'aria-label': 'checkbox with small size' }}
        />
        Mark as done
      </div>
    </>
  )
}
