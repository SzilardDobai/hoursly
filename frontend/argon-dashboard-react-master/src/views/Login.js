/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import UserService from '../services/userServices.js';

// reactstrap components
import {
  Alert,
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  UncontrolledTooltip,
  Col
} from "reactstrap";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loginSuc: false,
      loginErr: false,
      loginErrData: '',
      dangerUsername: '',
      dangerPassword: ''
    };
  }

  login = async (event) => {
    let username = this.state.username
    let password = this.state.password
    let passwordCheck = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=.<>|[\]{}?])[a-zA-Z0-9!@#$%^&*()_+\-=.<>|[\]{}?]{8,}$/
    let usernameCheck = /^(?=.*[a-z])[a-z0-9.]{1,}$/

    const hashCode = function (s) {
      return s.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    }

    const bufferToBase64 = function (buf) {
      var binstr = Array.prototype.map.call(buf, function (ch) {
        return String.fromCharCode(ch);
      }).join('');
      return btoa(binstr);
    }
   
    event.preventDefault();

    if (username === '' || password === '') {
      this.setState({
        loginSuc: false,
        loginErr: true,
        loginErrData: 'Field cannot be empty!',
        dangerUsername: 'has-danger',
        dangerPassword: 'has-danger',
      })
    } else if (!usernameCheck.test(username) && username !== 'admin') {
      this.setState({
        loginSuc: false,
        loginErr: true,
        loginErrData: 'Invalid username. Allowed characters: a-z, 0-9, ".".',
        dangerUsername: 'has-danger',
        dangerPassword: '',
      })
    } else if (!passwordCheck.test(password) && password !== 'admin') {
      this.setState({
        loginSuc: false,
        loginErr: true,
        loginErrData: <>Invalid password. Allowed characters: a-z, A-Z, 0-9 and <strong id="specialCharactersTooltip">special characters</strong>!<UncontrolledTooltip className="tooltip" delay={{ show: 100, hide: 100 }} placement="bottom" target="specialCharactersTooltip" key={"special_characters"}>{"~!@#$%^&*()_+-=.<>|[]{}?"}</UncontrolledTooltip></>,
        dangerUsername: '',
        dangerPassword: 'has-danger',
      })
    } else {
      password = hashCode(password)

      let payload = {
        username,
        password
      }

      const authPromise = UserService.auth(payload).then(result => result)
      await Promise.all([authPromise]).then(auth => {
        auth = auth[0]['auth']
        for (var key in auth) {
          if (key === 'picture') {
            if (auth.picture === null)
              sessionStorage.setItem('picture', null)
            else
              sessionStorage.setItem('picture', bufferToBase64(auth.picture.data))
          } else if (key === 'role_id') {
            if(auth.role_id === 1)
              sessionStorage.setItem('role', 'admin')
            else
              sessionStorage.setItem('role', 'user')
          } else {
            sessionStorage.setItem(key, auth[key])
          }
        }
    
        this.setState({
          loginSuc: true,
          loginErr: false,
          loginErrData: '',
          dangerUsername: 'has-success',
          dangerPassword: 'has-success',
        })

        setTimeout(() => { this.props.history.push("/user/dashboard") }, 1000)
      })
    }
  }

  onFormSubmit = (e) => {
    this.login(this.state.username, this.state.password)
  }

  render() {
    return (
      <>
        <Col>
          <div >
            <img src={require("../assets/img/in-app-pic.jpg")} width="100%" alt="generic_user_photo"/>
            <p></p>
          </div>
        </Col>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-4">
              <div className="text-center text-muted mb-4">
                <small>Sign in with credentials</small>
              </div>
              <Form role="form" onSubmit={this.login}>
                <FormGroup className="mb-3">
                  <InputGroup className={"input-group-alternative"+this.state.dangerUsername}>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="User Name" type="username" onChange={(e) => this.setState({ username: e.target.value })} />
                  </InputGroup>
                </FormGroup>
                <FormGroup className={this.state.dangerPassword}>
                  <InputGroup className={"input-group-alternative"+this.state.dangerPassword}>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Password" type="password" onChange={(e) => this.setState({ password: e.target.value })} />
                  </InputGroup>
                </FormGroup>
                <div className="text-center">
                  <Button className="my-4" color="primary" type="submit" >
                    Sign in
                  </Button>
                </div>
                {this.state.loginErr && <Alert color="danger">{this.state.loginErrData}</Alert>}
                {this.state.loginSuc && <Alert color="success">Login successful!</Alert>}
              </Form>
            </CardBody>
          </Card>
        </Col>
      </>
    );
  }
}

export default Login;
