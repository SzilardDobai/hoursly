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
      }
}

export default ProjectService
