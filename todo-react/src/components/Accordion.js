import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'

import Checkbox from '@material-ui/core/Checkbox'
import EditIcon from '@material-ui/icons/Edit'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'

// import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import ArchiveIcon from '@material-ui/icons/Archive'
import UnarchiveIcon from '@material-ui/icons/Unarchive'

import timeConverter from '../utils/timeConverter'

import axiosConnector from '../utils/axiosConnector'

import { Link } from 'react-router-dom'

import ConfirmDialog from './ConfirmDialog'

// should really be in /utils/ but it's just one method so keeping it here for now
function arraysEqual(a1, a2) {
  /* WARNING: arrays must not contain {objects} or behavior may be undefined */
  return JSON.stringify(a1) === JSON.stringify(a2)
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  checkbox: {
    padding: '5px',
  },
  button: {
    padding: '10px',
  },

  listItem: {
    listStyle: 'none',
  },
}))

/*
Important: The SimpleAccordion will be somewhat different based on if it's used in archived mode or normal mode
*/

// IN GENERAL: Accordion is the component that shows the task title in the table, and on click opens up the possible subtask-list and buttons in each task for user to see
// when he's using the main view (material table) component. It doesn't cause state-issues/bugs with material-table, which we had to deal a lot when trying different
// approaches, and it is also quite practical and in some ways even better than what we designed the app to be at first. One minor issue is that user might get lost in the
// way and forget to save the changes he makes, since he can open other accordions at the same time, but we give clear visual feeldback with UNSAVED CHANGED + appearing SAVE
// button so all in all we are very happy about this solution.
export default function SimpleAccordion({
  taskObject,
  handleFetchChange,
  handleTaskChange,
  archivedMode,
}) {
  const [task, setTask] = React.useState(taskObject)

  const [subtasksCompleted, setSubtasksCompleted] = React.useState(() => {
    let newArray = []
    taskObject.subtasks.map((item, index) =>
      newArray.push(Boolean(item.isCompleted))
    )

    return newArray
  })

  // i'm aware this is not good to repeat this but don't know how else to do it right now because
  // normal variables can't be accessed before initialization of states and we need this originalState for
  // conditional rendering
  const [originalState, setOriginalState] = React.useState(() => {
    let newArray = []
    taskObject.subtasks.map((item, index) =>
      newArray.push(Boolean(item.isCompleted))
    )

    return newArray
  })

  const [confirmDialog, setConfirmDialog] = React.useState({
    isOpen: false,
    title: '',
    subTitle: '',
  })

  const handleChange = (index) => {
    let newArray = [...subtasksCompleted]
    newArray[index] = !newArray[index]

    setSubtasksCompleted(newArray)
  }

  // This method will be used before sending subtask completion changes to database
  // We'll update the task-state with subtasksCompleted (checkbox) values first
  const updateStateObject = async () => {
    let newObject = { ...task }

    for (let i = 0; i < subtasksCompleted.length; i++) {
      newObject.subtasks[i].isCompleted = subtasksCompleted[i]
    }

    setTask(newObject)
  }

  // This is for the use of SAVE-Button, when you click those checkboxes on subtask list
  const sendChangesToBackend = async () => {
    await updateStateObject()

    try {
      let response = await axiosConnector.postTaskForm('/modify', task)
      // 200 means succesful post, so we know to give correct info to infoBox through app.js Snack-state, using handleFetchChange
      if (response.status === 200) {
        handleFetchChange(task, 'modify', true, '', true)
      } else {
        // otherwise we will show error message, and ok this code might not mean much to average user but it's still something
        handleFetchChange(
          task,
          'modify',
          false,
          '' + response.status + ': ' + response.statusText,
          true
        )
      }
    } catch (err) {
      // then there is probably the real error message that could happen more often
      handleFetchChange(task, 'modify', false, '' + err.message, true)
    }
  }

  // this is for the use of ARCHIVE and UNARCHIVE buttons, I know it's stupid to make many of these monsters but more info on README.MD i guess
  const axiosArchiver = async (id, regex) => {
    let actionToDo = regex === 'a+' ? 'archive' : 'unarchive'
    try {
      let response = await axiosConnector.archiveOrCompleteTask(id, regex)
      if (response.status === 200) {
        handleFetchChange(task, actionToDo, true, '', true)
      } else {
        // otherwise we will show error message, and ok this code might not mean much to average user but it's still something
        handleFetchChange(
          task,
          actionToDo,
          false,
          '' + response.status + ': ' + response.statusText,
          true
        )
      }
    } catch (err) {
      // then there is probably the real error message that could happen more often
      handleFetchChange(task, actionToDo, false, '' + err.message, true)
    }
  }

  // another monster with copy-pase, almost the same as previous ones but don't want to risk making bugs right now when it's one day to release day
  const axiosDeleter = async (id) => {
    try {
      let response = await axiosConnector.deleteTask(id)
      if (response.status === 204) {
        handleFetchChange(task, 'delete', true, '', true)
      } else {
        // otherwise we will show error message, and ok this code might not mean much to average user but it's still something
        handleFetchChange(
          task,
          'delete',
          false,
          '' + response.status + ': ' + response.statusText,
          true
        )
      }
    } catch (err) {
      // then there is probably the real error message that could happen more often
      handleFetchChange(task, 'delete', false, '' + err.message, true)
    }
  }

  const classes = useStyles()

  return (
    <div className="accordion-testi">
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className="accordion-task-title">{task.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {/* In archived mode there will be different renderings because there will be less functionalities. Watch carefully for each
            terminary operation if you want to follow the logic */}

            {archivedMode === false ? (
              <>
                <span className="subtask-container">
                  {/* Finally came up with a solution to get rid of the uinque key warning: it uses either subtask_id or math_randomed one that
                  is given by the name list_id in CreateNewSubtask() in TaskForm.js */}
                  {task.subtasks.map((item, index) => (
                    <li
                      key={
                        item.subtask_id !== undefined
                          ? item.subtask_id
                          : item.list_id
                      }
                      className={classes.listItem}
                    >
                      <span className="subtask-wrapper">
                        <Checkbox
                          key={'checkbox' + item.id}
                          style={{ color: 'purple' }}
                          className={classes.checkbox}
                          checked={subtasksCompleted[index]}
                          onChange={() => handleChange(index)}
                          size="small"
                          inputProps={{
                            'aria-label': 'checkbox with small size',
                          }}
                        />

                        <span onClick={() => handleChange(index)}>
                          {item.title}
                        </span>

                        <span className="subtask-minutes">
                          {timeConverter.minutesToSubtask(item.minutes)}
                        </span>
                      </span>
                    </li>
                  ))}
                </span>
              </>
            ) : (
              <>
                <span className="subtask-container">
                  {task.subtasks.map((item, index) => (
                    <li
                      key={
                        item.subtask_id !== undefined
                          ? item.subtask_id
                          : item.list_id
                      }
                      className={classes.listItem}
                    >
                      <span className="subtask-wrapper">
                        <span>{item.title}</span>

                        <span className="subtask-minutes">
                          {timeConverter.minutesToSubtask(item.minutes)}
                        </span>
                      </span>
                    </li>
                  ))}
                </span>
              </>
            )}

            <span className="button-group">
              <IconButton
                onClick={() => {
                  setConfirmDialog({
                    isOpen: true,
                    title: `Delete "${task.title}"?`,
                    subTitle: "You can't undo this operation",
                    onConfirm: async () => {
                      axiosDeleter(task.id)
                    },
                  })
                }}
                variant="contained"
                color="secondary"
                className={classes.button}
                style={{
                  border: 'none',
                  margin: 5,
                  backgroundColor: 'red',
                  color: 'black',
                }}
                size="small"
              >
                <DeleteForeverIcon />
              </IconButton>

              {archivedMode === false ? (
                <>
                  <Link
                    to={{
                      pathname: '/edit',
                    }}
                  >
                    {/* // EDIT BUTTON */}
                    <IconButton
                      onClick={async () => {
                        await handleTaskChange(task)

                        // handleFetchChange without attributes is wiping the infobox while fetching the data
                        handleFetchChange()
                      }}
                      style={{
                        backgroundColor: 'rgb(179, 217, 255)',
                        border: 'none',
                        margin: 5,
                        color: 'black',
                      }}
                      variant="contained"
                      size="small"
                      className={classes.button}
                    >
                      <EditIcon />
                    </IconButton>
                  </Link>

                  {/* // ARCHIVE BUTTON */}
                  <IconButton
                    variant="contained"
                    color="secondary"
                    style={{
                      backgroundColor: 'rgb(255, 233, 120)',
                      border: 'none',
                      color: 'black',
                      margin: 5,
                    }}
                    className={classes.button}
                    size="small"
                    onClick={async () => {
                      axiosArchiver(task.id, 'a+')
                    }}
                  >
                    <ArchiveIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  {/* // UNARCHIVE BUTTON */}
                  <IconButton
                    variant="contained"
                    color="secondary"
                    style={{
                      backgroundColor: 'violet',
                      border: 'none',
                      color: 'black',
                      margin: 5,
                    }}
                    className={classes.button}
                    size="small"
                    onClick={async () => {
                      axiosArchiver(task.id, 'a-')
                    }}
                  >
                    <UnarchiveIcon />
                  </IconButton>
                </>
              )}
            </span>

            {!arraysEqual(originalState, subtasksCompleted) ? (
              <span className="confirm-saves">
                <span className="confirm-saves-text">UNSAVED CHANGES</span>
                <Button
                  style={{
                    backgroundColor: '#ff8566',
                    border: 'none',
                    fontSize: '1.2em',
                    padding: '2px 5px 2px 5px',
                    textShadow: '1px 1px #f8f7ed',
                  }}
                  variant="contained"
                  size="small"
                  className={classes.button}
                  onClick={() => sendChangesToBackend()}
                  startIcon={<CheckCircleOutlineIcon />}
                >
                  SAVE
                </Button>
              </span>
            ) : (
              <></>
            )}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </div>
  )
}
