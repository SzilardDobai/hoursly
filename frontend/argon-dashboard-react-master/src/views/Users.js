import React from "react";
import UserService from '../services/userServices.js';
import ProjectService from "../services/projectServices.js";
import Header from "../components/Headers/Header.js";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import {
    Alert,
    Button,
    Modal,
    FormGroup,
    Input,
    Col,
    Row,
    Form,
    Spinner
} from "reactstrap";

import Select from 'react-select'
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const bufferToBase64 = function (buf) {
    var binstr = Array.prototype.map.call(buf, function (ch) {
        return String.fromCharCode(ch);
    }).join('');
    return btoa(binstr);
}

const pictureFormatter = cell => {
    return ((cell === 'null' || cell === null || cell === '') ? (
        <img
            alt="..."
            height="20rem"
            className="rounded-circle"
            src={require('../assets/img/generic_profile_picture.jpeg')}
        />
    ) : (<img
        alt="..."
        height="20rem"
        className="rounded-circle"
        src={`data:image/jpeg;base64,${bufferToBase64(cell.data)}`}
    />))
}

const { SearchBar, ClearSearchButton } = Search;

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: { active: false, title: '' },
            profilePicture: '',
            currentUser: '',
            currentUsername: '',
            currentFirstName: '',
            currentLastName: '',
            currentDepartment: '',
            currentPosition: '',
            currentRole: {},
            dangerFirstName: '',
            dangerLastName: '',
            dangerPosition: '',
            dangerDepartment: '',
            changeSuc: false,
            changeErr: false,
            changeErrData: '',
            rolesArr: [],
            projectsArr: [],
            currentProjects: [],
            users: []
        };
    }

    selectRowProps = {
        mode: 'checkbox',
        clickToSelect: true,
        bgColor: '#64fccc',
        headerColumnStyle: {backgroundColor: 'white'},
        nonSelectable: [1]
    }

    NoDataIndication = () => (
        <div align={'center'}>
            <Spinner animation="border" role="status">
                {'Loading...'}
            </Spinner>
        </div>
    );

    rowEvents = {
        onDoubleClick: (e, row, rowIndex) => {
            if (rowIndex !== 0)
                this.triggerModal(row)
        }
    }

    columns = [{
        dataField: 'user_id',
        text: 'ID',
        sort: true,
        hidden: true,
        headerAlign: 'center',
        headerStyle: { fontWeight: 'bold', backgroundColor: 'white' }
    }, {
        dataField: 'username',
        text: 'username',
        sort: true,
        headerAlign: 'center',
        headerStyle: { fontWeight: 'bold', backgroundColor: 'white' }
    }, {
        dataField: 'first_name',
        text: 'First Name',
        sort: true,
        headerAlign: 'center',
        headerStyle: { fontWeight: 'bold', backgroundColor: 'white' }
    }, {
        dataField: 'last_name',
        text: 'Last Name',
        sort: true,
        headerAlign: 'center',
        headerStyle: { fontWeight: 'bold', backgroundColor: 'white' }
    }, {
        dataField: 'department',
        text: 'Department',
        sort: true,
        headerAlign: 'center',
        headerStyle: { fontWeight: 'bold', backgroundColor: 'white' }
    }, {
        dataField: 'position',
        text: 'Position',
        sort: true,
        headerAlign: 'center',
        headerStyle: { fontWeight: 'bold', backgroundColor: 'white' }
    }, {
        dataField: 'picture',
        text: 'Profile Picture',
        formatter: pictureFormatter,
        headerAlign: 'center',
        align: 'center',
        headerStyle: { fontWeight: 'bold', backgroundColor: 'white' }
    }]

    componentDidMount = async () => {
        const ds = UserService.getUsers().then(result => result);
        await Promise.all([ds]).then((response) => {
            this.setState({
                users: response[0]
            })
        })
    }

    triggerModal = async (row) => {
        if (!row) {
            let rolesArr = []
            let projectsArr = []

            await UserService.getRoles().then(res => {
                res.forEach(r => {
                    rolesArr.push({
                        label: r.rolename,
                        value: r.role_id
                    })
                })
            })

            await ProjectService.getProjects(1).then(res => {
                res.forEach(r => {
                    if (r.isactive === 1)
                        projectsArr.push({
                            label: r.project_name,
                            value: r.project_id
                        })
                })
            })

            this.setState({
                profilePicture: '',
                currentUser: '',
                currentUsername: '',
                currentFirstName: '',
                currentLastName: '',
                currentDepartment: '',
                currentPosition: '',
                currentRole: '',
                currentProjects: [],
                currentUserId: '',
                dangerFirstName: '',
                dangerLastName: '',
                dangerPosition: '',
                dangerDepartment: '',
                changeSuc: false,
                changeErr: false,
                changeErrData: '',
                rolesArr: rolesArr,
                projectsArr: projectsArr
            })

            this.toggleModal("Add User")
        }
        else {
            let currentRole
            let rolesArr = []
            let currentProjectsArr = []
            let projectsArr = []

            await UserService.getUserRole(row.user_id).then(res => {
                currentRole = { value: res.role_id, label: res.rolename }
            })

            await UserService.getRoles().then(res => {
                res.forEach(r => {
                    rolesArr.push({
                        label: r.rolename,
                        value: r.role_id
                    })
                })
            })

            await ProjectService.getProjects(row.user_id).then(res => {
                res.forEach(r => {
                    if (r.isactive === 1)
                        currentProjectsArr.push({
                            label: r.project_name,
                            value: r.project_id
                        })
                })
            })

            await ProjectService.getProjects(1).then(res => {
                res.forEach(r => {
                    if (r.isactive === 1)
                        projectsArr.push({
                            label: r.project_name,
                            value: r.project_id
                        })
                })
            })

            this.setState({
                profilePicture: (row.picture === 'null' || row.picture === null || row.picture === '') ? (
                    <img
                        alt="..."
                        height="200rem"
                        className="rounded-circle"
                        src={require('../assets/img/generic_profile_picture.jpeg')}
                    />
                ) : (<img
                    alt="..."
                    height="200rem"
                    className="rounded-circle"
                    src={`data:image/jpeg;base64,${bufferToBase64(row.picture.data)}`}
                />),
                currentUser: row.first_name[0].toUpperCase() + row.first_name.slice(1) + ' ' + row.last_name[0].toUpperCase() + row.last_name.slice(1),
                currentDepartment: row.department,
                currentPosition: row.position,
                currentFirstName: row.first_name,
                currentLastName: row.last_name,
                currentUsername: row.username,
                currentRole: currentRole,
                currentProjects: currentProjectsArr,
                currentUserId: row.user_id,
                dangerFirstName: '',
                dangerLastName: '',
                dangerPosition: '',
                dangerDepartment: '',
                changeSuc: false,
                changeErr: false,
                changeErrData: '',
                rolesArr: rolesArr,
                projectsArr: projectsArr
            })

            this.toggleModal("Change User Info")
        }
    }

    toggleModal = modalTitle => {
        this.setState({
            modal: { active: !this.state.modal.active, title: modalTitle }
        });
    };

    saveChanges = async (event) => {
        let check = /^(?=.*[a-z])[a-zA-Z0-9.\- ]{1,}$/
        let good = true
        let payload

        event.preventDefault()

        if (!check.test(this.state.currentFirstName)) {
            good = good && false
            this.setState({
                changeSuc: false,
                changeErr: true,
                changeErrData: 'Invalid characters. Accepted characters: a-z, A-Z, 0-9, ".", "-".',
                dangerFirstName: 'has-danger'
            })
        }
        if (!check.test(this.state.currentLastName)) {
            good = good && false
            this.setState({
                changeSuc: false,
                changeErr: true,
                changeErrData: 'Invalid characters. Accepted characters: a-z, A-Z, 0-9, ".", "-".',
                dangerLastName: 'has-danger'
            })
        }
        if (!check.test(this.state.currentPosition)) {
            good = good && false
            this.setState({
                changeSuc: false,
                changeErr: true,
                changeErrData: 'Invalid characters. Accepted characters: a-z, A-Z, 0-9, ".", "-".',
                dangerPosition: 'has-danger'
            })
        }
        if (!check.test(this.state.currentDepartment)) {
            good = good && false
            this.setState({
                changeSuc: false,
                changeErr: true,
                changeErrData: 'Invalid characters. Accepted characters: a-z, A-Z, 0-9, ".", "-".',
                dangerDepartment: 'has-danger'
            })
        }

        if (good) {
            payload = {
                userId: this.state.currentUserId,
                username: this.state.currentUsername,
                firstName: this.state.currentFirstName,
                lastName: this.state.currentLastName,
                position: this.state.currentPosition,
                department: this.state.currentDepartment
            }
            if (this.state.modal.title === 'Change User Info') {
                await UserService.getUserInfo(this.state.currentUserId).then(async result => {
                    if (payload.firstName !== result.first_name || payload.lastName !== result.last_name || payload.position !== result.position || payload.department !== result.department) {
                        await UserService.updateUserInfo(payload).then(async result => {
                            if (result) {
                                this.setState({
                                    changeSuc: true,
                                    changeErr: false,
                                    changeErrData: '',
                                    dangerDepartment: 'has-success',
                                    dangerPosition: 'has-success',
                                    dangerFirstName: 'has-success',
                                    dangerLastName: 'has-success',
                                })
                                setTimeout(() => {
                                    this.setState({
                                        dangerFirstName: '',
                                        dangerLastName: '',
                                        dangerPosition: '',
                                        dangerDepartment: '',
                                        changeSuc: false,
                                        changeErr: false,
                                        changeErrData: '',
                                    })
                                }, 2000)
                            }
                        }).catch(e => {
                            this.setState({
                                changeSuc: false,
                                changeErr: true,
                                changeErrData: 'Error updating user info.',
                                dangerDepartment: 'has-danger',
                                dangerPosition: 'has-danger',
                                dangerFirstName: 'has-danger',
                                dangerLastName: 'has-danger',
                            })
                        })
                    }
                })
            } else {
                await UserService.addUser(payload).then(res => {
                    this.setState({ currentUserId: res.userId })
                })
            }
        }

        payload = {
            userId: this.state.currentUserId,
            roleId: this.state.currentRole.value
        }

        if (this.state.modal.title === 'Change User Info') {
            await UserService.updateUserRole(payload).then(async result => {
                if (!result) {
                    this.setState({
                        changeSuc: false,
                        changeErr: true,
                        changeErrData: 'Error updating user role.',
                        dangerDepartment: 'has-danger',
                        dangerPosition: 'has-danger',
                        dangerFirstName: 'has-danger',
                        dangerLastName: 'has-danger',
                    })
                }
            })
        }

        await ProjectService.getProjects(this.state.currentUserId).then(async result => {
            let dbProjects = [], prjDel = [], prjAdd = []
            if (this.state.currentProjects === null)
                this.setState({
                    currentProjects: []
                })

            // get all projects from db linked to current user
            if (result.length > 0) {
                result.forEach(r => {
                    if (r.isactive === 1)
                        dbProjects.push({
                            value: r.project_id,
                            label: r.project_name
                        })
                })
            }

            //  find project links to be deleted
            if (dbProjects.length > 0)
                dbProjects.forEach(r => {
                    let found
                    found = this.state.currentProjects.some(el => (el.value === r.value && el.label === r.label))
                    if (!found)
                        prjDel.push(r)
                })

            // find project links to be added
            if (this.state.currentProjects.length > 0)
                this.state.currentProjects.forEach(r => {
                    let found
                    found = dbProjects.some(el => (el.value === r.value && el.label === r.label))
                    if (!found)
                        prjAdd.push(r)
                })

            // delete user project links
            prjDel.forEach(async r => {
                payload = {
                    userId: this.state.currentUserId,
                    projectId: r.value
                }
                await UserService.deleteUserProjectLink(payload)
            })

            // add user project links
            prjAdd.forEach(async r => {
                payload = {
                    userId: this.state.currentUserId,
                    projectId: r.value
                }
                await UserService.addUserProjectLink(payload)
            })
        })

        this.setState({
            changeSuc: true,
            changeErr: false,
            changeErrData: '',
            dangerDepartment: 'has-success',
            dangerPosition: 'has-success',
            dangerFirstName: 'has-success',
            dangerLastName: 'has-success',
        })
        this.triggerReRender();
    }

    triggerReRender = async () => {
        this.setState({
            users: []
        })
        this.componentDidMount()
    }

    handleRoleChange = selectedRow => {
        this.setState({
            currentRole: selectedRow
        })
    }

    handleProjectChange = selectedRow => {
        this.setState({
            currentProjects: selectedRow
        })
    }

    deleteUsers = async userIds => {
        const confirmationText = 'Are you sure you wish to delete'
        if (window.confirm(`${confirmationText} ${userIds.length === 1 ? 'this item?' : 'these items?'}`))
            await UserService.deleteUser(userIds)
        this.triggerReRender();
    }

    render() {
        return (
            <>
                <Header />
                <div style={page}><br />
                    <div style={tableContainer} >
                        <div style={{ textAlign: 'right' }} className="mt-4">
                            <h2>USER MANAGEMENT</h2>
                        </div><br />
                        <br />
                        <div>
                            <ToolkitProvider
                                keyField='user_id'
                                data={this.state.users}
                                columns={this.columns}
                                search
                            >
                                {
                                    props => (
                                        <div>
                                            <div style={{ textAlign: 'left' }}>
                                                <Button color="success" size="sm" type="button" onClick={() => this.triggerModal(null)}>{'Add user'}</Button>
                                                <Button color="danger" size="sm" type="button" onClick={() => this.deleteUsers(this.node.selectionContext.selected)}>{'Delete user(s)'}</Button>
                                                <div style={{ float: 'right' }}>
                                                    <SearchBar {...props.searchProps} style={{ maxHeight: 30, maxWidth: 250 }} /> {'\t'}
                                                    <ClearSearchButton {...props.searchProps} className={'btn btn-sm'} />
                                                </div>
                                            </div>
                                            <BootstrapTable
                                                rowStyle={{backgroundColor: 'white'}}
                                                hover
                                                ref={n => this.node = n}
                                                pagination={paginationFactory()}
                                                rowEvents={this.rowEvents}
                                                noDataIndication={() => <this.NoDataIndication />}
                                                selectRow={this.selectRowProps}
                                                {...props.baseProps}
                                            />
                                        </div>
                                    )
                                }
                            </ToolkitProvider>
                        </div><br />
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
                        {/* profile picture */}
                        {this.state.modal.title === 'Change User Info' && this.state.currentUser && this.state.profilePicture}
                        {/* change info */}
                        <Form onSubmit={this.saveChanges}>
                            {this.state.modal.title === 'Change User Info' && <hr className="my-3"></hr>}
                            <div className="pl-lg-4">
                                {this.state.modal.title === 'Change User Info' &&
                                    <Row>
                                        <Col lg="6">
                                            <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="input-username"
                                                >
                                                    Username
                            </label>
                                                <Input
                                                    className="form-control-alternative"
                                                    defaultValue={this.state.currentUsername}
                                                    disabled
                                                    id="input-username"
                                                    placeholder="Username"
                                                    type="text"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col lg="6">
                                            <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="input-email"
                                                >
                                                    Email address
                            </label>
                                                <Input
                                                    className="form-control-alternative"
                                                    id="input-email"
                                                    placeholder={this.state.currentUsername + "@hoursly.com"}
                                                    disabled
                                                    type="email"
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>}
                                <Row>
                                    <Col lg="6">
                                        <FormGroup className={this.state.dangerFirstName}>
                                            <label
                                                className="form-control-label"
                                                htmlFor="input-first-name"
                                            >
                                                First name
                            </label>
                                            <Input
                                                className="form-control-alternative"
                                                defaultValue={this.state.currentFirstName}
                                                onChange={(e) => this.setState({ currentFirstName: e.target.value })}
                                                id="input-first-name"
                                                placeholder="First name"
                                                type="text"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg="6">
                                        <FormGroup className={this.state.dangerLastName}>
                                            <label
                                                className="form-control-label"
                                                htmlFor="input-last-name"
                                            >
                                                Last name
                            </label>
                                            <Input
                                                className="form-control-alternative"
                                                defaultValue={this.state.currentLastName}
                                                onChange={(e) => this.setState({ currentLastName: e.target.value })}
                                                id="input-last-name"
                                                placeholder="Last name"
                                                type="text"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </div>
                            <div className="pl-lg-4">
                                <Row>
                                    <Col lg="6">
                                        <FormGroup className={this.state.dangerDepartment}>
                                            <label
                                                className="form-control-label"
                                                htmlFor="input-dep"
                                            >
                                                Department
                            </label>
                                            <Input
                                                className="form-control-alternative"
                                                defaultValue={this.state.currentDepartment}
                                                onChange={(e) => this.setState({ currentDepartment: e.target.value })}
                                                id="input-dep"
                                                placeholder="Department"
                                                type="text"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg="6">
                                        <FormGroup className={this.state.dangerPosition}>
                                            <label
                                                className="form-control-label"
                                                htmlFor="input-Position"
                                            >
                                                Position
                            </label>
                                            <Input
                                                className="form-control-alternative"
                                                defaultValue={this.state.currentPosition}
                                                onChange={(e) => this.setState({ currentPosition: e.target.value })}
                                                id="input-position"
                                                placeholder="Position"
                                                type="text"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
                        {/* add role */}
                        <div style={{ width: "100%" }}>
                            <hr className="my-3"></hr>
                            <div className="form-control-label" style={{ marginLeft: '10px' }}>Role: </div>
                            <Select options={this.state.rolesArr} defaultValue={this.state.currentRole} onChange={this.handleRoleChange} />
                        </div>

                        {/* add project */}
                        <div style={{ width: "100%" }}>
                            <hr className="my-3"></hr>
                            <div className="form-control-label" style={{ marginLeft: '10px' }}>Projects: </div>
                            <Select options={this.state.projectsArr} defaultValue={this.state.currentProjects} onChange={this.handleProjectChange} isMulti closeMenuOnSelect={false} components={animatedComponents} />
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

const tableContainer = {
    marginLeft: '5%',
    marginRight: '5%',
    color: 'black'
}

const page = {
    minHeight: '82vh'
}

export default Users;
