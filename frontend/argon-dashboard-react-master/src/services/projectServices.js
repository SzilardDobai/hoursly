import axios from 'axios'
import { server } from '../index'

axios.defaults.withCredentials = true

const ProjectService = {
  getProjects: (userId) => {
    return new Promise(function (resolve, reject) {
      axios.get(`${server}getProjects/${userId}`, {
      })
        .then(res => {
          return resolve(res.data)
        })
    })
  },

  getProjectInfo: (projectId) => {
    return new Promise(function (resolve, reject) {
      axios.get(`${server}getProjectInfo/${projectId}`, {
      })
        .then(res => {
          return resolve(res.data)
        })
    })
  },

  getUsersFromProject: async (projectId) => {
    let res1 = await axios.get(`${server}getUsersFromProject/${projectId}`)
    let res2 = await res1
    return res2.data
  },

  updateProjectInfo: async (payload) => {
    let res1 = await axios.post(`${server}updateProjectInfo`, payload)
    let res2 = await res1
    return res2.data
  },

  addProject: async (payload) => {
    let res1 = axios.post(`${server}addProject`, payload)
    let res2 = await res1
    return res2.data
  },

  deleteProject: (idsList) => {
    return new Promise(function (resolve, reject) {
        axios.post(`${server}deleteProject`, {idsList})
            .then(res => {
                return resolve(res.data)
            })
    })
},
}

export default ProjectService
