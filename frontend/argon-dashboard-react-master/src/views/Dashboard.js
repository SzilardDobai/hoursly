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
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

import UserHeader from "components/Headers/UserHeader.js";
import ProjectService from '../services/projectServices.js';

class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projects: [],
      isUser: sessionStorage.getItem('role') === 'admin' ? false : true
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

  render() {
    return (
      <>
        <UserHeader />

        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-1" xl="8">
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
      </>
    )
  }

} export default Profile;
