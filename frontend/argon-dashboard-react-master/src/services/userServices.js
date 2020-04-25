import axios from 'axios'
import { server } from '../index'

axios.defaults.withCredentials = true

const UserService = {
    auth: async (payload) => {
        return new Promise(function (resolve, reject) {
            axios.post(`${server}auth`, payload)
                .then(res => {
                    return resolve(res.data)
                })
        })
    },

    getUsers: () => {
        return new Promise(function (resolve, reject) {
            axios.get(server + 'getUsers', {
            })
                .then(res => {
                    return resolve(res.data)
                })
        })
    },

    getRoles: () => {
        return new Promise(function (resolve, reject) {
            axios.get(server + 'getRoles', {
            })
                .then(res => {
                    return resolve(res.data)
                })
        })
    },  
    
    getUserRole: (id) => {
        return new Promise(function (resolve, reject) {
            axios.get(`${server}getUserRole/${id}`, {
            })
                .then(res => {
                    return resolve(res.data)
                })
        })
    },

    getUserInfo: (id) => {
        return new Promise(function (resolve, reject) {
            axios.get(`${server}getUserInfo/${id}`, {
            })
                .then(res => {
                    return resolve(res.data)
                })
        })
    },

    addUser: async (row) => {
        let username = row.firstName.toLowerCase().split(/[- ]/)[0] + '.' + row.lastName.toLowerCase().split(/[- ]/)[0];
        let usernameExists
        let usernameExists2 = false
        let contor = 2

        await axios.post(`${server}checkUsername/${username}`).then(res => { usernameExists = res.data; usernameExists2 = res.data })
        while (usernameExists) {
            await axios.post(`${server}checkUsername/${username}${contor}`).then(res => {
                usernameExists = res.data
                if (usernameExists)
                    contor += 1
            })
        }

        if (usernameExists2)
            username += contor

        return new Promise(function (resolve, reject) {
            axios.post(`${server}addUser`, {
                username: username,
                first_name: row.firstName.toLowerCase(),
                last_name: row.lastName.toLowerCase(),
                department: row.department.toLowerCase(),
                position: row.position.toLowerCase()
            })
                .then(res => {
                    return resolve(res.data)
                })
        })
    },

    deleteUser: (idsList) => {
        return new Promise(function (resolve, reject) {
            axios.post(`${server}deleteUser`, {idsList})
                .then(res => {
                    return resolve(res.data)
                })
        })
    },

    changePassword: async (payload) => {
        let res1 = await axios.post(`${server}changePassword`, payload)
        let res2 = await res1
        return res2.data
    },

    updateUserInfo: async (payload) => {
        let res1 = await axios.post(`${server}updateUserInfo`, payload)
        let res2 = await res1
        return res2.data
    },

    updateUserRole: async (payload) => {
        let res1 = await axios.post(`${server}updateUserRole`, payload)
        let res2 = await res1
        return res2.data
    },

    addUserProjectLink: async (payload) => {
        let res1 = await axios.post(`${server}addUserProjectLink`, payload)
        let res2 = await res1
        return res2.data
    },

    deleteUserProjectLink: async (payload) => {
        let res1 = await axios.post(`${server}deleteUserProjectLink`, payload)
        let res2 = await res1
        return res2.data
    }
}

export default UserService
