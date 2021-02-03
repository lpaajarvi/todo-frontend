import React from 'react'

import Box from '@material-ui/core/Box'

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'

// important in case of someone wanting to update this: handleFetchChange() without arguments could update
// this infobox to disappear while fetching new data, and handleCloseSnack would do the same without
// fetching new data. both are initalized in App.js. ctrl+shift+search for those if it's important to change
// the behaviour, I like it like this that they disappear in some cases but can still stay in others.

// these are given from props 'snackinfo', which is the state 'snack' in app.js, this is not the optimal syntax I know
//     taskObject,
//     actionPerformed,
//     isSuccesful,
//     errorInfo
export default function Infobox({ snackinfo, handleCloseSnack }) {
  // const [ShowThis, setShowThis] = React.useState(snackinfo[4])

  // should have used json object instead of array, or props the right way.
  let task = snackinfo[0]
  let actionPerformed = snackinfo[1]
  let isSuccesful = snackinfo[2]
  let errorInfo = snackinfo[3]
  let isVisible = snackinfo[4]

  let actionInfo = ''

  switch (actionPerformed) {
    case 'delete':
      actionInfo = 'DELETED'
      break
    case 'create':
      actionInfo = 'CREATED'
      break
    case 'modify':
      actionInfo = 'MODIFIED'
      break
    case 'archive':
      actionInfo = 'ARCHIVED'
      break
    case 'unarchive':
      actionInfo = 'UNARCHIVED'
      break
    case 'complete':
      actionInfo = 'COMPLETED'
      break
    case 'fetch':
      // not actually used in successful fetch
      actionInfo = 'FETCH'
      break

    default:
      actionInfo = 'UNKNOWN'
  }

  if (isVisible) {
    return (
      <>
        <Box
          style={{
            padding: '4px',
            backgroundColor: isSuccesful ? 'lightGreen' : 'darkRed',
            color: isSuccesful ? 'black' : 'white',
          }}
          className="infobox"
        >
          {isSuccesful ? (
            <CheckCircleOutlineIcon style={{ float: 'left' }} />
          ) : (
            <ErrorOutlineIcon style={{ float: 'left' }} />
          )}
          <span style={{}}>
            {/* all written message inside this span */}
            {isSuccesful ? (
              <>
                {' '}
                {actionInfo} '{task.title}'{' '}
              </>
            ) : (
              <>
                {' '}
                Error while trying to {actionPerformed}: {errorInfo}{' '}
                {task.title}
              </>
            )}
          </span>
        </Box>
      </>
    )
  } else return <></>
}
