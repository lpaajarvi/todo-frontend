import React, { useState, useEffect } from 'react'

import './App.css'

import TaskForm from './components/TaskForm'

import { HashRouter, Route, Switch } from 'react-router-dom'

import TaskTable from './components/TaskTable.js'

import axiosConnector from './utils/axiosConnector.js'

export default function App() {
  // normal data for material table use in exact route '/'
  const [data, setData] = useState([])
  // archivedData will be sent in the /archived route for the use of material table compoenent
  const [archivedData, setArchivedData] = useState([])
  // tells react that normal data can't be rendered, but some loading message instead
  const [isLoading, setIsLoading] = useState(false)
  // this is a workaround, useEffect has to wait some time because otherwise material table uses
  // the data before the newest modifications are added. This workaround solution may seem stupid way but I tried many different ones that
  // should have been more logical but I didn't get them to work because this Material Table works in mysterious ways.
  // This is not foolproof, but works very well in development mode at least
  const [needToFetch, setNeedToFetch] = useState(1)

  // info to show based on latest action saving or trying to do modifications to database:
  // taskObject, actionPerformed, isSuccesful, errorInfo, isVisible
  //
  // yea i realise now this should have been a json object ofc instead of array but too late to refactor right now, let's hope
  // it gets finished anyway :)
  const [snack, setSnack] = useState([
    //taskObject
    {
      title: 'example',
      minutes: '30',
      due: null,
      isCompleted: false,
      subtasks: [],
    },
    // actionPerformed
    'add',
    // isSuccesful
    true,
    //errorInfo
    '',
    //isVisible
    false,
  ])

  //the object inside might not be needed. trying to fix problems with typing /edit route directly without launchign / first with this
  //but it doesn't work. This state appTask itself is needed though
  const [appTask, setAppTask] = useState([
    {
      title: '',
      minutes: '30',
      due: null,
      isCompleted: false,
      subtasks: [],
    },
  ])

  // THIS IS NOT ACTUALLY USED BUT I DON'T WANT TO TOUCH THE CODE AFTER FINAL RELEASE IN BACKEND/HEROKU BUILD,
  // I'm just adding some documentation with these comments. idea was to have an ability for user to close the latest infobar with this, but it caused re-renders
  // of material table component and could have been a nuisance for the user. State of the bar should have been lower in hierarchy
  // than app.js, and then maybe it would have worked but it might have caused other problems, who knows
  const handleCloseSnack = () => {
    let temp = { ...snack }
    temp[4] = false
    setSnack(temp)
  }

  // handle that will be sent to other components in case of changes to datatable, allows table to be refreshed with a new data
  // it would be great if this could be just given to custom axios component, and it would take care of this, instead of having this in a few
  // different places. But there was problems trying to implement that kind of custom axios component. The axios is class instead of react
  // component in the final release in /utils/axiosConnector.js

  // UPDATE for the final release: these parameters are added for message handling. Not the best way we know, but couldn't get it working properly like we wanted elsewhere.
  const handleFetchChange = (
    taskObject,
    actionPerformed,
    isSuccesful,
    errorInfo,
    isVisible
  ) => {
    setNeedToFetch(needToFetch + 1)
    setSnack([taskObject, actionPerformed, isSuccesful, errorInfo, isVisible])
  }

  const handleTaskChange = (task) => {
    setAppTask(task)
  }

  // each time needToFetch state changes because of the handle, the app knows that new data should be fetched after a while, so everything will be up to date,
  // This is all because Material Table tends to want to use previous state info, so the newest addition/modification won't appear without refresh. It's probably not
  // ideal for this kind of solution where we fetch the data from backend rigth away after sending an addition there.
  //
  // but this might not be foolproof solution for all devices/connections using the app. Adding delay in setTimeOut would probably help but then there would be
  // bigger loading time every time the new data is fetched, which is basically the same as every time some changes are made to the database with the current app client
  useEffect(() => {
    setTimeout(() => fetchArchivedData(), 705)
    setTimeout(() => fetchData(), 700)
  }, [needToFetch])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const fetched = await axiosConnector.fetchBasicData()

      setData(fetched.data)
    } catch (err) {
      // setSnack([{}, 'fetch', false, '' + err.message, true])

      // while alert might not be the best practice, it should be fine here, since this kind of database error will fail the whole app, and we
      // can still see the other error that might have happened before this, for example "Error while trying to create: and task name and other info
      alert('Error trying to get data from database.')
    }

    setIsLoading(false)
  }

  const fetchArchivedData = async () => {
    setIsLoading(true)
    try {
      const fetched = await axiosConnector.fetchArchivedData()

      setArchivedData(fetched.data)
    } catch (err) {
      // this is a little quick fix, that might cause problems if there is something wrong with archived data fetch, but we will comment this out,
      // since I want to set a little fix on the normal fetch, where this fetch problem will not replace a message about some other problem that
      // was happening in addition to fetch problem
      //
      //  setSnack([{}, 'fetch', false, '' + err.message, true])
      //}
    }
    setIsLoading(false)
  }

  return (
    <div className="app">
      <>
        {/* BrowserRouter instead of HashRouter worked perfectly on developement mode, but not in Heroku. This was a very fast fix. Main downside is
        that It will make additional /#/ in our heroku route, so for example create page is https://tamk-4a00ez62-3001-group02.herokuapp.com/#/create
      
      Problem explained: https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writing-manually/36623117#36623117 

      Solutions that do not include /#/ are there but seemed like too much work, especially since we noticed this in 2021:
      https://stackoverflow.com/questions/49240231/removing-from-hashrouter/49241468
      https://dev.to/nburgess/creating-a-react-app-with-react-router-and-an-express-backend-33l3  
       */}

        <HashRouter>
          <Switch>
            <Route
              exact
              path="/"
              component={() => (
                <TaskTable
                  handleTaskChange={handleTaskChange}
                  dataProps={data}
                  isLoading={isLoading}
                  needToFetch={needToFetch}
                  handleFetchChange={handleFetchChange}
                  archivedMode={false}
                  snackinfo={snack}
                  handleCloseSnack={handleCloseSnack}
                />
              )}
            ></Route>

            <Route
              path="/archived"
              component={() => (
                <TaskTable
                  handleTaskChange={handleTaskChange}
                  dataProps={archivedData}
                  isLoading={isLoading}
                  needToFetch={needToFetch}
                  handleFetchChange={handleFetchChange}
                  archivedMode={true}
                  snackinfo={snack}
                  handleCloseSnack={handleCloseSnack}
                />
              )}
            ></Route>

            <Route
              path="/create"
              component={() => (
                <TaskForm
                  //appTask state version didn't work here for some reason so had to repeat this
                  task={{
                    title: '',
                    minutes: '30',
                    due: null,
                    subtasks: [],
                    isCompleted: false,
                  }}
                  handleFetchChange={handleFetchChange}
                />
              )}
            ></Route>

            <Route
              path="/edit"
              component={() => (
                <TaskForm
                  task={appTask}
                  handleFetchChange={handleFetchChange}
                />
              )}
            ></Route>
          </Switch>
        </HashRouter>
      </>
    </div>
  )
}
