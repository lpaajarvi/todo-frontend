import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import timeConverter from '../utils/timeConverter.js'
import AddTaskButton from './AddTaskButton'
import Accordion from './Accordion'

import SimpleCard from './SimpleCard'
import CircularProgress from '@material-ui/core/CircularProgress'

import Button from '@material-ui/core/Button'
import DoneIcon from '@material-ui/icons/Done'
import IconButton from '@material-ui/core/IconButton'
import ArchiveIcon from '@material-ui/icons/Archive'

import { Link } from 'react-router-dom'

import axiosConnector from '../utils/axiosConnector.js'

import Infobox from './Infobox'

// uses this MaterialTable, very well suited component that gave us a lot of features we wanted with little effort... well sort
// of, since it also caused dozens and dozens of hours work trying to fix some things that we wanted to
// change or were probably bugged, at least in our use,
// that it's not certain it was a wise decision to use it.
// Then again it taught us a lot, hopefully something
// to take home when using other components since this is a whole new world to us, and in the next projects either
// Material Table or some other components might be easier to implement

export default function TaskTable({
  dataProps,
  isLoading,
  handleFetchChange,
  handleTaskChange,
  archivedMode,
  snackinfo,
  handleCloseSnack,
}) {
  const [tableData, setTableData] = useState([{ dataProps }])

  useEffect(() => {
    // console.log(tableData)
  }, [tableData])

  if (dataProps !== tableData) {
    setTableData(dataProps)
  }

  // trying to solve the material-table-losing-the-forced-css-important-width-on-route-change-without-fetch fixed but can't do it right now
  // this might work but who knows, also windows.reload maybe not good practice in react what i've read elsewhere
  // https://www.reddit.com/r/reactjs/comments/eu8v15/how_to_force_refresh_on_a_route_change_in_react/
  // const [, updateState] = React.useState()
  // const forceUpdate = React.useCallback(() => updateState({}), [])

  let data = tableData

  const columns = [
    /*
    not actually needed since we sort this in the backend

    {
      field: 'modified',
      type: 'date',
      defaultSort: 'desc',
      hidden: true,
    },*/

    {
      title: 'DUE',
      field: 'due',
      type: 'date',
      dateSetting: { locale: 'fi-FI' },
      cellStyle: {
        fontSize: '0.9em',
        padding: 5,
      },
      headerStyle: {
        backgroundColor: 'rgb(243, 243, 243)',
        borderRadius: 0,
      },
    },

    {
      title: 'TASK',
      field: 'title',
      cellStyle: {
        fontSize: '0.7em',
        padding: 0,
      },

      render: (rowData) => (
        <>
          <span className="title-wrapper">
            <span className="title-row">
              <span className="title-row-container">
                <span className="title-row-textcontainer">
                  <span className="title-row-accordion">
                    <Accordion
                      handleTaskChange={handleTaskChange}
                      taskObject={rowData}
                      handleFetchChange={handleFetchChange}
                      archivedMode={archivedMode}
                    />
                  </span>

                  {rowData.meta.percentage_done !== 100 ? (
                    <span className="title-row-time-after-title">
                      {timeConverter.minutesToTitle(rowData.meta.minutes_left)}{' '}
                      to do{' '}
                    </span>
                  ) : (
                    <span className="title-row-time-after-title">Done! </span>
                  )}
                </span>

                {rowData.meta.percentage_done !== 100 ? (
                  <span
                    className="title-row-percents"
                    style={{
                      width: rowData.meta.percentage_done + '%',
                    }}
                  ></span>
                ) : (
                  <span
                    className="title-row-percents-done"
                    style={{
                      width: rowData.meta.percentage_done + '%',
                    }}
                  ></span>
                )}
              </span>
            </span>
            {/* <div className="title-percentage-inside-wrapper">
              <span>{rowData.meta.percentage_done}%</span>
            </div> */}
          </span>
        </>
      ),
    },
    {
      title: 'DONE',
      field: 'meta.percentage_done',
      dataType: 'numeric',
      headerStyle: {
        backgroundColor: 'rgb(247, 247, 247)',
      },
      cellStyle: {
        padding: 5,
        fontSize: '0.8em',
        borderRadius: '0 0 0 7px',
      },
      render: (rowData) => (
        <span>
          <span
            className="done-container"
            onClick={
              rowData.meta.percentage_done !== 100 && !archivedMode
                ? async () => {
                    await axiosConnector.archiveOrCompleteTask(rowData.id, 'c+')
                    handleFetchChange(rowData, 'complete', true, '', true)
                  }
                : () => console.log('already completed')
            }
            style={{
              cursor:
                rowData.meta.percentage_done !== 100 && !archivedMode
                  ? 'pointer'
                  : 'auto',
              backgroundColor:
                rowData.meta.percentage_done !== 100 && !archivedMode
                  ? '#e6ffe6'
                  : 'white',
            }}
          >
            {rowData.meta.percentage_done === 100 ? (
              <span className="checkmark">✔️</span>
            ) : (
              <span className="percentage">
                {rowData.meta.percentage_done}%
                {/* a bit complicetd to follow this, but another conditional rendering inside, bceause we
                don't want to show this button in archived mode */}
                {!archivedMode ? (
                  <>
                    <IconButton
                      variant="contained"
                      style={{
                        border: 'none',
                        margin: 5,
                        backgroundColor: 'violet',
                        color: 'black',
                      }}
                      size="small"
                    >
                      <DoneIcon></DoneIcon>
                    </IconButton>
                  </>
                ) : (
                  <> </>
                )}
              </span>
            )}
          </span>
        </span>
      ),
    },
  ]

  if (!isLoading)
    return (
      <>
        <div className={archivedMode ? 'archived-list' : 'todo-list'}>
          <Infobox
            snackinfo={snackinfo}
            handleCloseSnack={handleCloseSnack}
          ></Infobox>

          {archivedMode === false ? (
            <>
              <div className="archive-button-container">
                <Link
                  to="/archived"
                  onClick={handleCloseSnack}
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    style={{
                      backgroundColor: 'rgb(255, 233, 120)',
                    }}
                    size="small"
                  >
                    GO TO ARCHIVED MODE
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="archive-warning">
                <SimpleCard
                  icon={
                    <ArchiveIcon
                      style={{
                        backgroundColor: 'rgb(255, 233, 120)',
                        float: 'left',
                      }}
                    />
                  }
                  message="You are watching tasks that have been archived. Most functionalities have
              been disabled in this mode."
                />
              </div>
            </>
          )}

          <MaterialTable
            className={
              archivedMode ? 'archived-material-table' : 'todo-material-table'
            }
            title={archivedMode ? 'ARCHIVED' : 'TO DO'}
            data={data}
            columns={columns}
            options={{
              headerStyle: { position: 'sticky', top: 0 },
              maxBodyHeight: '100vh',
              searchFieldStyle: {
                width: 200,
              },
              thirdSortClick: true,
              emptyRowsWhenPaging: false,
              selection: false,
              pageSize: 10,
            }}
          />
        </div>

        {archivedMode === false ? (
          <div className="add-task-button-container">
            <Link to="/create">
              <AddTaskButton />
            </Link>
          </div>
        ) : (
          <></>
        )}
      </>
    )
  else {
    return (
      <>
        {' '}
        <CircularProgress />
        <br /> Loading...{' '}
      </>
    )
  }
}
