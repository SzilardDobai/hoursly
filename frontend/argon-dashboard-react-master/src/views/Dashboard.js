/*!

=========================================================
* Argon Dashboard React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import '../assets/css/custom-style.css';

import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Modal,
    FormGroup,
    Form,
    Input,
    Container,
    Row,
    Col,
    UncontrolledTooltip,
    InputGroup,
    InputGroupText,
    InputGroupAddon,
    Alert
} from "reactstrap";

import UserHeader from "components/Headers/UserHeader.js";
import ProjectService from '../services/projectServices.js';
import UserService from "../services/userServices.js";

class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projects: [],
      isUser: sessionStorage.getItem('role') === 'admin' ? false : true,
      modalShowing: false,
      change_profile_picture: false,
      change_password: false,
      oldPassword: '',
      newPassword1: '',
      newPassword2: '',
      changeSuc: false,
      changeErr: false,
      changeErrData: '',
      dangerOldPassword: '',
      dangerNewPassword1: '',
      dangerNewPassword2: ''
    }

    this.getProjects(1);

    if (sessionStorage.getItem('role') === 'admin')
      this.getProjects(0);
  }

  getProjects = async (state) => {
    const ds = ProjectService.getProjects(sessionStorage.getItem('user_id')).then(result => result);
    await Promise.all([ds]).then((response) => {
      let prj_arr = response[0];
      let prj_card = [];
      for (var i in prj_arr) {
        if (prj_arr[i].isactive === state) {
          prj_card.push(<li id={"prj_id_" + prj_arr[i].project_id} key={"prj_id_li_" + prj_arr[i].project_id}>{prj_arr[i].project_name}</li>)
          prj_card.push(<UncontrolledTooltip className="tooltip" delay={{ show: 100, hide: 100 }} placement="left" target={"prj_id_" + prj_arr[i].project_id} key={"prj_id_ut_" + prj_arr[i].project_id}>
            <div className="tooltip-inner-text">
              Details: {prj_arr[i].project_details} <br />
              Client: {prj_arr[i].client}
            </div>
          </UncontrolledTooltip>)
        }
      }

      if (state === 1) {
        this.setState({
          projects: [null, prj_card]
        })
      }
      else {
        this.setState({
          projects: [prj_card, this.state.projects[1]]
        })
      }
    })
  }

  changePassword = async (event) => {
    const hashCode = function (s) {
      return s.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    }

    let passwordCheck = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#\$%\^&*()_+\-=.<>\|\[\]\{\}?])[a-zA-Z0-9!@#\$%\^&*()_+\-=.<>\|\[\]\{\}?]{8,}$/
    let oldPassword = this.state.oldPassword
    let newPassword1 = this.state.newPassword1
    let newPassword2 = this.state.newPassword2

    event.preventDefault();

    if (newPassword1 === '' || newPassword2 === '' || oldPassword === '') {
      this.setState({
        changeSuc: false,
        changeErr: true,
        changeErrData: 'Field cannot be empty!'
      })
      if (oldPassword === '')
        this.setState({
          dangerOldPassword: 'has-danger'
        })
      if (newPassword1 === '')
        this.setState({
          dangerNewPassword1: 'has-danger'
        })
      if (newPassword2 === '')
        this.setState({
          dangerNewPassword2: 'has-danger'
        })
    } else if (newPassword1 !== newPassword2) {
      this.setState({
        changeSuc: false,
        changeErr: true,
        changeErrData: 'Passwords do not match!',
        dangerOldPassword: '',
        dangerNewPassword1: 'has-danger',
        dangerNewPassword2: 'has-danger'
      })
    } else if (!passwordCheck.test(newPassword1)) {
      this.setState({
        changeSuc: false,
        changeErr: true,
        changeErrData: <>Password must contain at least:<li>one lowercase letter (a-z)</li><li>one uppercase letter (A-Z)</li><li>one digit (0-9)</li><li id="special_characters">one special character</li><UncontrolledTooltip className="tooltip" delay={{ show: 100, hide: 100 }} placement="bottom" target={"special_characters"} key={"special_characters"}>{"~!@#\$%\^&*()_+\-=.<>\|\[\]\{\}?"}</UncontrolledTooltip><li>8 characters</li></>,
        dangerOldPassword: '',
        dangerNewPassword1: 'has-danger',
        dangerNewPassword2: 'has-danger'
      })
    } else if (oldPassword === newPassword1) {
      this.setState({
        changeSuc: false,
        changeErr: true,
        changeErrData: 'New password must be different from old password!',
        dangerOldPassword: 'has-danger',
        dangerNewPassword1: 'has-danger',
        dangerNewPassword2: 'has-danger'
      })
    } else {
      let payload = {
        user_id: sessionStorage.getItem("user_id"),
        old_password: hashCode(oldPassword),
        password: hashCode(newPassword1)
      }

    let res = await UserService.changePassword(payload)
    
    if (res[0] && res[1]) {
        this.setState({
        changeSuc: true,
        changeErr: false,
        changeErrData: '',
        dangerOldPassword: 'has-success',
        dangerNewPassword1: 'has-success',
        dangerNewPassword2: 'has-success'
        })
        setTimeout(() => { this.toggleModal("change_password") }, 2000)
    } else if (res[0] === false) {
        this.setState({
        changeSuc: false,
        changeErr: true,
        changeErrData: 'Old password incorrect!',
        dangerOldPassword: 'has-danger',
        dangerNewPassword1: '',
        dangerNewPassword2: ''
        })
    } else if (res[1] === false) {
        this.setState({
        changeSuc: false,
        changeErr: true,
        changeErrData: 'Error changing password!',
        dangerOldPassword: 'has-danger',
        dangerNewPassword1: 'has-danger',
        dangerNewPassword2: 'has-danger'
        })
    }
    
    }
  }
  
  toggleModal = state => {
    this.setState({
      [state]: !this.state[state],
      changeErrData: '',
      changeErr: false,
      changeSuc: false,
      changeErrData: '',
      dangerOldPassword: '',
      dangerNewPassword1: '',
      dangerNewPassword2: ''
    });
  }
  

  render() {
    return (
      <>
        <UserHeader />

        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-1" xl="8">
                <div style={{ paddingBottom: "20px" }}>
                    <Button
                        color="default"
                        onClick={this.toggleModal.bind(this, "change_password")}
                    >
                        Change Password
                    </Button>
                </div>
              <Card>
                <CardBody className="active-projects">
                  <h3 className="mb-0">Active projects</h3>
                  <ul>
                    {this.state.projects[1]}
                  </ul>
                </CardBody>
              </Card>
              {!this.state.isUser &&
                <Card>
                  <CardBody className="inactive-projects">
                    <h3 className="mb-0">Inactive projects</h3>
                    <ul>
                      {this.state.projects[0]}
                    </ul>
                  </CardBody>
                </Card>
              }
              {this.state.isUser &&
                <Card className="bg-secondary shadow">
                  <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                      <Col xs="8">
                        <h3 className="mb-0">My account</h3>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <Form>
                      <div className="pl-lg-4">
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
                                defaultValue={sessionStorage.getItem('username')}
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
                                placeholder={sessionStorage.getItem('username') + '@hoursly.com'}
                                disabled
                                type="email"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-first-name"
                              >
                                First name
                            </label>
                              <Input
                                className="form-control-alternative"
                                defaultValue={sessionStorage.getItem('first_name')}
                                disabled
                                id="input-first-name"
                                placeholder="First name"
                                type="text"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-last-name"
                              >
                                Last name
                            </label>
                              <Input
                                className="form-control-alternative"
                                defaultValue={sessionStorage.getItem('last_name')}
                                disabled
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
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-dep"
                              >
                                Department
                            </label>
                              <Input
                                className="form-control-alternative"
                                defaultValue={sessionStorage.getItem('department')}
                                disabled
                                id="input-dep"
                                placeholder="Department"
                                type="text"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-Position"
                              >
                                Position
                            </label>
                              <Input
                                className="form-control-alternative"
                                defaultValue={sessionStorage.getItem('position')}
                                disabled
                                id="input-position"
                                placeholder="Position"
                                type="text"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              }
            </Col>
          </Row>
        </Container>

        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.change_password}
          toggle={() => this.toggleModal("change_password")}
          style={{ width: "40%" }}
        >
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Change Password
                  </h5>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => this.toggleModal("change_password")}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <div className="px-lg-5 py-lg-4">
            <Form role="form" onSubmit={this.changePassword}>
              <FormGroup className="mb-3" className={this.state.dangerOldPassword}>
                <InputGroup className={"input-group-alternative" + this.state.dangerOldPassword}>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-key-25" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder="Old Password" type="password" onChange={(e) => this.setState({ oldPassword: e.target.value })} />
                </InputGroup>
              </FormGroup>
              <FormGroup className={this.state.dangerNewPassword1}>
                <InputGroup className={"input-group-alternative" + this.state.dangerNewPassword1}>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder="New Password" type="password" onChange={(e) => this.setState({ newPassword1: e.target.value })} />
                </InputGroup>
              </FormGroup>
              <FormGroup className={this.state.dangerNewPassword2}>
                <InputGroup className={"input-group-alternative" + this.state.dangerNewPassword2}>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder="Confirm Password" type="password" onChange={(e) => this.setState({ newPassword2: e.target.value })} />
                </InputGroup>
              </FormGroup>
              <div className="text-center">
                <Button className="my-4" color="success" type="submit">
                  Change Password
                  </Button>
              </div>
              {this.state.changeErr && <Alert color="danger">{this.state.changeErrData}</Alert>}
              {this.state.changeSuc && <Alert color="success">Password changed successfully!</Alert>}
            </Form>
          </div>
        </Modal>

      </>
    )
  }

} export default Profile;
