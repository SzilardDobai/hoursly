import React from "react";
import UserService from '../services/userServices.js';
import ProjectService from "../services/projectServices.js";
import Header from "../components/Headers/Header.js";
import CustomTable from "../components/Other/CustomTable";

import {
    Alert,
    Button,
    Modal,
    FormGroup,
    Input,
    Col,
    Row,
    Form
} from "reactstrap";

import Select from 'react-select'
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

class Projects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: { active: false, title: '' },
            projects: [],
            currentProjectId: '',
            currentProjectName: '',
            currentProjectDetails: '',
            currentClient: '',
            currentIsActive: false,
            dangerProjectName: '',
            dangerProjectDetails: '',
            dangerClient: '',
            dangerIsActive: '',
            changeSuc: false,
            changeErr: false,
            changeErrData: '',
            usersArr: [],
            currentUsers: []
        }
    }

    columns = [{
        dataField: 'project_id',
        text: 'ID',
        sort: true,
        hidden: true,
        headerAlign: 'center',
        headerStyle: { fontWeight: 'bold', backgroundColor: 'white' }
    }, {
        dataField: 'project_name',
        text: 'Project Name',
        sort: true,
        headerAlign: 'center',
        headerStyle: { fontWeight: 'bold', backgroundColor: 'white' }
    }, {
        dataField: 'project_details',
        text: 'Project Details',
        sort: true,
        headerAlign: 'center',
        headerStyle: { fontWeight: 'bold', backgroundColor: 'white' }
    }, {
        dataField: 'client',
        text: 'Client',
        sort: true,
        headerAlign: 'center',
        headerStyle: { fontWeight: 'bold', backgroundColor: 'white' }
    }, {
        dataField: 'isactive',
        text: 'Is Active',
        sort: true,
        formatter: (cell) => { return (cell === 1 ? 'yes' : 'no') },
        headerAlign: 'center',
        headerStyle: { fontWeight: 'bold', backgroundColor: 'white' }
    }]

    componentDidMount = async () => {
        const ds = ProjectService.getProjects(1).then(result => result);
        await Promise.all([ds]).then((response) => {
            this.setState({
                projects: response[0]
            })
        })
    }


    triggerModal = async (row) => {
        if (!row) {
            let usersArr = []

            await UserService.getUsers().then(res => {
                res.forEach(r => {
                    if (r.user_id !== 1)
                        usersArr.push({
                            label: r.first_name[0].toUpperCase() + r.first_name.slice(1) + ' ' + r.last_name[0].toUpperCase() + r.last_name.slice(1) + ' ( ' + r.username + ' ) ',
                            value: r.user_id
                        })
                })
            })

            this.setState({
                currentProjectId: '',
                currentProjectName: '',
                currentProjectDetails: '',
                currentClient: '',
                currentIsActive: false,
                dangerProjectName: '',
                dangerProjectDetails: '',
                dangerClient: '',
                dangerIsActive: '',
                changeSuc: false,
                changeErr: false,
                changeErrData: '',
                usersArr: usersArr,
                currentUsers: []
            })

            this.toggleModal("Add Project")

        } else {
            let currentUsers = []
            let usersArr = []

            await UserService.getUsers().then(res => {
                res.forEach(r => {
                    if (r.user_id !== 1)
                        usersArr.push({
                            label: r.first_name[0].toUpperCase() + r.first_name.slice(1) + ' ' + r.last_name[0].toUpperCase() + r.last_name.slice(1) + ' ( ' + r.username + ' ) ',
                            value: r.user_id
                        })
                })
            })

            await ProjectService.getUsersFromProject(row.project_id).then(res => {
                res.forEach(r => {
                    if (r.user_id !== 1)
                        currentUsers.push({
                            label: r.first_name[0].toUpperCase() + r.first_name.slice(1) + ' ' + r.last_name[0].toUpperCase() + r.last_name.slice(1) + ' ( ' + r.username + ' ) ',
                            value: r.user_id
                        })
                })
            })

            this.setState({
                currentProjectId: row.project_id,
                currentProjectName: row.project_name,
                currentProjectDetails: row.project_details,
                currentClient: row.client,
                currentIsActive: row.isactive === 1 ? true : false,
                dangerProjectName: '',
                dangerProjectDetails: '',
                dangerClient: '',
                dangerIsActive: '',
                changeSuc: false,
                changeErr: false,
                changeErrData: '',
                usersArr: usersArr,
                currentUsers: currentUsers
            })

            this.toggleModal("Change Project Info")
        }

    }

    toggleModal = modalTitle => {
        this.setState({
            modal: { active: !this.state.modal.active, title: modalTitle }
        });
    };

    saveChanges = async (event) => {
        let check = /^(?=.*[a-zA-Z])[a-zA-Z0-9.\- _]{1,}$/
        let good = true

        event.preventDefault()

        if (!check.test(this.state.currentProjectName)) {
            good = good && false
            this.setState({
                changeSuc: false,
                changeErr: true,
                changeErrData: 'Invalid characters. Accepted characters: a-z, A-Z, 0-9, ".", "-", "_", " ".',
                dangerProjectName: 'has-danger'
            })
        }
        if (!check.test(this.state.currentProjectDetails)) {
            good = good && false
            this.setState({
                changeSuc: false,
                changeErr: true,
                changeErrData: 'Invalid characters. Accepted characters: a-z, A-Z, 0-9, ".", "-", "_", " ".',
                dangerProjectDetails: 'has-danger'
            })
        }
        if (!check.test(this.state.currentClient)) {
            good = good && false
            this.setState({
                changeSuc: false,
                changeErr: true,
                changeErrData: 'Invalid characters. Accepted characters: a-z, A-Z, 0-9, ".", "-", "_", " ".',
                dangerClient: 'has-danger'
            })
        }
        if (good) {
            let payload = {
                projectId: this.state.currentProjectId,
                projectName: this.state.currentProjectName,
                projectDetails: this.state.currentProjectDetails,
                client: this.state.currentClient,
                isActive: this.state.currentIsActive ? 1 : 0,
            }

            if (this.state.modal.title === 'Change Project Info') {
                await ProjectService.getProjectInfo(payload.projectId).then(async result => {
                    if (payload.projectName !== result.project_name || payload.projectDetails !== result.project_details || payload.client !== result.client || payload.isActive !== result.is_active) {
                        await ProjectService.updateProjectInfo(payload).then(async result => {
                            if (result) {
                                this.setState({
                                    changeSuc: true,
                                    changeErr: false,
                                    changeErrData: '',
                                    dangerProjectDetails: 'has-success',
                                    dangerProjectName: 'has-success',
                                    dangerClient: 'has-success'
                                })
                                setTimeout(() => {
                                    this.setState({
                                        changeSuc: false,
                                        changeErr: false,
                                        changeErrData: '',
                                        dangerProjectDetails: '',
                                        dangerProjectName: '',
                                        dangerClient: ''
                                    })
                                }, 2000)
                            }
                        }).catch(e => {
                            this.setState({
                                changeSuc: false,
                                changeErr: true,
                                changeErrData: 'Error updating project info.',
                                dangerProjectDetails: 'has-danger',
                                dangerProjectName: 'has-danger',
                                dangerClient: 'has-danger'
                            })
                        })
                    }
                })
            } else {
                await ProjectService.addProject(payload).then(res => {
                    this.setState({ currentProjectId: res.projectId })
                }).catch(e => {
                    this.setState({
                        changeSuc: false,
                        changeErr: true,
                        changeErrData: 'Error adding project.',
                        dangerProjectDetails: 'has-danger',
                        dangerProjectName: 'has-danger',
                        dangerClient: 'has-danger'
                    })
                })
            }

            await ProjectService.getUsersFromProject(this.state.currentProjectId).then(async result => {
                let dbUsers = [], usrDel = [], usrAdd = []
                if (this.state.currentUsers === null)
                    this.setState({
                        currentUsers: []
                    })

                // get all users from db linked to current project
                result.forEach(r => {
                    if (r.user_id !== 1)
                        dbUsers.push({
                            label: r.first_name[0].toUpperCase() + r.first_name.slice(1) + ' ' + r.last_name[0].toUpperCase() + r.last_name.slice(1) + ' ( ' + r.username + ' ) ',
                            value: r.user_id
                        })
                })

                // find user links to be deleted
                if (dbUsers.length > 0)
                    dbUsers.forEach(r => {
                        let found
                        found = this.state.currentUsers.some(el => (el.value === r.value && el.label === r.label))
                        if (!found && r.value !== 1)
                            usrDel.push(r)
                    })

                // find user links to be added
                if (this.state.currentUsers.length > 0)
                    this.state.currentUsers.forEach(r => {
                        let found
                        found = dbUsers.some(el => (el.value === r.value && el.label === r.label))
                        if (!found && r.value !== 1)
                            usrAdd.push(r)
                    })

                // delete user project links
                usrDel.forEach(async r => {
                    payload = {
                        userId: r.value,
                        projectId: this.state.currentProjectId
                    }
                    await UserService.deleteUserProjectLink(payload)
                })

                // add user project links
                usrAdd.forEach(async r => {
                    payload = {
                        userId: r.value,
                        projectId: this.state.currentProjectId
                    }
                    await UserService.addUserProjectLink(payload)
                })
            })

            this.setState({
                changeSuc: true,
                changeErr: false,
                changeErrData: '',
                dangerProjectDetails: 'has-success',
                dangerProjectName: 'has-success',
                dangerClient: 'has-success'
            })

            this.triggerReRender();
        }
    }

    triggerReRender = async () => {
        this.setState({
            projects: []
        })
        this.componentDidMount()
    }

    handleUserChange = selectedRow => {
        this.setState({
            currentUsers: selectedRow
        })
    }

    deleteProjects = async projectIds => {
        const confirmationText = 'Are you sure you wish to delete'
        if (window.confirm(`${confirmationText} ${projectIds.length === 1 ? 'this item?' : 'these items?'}`))
            await ProjectService.deleteProject(projectIds)
        this.triggerReRender();
    }

    render() {
        return (
            <>
                <Header />
                <div style={page}><br />
                    <div style={tableContainer} >
                        <div style={{ textAlign: 'right' }} className="mt-4">
                            <h2>PROJECT MANAGEMENT</h2>
                        </div><br />
                        <br />
                        <CustomTable data={this.state.projects} columns={this.columns} addButton={'Add project'} deleteButton={'Delete project(s)'} searchBox handleDelete={this.deleteProjects} handleModalOpen={this.triggerModal} />
                    </div>
                </div>

                <Modal
                    className="modal-dialog-centered"
                    isOpen={this.state.modal.active}
                    toggle={() => this.toggleModal()}
                    style={{ width: "40%" }}
                >
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            {this.state.modal.title}
                        </h5>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => this.toggleModal()}
                        >
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        {this.state.modal.title === 'Change Project Info' && this.state.currentProjectName}
                        {/* change info */}
                        <Form onSubmit={this.saveChanges}>
                            {this.state.modal.title === 'Change Project Info' && <hr className="my-3"></hr>}
                            <div className="pl-lg-4">
                                <Row>
                                    <Col lg="6">
                                        <FormGroup className={this.state.dangerProjectName}>
                                            <label
                                                className="form-control-label"
                                                htmlFor="input-username"
                                            >
                                                Project Name
                            </label>
                                            <Input
                                                className="form-control-alternative"
                                                defaultValue={this.state.currentProjectName}
                                                id="input-username"
                                                onChange={(e) => this.setState({ currentProjectName: e.target.value })}
                                                placeholder="Project Name"
                                                type="text"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg="6">
                                        <FormGroup className={this.state.dangerProjectDetails}>
                                            <label
                                                className="form-control-label"
                                                htmlFor="input-username"
                                            >
                                                Project Details
                            </label>
                                            <Input
                                                className="form-control-alternative"
                                                id="input-text"
                                                defaultValue={this.state.currentProjectDetails}
                                                onChange={(e) => this.setState({ currentProjectDetails: e.target.value })}
                                                placeholder="Project details"
                                                type="text"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg="6">
                                        <FormGroup className={this.state.dangerClient}>
                                            <label
                                                className="form-control-label"
                                                htmlFor="input-first-name"
                                            >
                                                Client
                            </label>
                                            <Input
                                                className="form-control-alternative"
                                                defaultValue={this.state.currentClient}
                                                onChange={(e) => this.setState({ currentClient: e.target.value })}
                                                id="input-first-name"
                                                placeholder="First name"
                                                type="text"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg="6">
                                        <FormGroup className={this.state.dangerIsActive}>
                                            <label
                                                className="form-control-label"
                                                htmlFor="input-is-active"
                                                style={{ marginTop: "20%", marginLeft: "30%" }}
                                            >
                                                <Input
                                                    className="form-control-alternative"
                                                    onChange={(e) => this.setState({ currentIsActive: e.target.checked })}
                                                    id="input-is-active"
                                                    placeholder="Is active"
                                                    type="checkbox"
                                                    checked={this.state.currentIsActive}
                                                />
                                                Is Active
                                            </label>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
                        {/* add users */}
                        <div style={{ width: "100%" }}>
                            <hr className="my-3"></hr>
                            <div className="form-control-label" style={{ marginLeft: '10px' }}>Users: </div>
                            <Select options={this.state.usersArr} defaultValue={this.state.currentUsers} onChange={this.handleUserChange} isMulti closeMenuOnSelect={false} components={animatedComponents} />
                        </div>


                        {/* alerts */}
                        <div style={{ marginTop: "20px" }}>
                            {this.state.changeErr && <Alert color="danger">{this.state.changeErrData}</Alert>}
                            {this.state.changeSuc && <Alert color="success">Changes saved successfully!</Alert>}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <Button
                            color="success"
                            data-dismiss="modal"
                            type="button"
                            onClick={e => this.saveChanges(e)}
                        >
                            Save changes
                             </Button>
                        <Button
                            color="secondary"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => this.toggleModal()}
                        >
                            Close
                             </Button>

                    </div>
                </Modal>
            </>
        )
    }
}

// styles

const tableContainer = {
    marginLeft: '5%',
    marginRight: '5%',
    color: 'black'
}

const page = {
    minHeight: '82vh'
}

export default Projects;
