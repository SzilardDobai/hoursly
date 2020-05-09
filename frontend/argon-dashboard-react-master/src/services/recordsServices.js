import axios from 'axios'
import { server } from '../index'

axios.defaults.withCredentials = true;

const RecordsServices= {
    getAllUserRecords : async (userName) => {
        let res1 = await axios.get(`${server}getAllUserRecords/${userName}`)
        let res2 = await res1
        console.log(res2)
        return res2.data
    }

};


export default RecordsServices;
