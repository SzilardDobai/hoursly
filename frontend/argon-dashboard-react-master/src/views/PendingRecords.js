import React from "react";
import UserService from '../services/userServices.js';
import ProjectService from "../services/projectServices.js";
import Header from "../components/Headers/Header.js";
import CustomTable from "../components/Other/CustomTable";
import RecordsServices from "../services/recordsServices.js";

class PendingRecords extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Pending : [],
        }
    }

    columns = [{
        dataField: 'record_id',
        text: 'ID',
        sort: true,
        hidden: true,
        headerAlign: 'center',
        headerStyle: { fontWeight: 'bold', backgroundColor: 'white' },
        editable: false
    },
    {
        dataField: 'project_name',
        text: 'ProjectName',
        sort: true,
        hidden: false,
        headerAlign: 'center',
        headerStyle: { fontWeight: 'bold', backgroundColor: 'white' },
        editable: false
    },{
        dataField: 'user_name',
        text: 'UserName',
        sort: true,
        hidden: sessionStorage.getItem('role')==='user' ? true : false,
        headerAlign: 'center',
        headerStyle: { fontWeight: 'bold', backgroundColor: 'white' }
    },{
        dataField: 'week',
        text: 'Week',
        sort: true,
        hidden: false,
        headerAlign: 'center',
        headerStyle: { fontWeight: 'bold', backgroundColor: 'white' },
        editable: false
    },{
        dataField: 'year',
        text: 'Year',
        sort: true,
        hidden: false,
        headerAlign: 'center',
        headerStyle: { fontWeight: 'bold', backgroundColor: 'white' },
        editable: false
    },{
        dataField: 'hours',
        text: 'Hours',
        sort: true,
        hidden: false,
        headerAlign: 'center',
        headerStyle: { fontWeight: 'bold', backgroundColor: 'white' }
    }
]

    componentDidMount = async () => {
        const ds = RecordsServices.getUserRecordsWithoutHours(sessionStorage.getItem('username')).then(result => result);
        await Promise.all([ds]).then((response) => {
            this.setState({
                Pending : response[0]
            })
        })
    }

    render() {
        return (
            <>
                <Header />
                <div style={page}><br />
                    <div style={tableContainer} >
                        <div style={{ textAlign: 'right' }} className="mt-4">
                            <h2>Pending Records</h2>
                        </div><br />
                        <br />
                        <CustomTable data = {this.state.Pending} columns = {this.columns} searchBox />
                    </div>
                </div>

               </>
        )
    }
}

const tableContainer = {
    marginLeft: '5%',
    marginRight: '5%',
    color: 'black'
}

const page = {
    minHeight: '82vh'
}

export default PendingRecords;
