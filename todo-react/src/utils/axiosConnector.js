import axios from 'axios'

// since this class can't deal with handleFetchChange on its own, and importing like
// that doesn't work in react, this class falls a bit short. Would probably need to
// be an actual react component but let's see if there's time to do it before deadline

// import handleFetchChange from '../App.js'

let host = ''

// UNCOMMENT NEXT LINE TO USE LOCALHOST!
// host = 'http://localhost:8080'

// used in api.js
const axiosConnector = {
  fetchBasicData: async () => {
    const fetched = await axios.get(`${host}/api/`).catch(function (error) {
      if (error.response) {
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      }
    })

    return fetched
  },

  fetchArchivedData: async () => {
    const fetched = await axios
      .get(`${host}/api/archived`)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        }
      })

    return fetched
  },

  //used in TaskForm.js & Accordion.js
  postTaskForm: async (urlTweak, json) => {
    let res = await axios
      .post(`${host}/api${urlTweak}`, json)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        }
      })
    // console.log(res)
    return res

    //.then((response) => console.log(response))
  },

  //used in Accordion.js

  deleteTask: async (id) => {
    let res = await axios.delete(`${host}/api/${id}`).catch(function (error) {
      if (error.response) {
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      }
    })
    // console.log(res)
    return res

    // .then(handleFetchChange())
  },

  //used in Accordion.js and TaskTable.js
  archiveOrCompleteTask: async (id, regexp) => {
    let res = await axios
      .put(`${host}/api/put/${regexp}${id}`)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        }
      })
    // console.log(res)
    return res

    //.then((response) => console.log(response))
    //.then(handleFetchChange())
  },
}

export default axiosConnector
