import axios from 'axios'
import { server } from '../index'

axios.defaults.withCredentials = true;

const RecordsServices= {
    getAllUserRecords : async (userName) => {
        let res1 = await axios.get(`${server}getAllUserRecords/${userName}`)
        let res2 = await res1
        return res2.data
    },
    getUserRecordsWithoutHours: async (userName) => {
        let res1 = await axios.get(`${server}getUserRecordsWithoutHours/${userName}`)
        let res2 = await res1
        return res2.data
    },
    insertHours: (recordId, hours) => {
        return new Promise(function (resolve, reject) {
            axios.post(`${server}addHours`, {
                recordId: recordId,
                hours: hours
            })
                .then(res => {
                    return resolve(res.data)
                })
        })
    },
}


export default RecordsServices;
