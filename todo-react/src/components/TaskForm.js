import React from 'react'

import { withStyles, makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

import 'date-fns'
import Grid from '@material-ui/core/Grid'
import DateFnsUtils from '@date-io/date-fns'

import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'

import timeConverter from '../utils/timeConverter.js'

import Button from '@material-ui/core/Button'

import SaveIcon from '@material-ui/icons/Save'

import CancelIcon from '@material-ui/icons/Cancel'

import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

import axiosConnector from '../utils/axiosConnector.js'
import SubtaskSection from './SubtaskSection.js'
import Checkbox from '@material-ui/core/Checkbox'

import { Link } from 'react-router-dom'

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'

const useStyles = makeStyles((theme) => ({
  root: {
    border: '4px solid lightgrey',
    padding: '5px',
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    maxWidth: '400px',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch',
  },
  slider: {
    width: 300,
  },
  cancelButton: {
    maxWidth: '12px',
    maxHeight: '42px',
  },
  cancelButtonSub: {
    maxWidth: '12px',
    maxHeight: '42px',
    left: '-15px',
  },
  saveButton: {
    marginTop: '50px',
  },
  subTaskWrapper: {
    marginTop: '2px',
    maxWidth: '350px',
  },
  subSection: {
    borderLeft: '2px solid lightGray',
    listStyle: 'none',
    paddingRight: '5%',
    marginBottom: '39px',
    backgroundColor: 'rgb(179, 255, 217)',
  },
}))

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

function slider_value_text(value) {
  // testt
  return `${value}`
}

// IMPORTANT TO KNOW: This component will be (re-)used in both /create and /edit routes (found in App.js) with
// the difference of whether to create a new entry to edit existing.
//
// When (task taken as props), task.id === undefined, then component is in "create mode" (so to speak)
// otherwise it's in "edit mode"
//
// in practice the difference is whether it sends the data throuh POST to [hosturl]/api/ for adding a new task to database
// [hosturl]/api/modify

export default function TaskForm({ task, handleFetchChange }) {
  // forcing of re-render, finally came with this solution to fix bugged visuals in ui sliders when removing subtasks.
  // Let's hope there will be no outdated comments remaining talking about this issue, since this should fix it unless more problems
  // might occur that don't show up right away and it's almost the final release day
  const [, updateState] = React.useState()
  const forceUpdate = React.useCallback(() => updateState({}), [])

  async function saveTask() {
    let urlTweak = task.id !== undefined ? '/modify' : ''
    let action = task.id !== undefined ? 'modify' : 'create'

    let json = {
      id: task.id,
      created: task.created,
      modified: task.modified,

      title: TitleValue,
      minutes: SliderValue,
      due: selectedDate,
      subtasks: [],

      isCompleted: CompletedValue,
      isArchived: task.isArchived,
    }

    for (let i = 0; i < subtaskArray.length; i++) {
      json.subtasks.push({
        subtask_id: subtaskArray[i].subtask_id,
        maintask_id: subtaskArray[i].maintask_id,

        title: subtaskArray[i].title,
        minutes: subtaskArray[i].minutes,
        isCompleted: subtaskArray[i].isCompleted,
      })
    }

    try {
      let response = await axiosConnector.postTaskForm(urlTweak, json)
      // 200 means succesful post, so we know to give correct info to infoBox through app.js Snack-state, using handleFetchChange
      if (
        (response.status === 200 && action === 'modify') ||
        (response.status === 201 && action === 'create')
      ) {
        handleFetchChange(json, action, true, '', true)
      } else {
        // otherwise we will show error message, and ok this code might not mean much to average user but it's still something
        handleFetchChange(
          json,
          action,
          false,
          '' + response.status + ': ' + response.statusText,
          true
        )
      }
    } catch (err) {
      // then there is probably the real error message that could happen more often
      handleFetchChange(json, action, false, '' + err.message, true)
    }
  }

  const [CompletedValue, setCompletedValue] = React.useState(task.isCompleted)

  const [SliderValue, setSliderValue] = React.useState(task.minutes)

  const [TitleValue, setTitleValue] = React.useState(task.title)

  const [selectedDate, setSelectedDate] = React.useState(task.due)

  const [subtaskArray, setSubtasks] = React.useState(
    task.subtasks !== undefined ? task.subtasks : []
  )

  const createNewSubtask = () => {
    // this didn't work like it was supposed to, can't seem to fix it anymore,
    // minutes for subtasks will always be 15 then at start
    // sort of case of null or undefined might have ruined it. It's a minor issue though,
    // not really a bug but just couldn't get it to work like we wanted.

    // let minutesToAdd =
    //  SliderValue === (0 || undefined || null) ? 15 : SliderValue

    setSubtasks([
      ...subtaskArray,
      {
        list_id: Math.random(),
        title: 'Subtask ' + (subtaskArray.length + 1),
        minutes: 15,

        isCompleted: false,
      },
    ])
  }

  // handles with Sub before them are used in SubtaskSection.js as props
  // and the others control the values in main task

  const handleSubTitleChange = (index) => (e) => {
    let newArr = [...subtaskArray]
    newArr[index].title = e.target.value
    setSubtasks(newArr)
  }

  const handleSubSliderChange = (index) => (e) => {
    let newArr = [...subtaskArray]
    newArr[index].minutes = e.target.getAttribute('aria-valuenow')

    setSubtasks(newArr)
  }

  const handleSubCompletedChange = (index) => (e) => {
    let newArr = [...subtaskArray]

    if (newArr[index].isCompleted === true) {
      newArr[index].isCompleted = false
    } else {
      newArr[index].isCompleted = true
    }

    setSubtasks(newArr)
  }

  const removeSubtask = (index) => () => {
    let newArr = [...subtaskArray]

    //in case this was the only subtask, let's put the SliderValue(minutes) back from zero to what was in the last subtask instead
    //otherwise it would be possible to save a task with minutes 0 , so it would be sort of completed right away without being complted
    if (newArr.length === 1) {
      setSliderValue(subtaskArray[0].minutes)
    }

    newArr.splice(index, 1)

    setSubtasks(newArr)
    // PHEW Managed to fix the bugged slider visuals after removing subtasks with this forceUpdate().
    // It's almost the final release day but let's see if there's any more bugs occuring
    forceUpdate()
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue)
  }

  const handleTitleChange = (e) => {
    setTitleValue(e.target.value)
  }

  // used in checkbox if a user wants to undo a task that was already marked as complete, or
  // create a task that is already completed because some users might want to use the app like that
  const handleTaskChange = () => {
    setCompletedValue(!CompletedValue)
  }

  const classes = useStyles()

  return (
    <>
      <div className={classes.root}>
        <div className="create-wrapper">
          <Link to="/">
            <Button
              color="secondary"
              size="small"
              className={classes.cancelButton}
              startIcon={<CancelIcon />}
              // fullWidth="false"
            ></Button>
          </Link>

          <div>
            <TextField
              autoFocus={true}
              value={TitleValue}
              id="title"
              label="Task Name"
              style={{ margin: 8 }}
              placeholder="Enter task name here"
              helperText=""
              fullWidth
              margin="normal"
              onChange={handleTitleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            {/* <Grid container justify="space-around"> */}
            <Grid container className="duedate">
              <Typography
                id="datelabel"
                gutterBottom
                style={{
                  margin: 8,
                  marginBottom: -10,
                  fontSize: '2',
                  color: 'gray',
                }}
              >
                Due Date (DEADLINE):
              </Typography>
              <KeyboardDatePicker
                style={{ margin: 8 }}
                margin="normal"
                id="due_date"
                //label="Due Date (DEADLINE)"
                format="dd.MM.yyyy"
                value={selectedDate}
                // when creating new task, due_date can't be past past date, but in edit mode it can
                disablePast={task.id === undefined}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change due date',
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>

          {/* in case there are subtasks, we don't want to have a slider or checkbox to mark the whole task done cause
          there would not be good solution how to deal with subtask-completions in a "perfect" way for all possible
          scenarios after that. User can still can
          mark the whole task done in the main menu, or he can mark all subtasks as done manually here if that's what he wants to
          do. Also checking some subtasks undone will mark the task undone as a whole too of course */}

          {subtaskArray.length === 0 ? (
            <>
              <div className={classes.slider}>
                <Typography id="ios-slider" gutterBottom style={{ margin: 8 }}>
                  Adjust task length:
                </Typography>

                <IOSSlider
                  disabled={
                    subtaskArray !== undefined ? subtaskArray.length > 0 : false
                  }
                  style={{ margin: 8 }}
                  defaultValue={SliderValue}
                  getAriaValueText={slider_value_text}
                  valueLabelDisplay="auto"
                  step={15}
                  marks
                  min={15}
                  max={480}
                  onChange={handleSliderChange}
                  valueLabelFormat={timeConverter.minutesToSlider(SliderValue)}
                />
              </div>
              <div>
                <Checkbox
                  style={{ color: 'purple' }}
                  checked={CompletedValue}
                  onChange={() => handleTaskChange()}
                  size="small"
                  inputProps={{ 'aria-label': 'checkbox with small size' }}
                />
                Mark this task as complete
              </div>
            </>
          ) : (
            <> </>
          )}

          <div className={classes.subTaskWrapper}>
            <div className="create-subtask">
              <ul style={{ margin: 0 }}>
                {subtaskArray.map((item, index) => (
                  <li
                    key={
                      item.subtask_id !== undefined
                        ? item.subtask_id
                        : item.list_id
                    }
                    className={classes.subSection}
                  >
                    <Button
                      color="secondary"
                      size="small"
                      className={classes.cancelButtonSub}
                      startIcon={<CancelIcon />}
                      onClick={removeSubtask(index)}
                    ></Button>

                    <SubtaskSection
                      minutes={item.minutes}
                      title={item.title}
                      isCompleted={item.isCompleted}
                      handleSubTitleChange={handleSubTitleChange(index)}
                      handleSubSliderChange={handleSubSliderChange(index)}
                      handleSubCompletedChange={handleSubCompletedChange(index)}
                    ></SubtaskSection>
                  </li>
                ))}
              </ul>
            </div>

            <Fab
              variant="extended"
              color="primary"
              style={{ backgroundColor: 'green', marginLeft: '20px' }}
              size="small"
              onClick={() => {
                createNewSubtask()
              }}
            >
              <AddIcon />
              ADD SUBTASK
            </Fab>
          </div>

          <br />
          {/* disabled props=false doesnt work like it's supposed to according to their documentation/tutorials
           in material ui api so had to do this very confusing own version where the same button gets
           rendered as disabled if the task value is '' */}
          {TitleValue !== '' ? (
            <>
              <Link to="/">
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  className={classes.saveButton}
                  onClick={() => {
                    saveTask()
                  }}
                  startIcon={<SaveIcon />}
                >
                  Save
                </Button>
              </Link>
            </>
          ) : (
            <>
              <div>
                <Button
                  disableElevation
                  disabled
                  variant="contained"
                  color="primary"
                  size="medium"
                  className={classes.root}
                  onClick={() => {
                    /* saveTask() */
                  }}
                  startIcon={<SaveIcon />}
                >
                  Save
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
