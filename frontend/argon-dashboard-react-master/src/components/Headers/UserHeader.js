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

// reactstrap components
import { Container, Row, Col } from "reactstrap";


class UserHeader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      imgComp: (sessionStorage.getItem('picture') === 'null' || sessionStorage.getItem('picture') === null || sessionStorage.getItem('picture') === '') ? (
        <img
          alt="..."
          className="rounded-circle"
          src={require('../../assets/img/generic_profile_picture.jpeg')}
        />
      ) : (<img
        alt="..."
        className="rounded-circle"
        src={`data:image/jpeg;base64,${sessionStorage.getItem('picture')}`}
      />),
    }
  }

  render() {
    return (
      <>
        <div
          className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
          style={{
            minHeight: "600px",
            backgroundSize: "cover",
            backgroundPosition: "center top"
          }}
        >
          {/* Mask */}
          <span className="mask bg-gradient-info opacity-10" />
          {/* Header container */}
          <Container className="d-flex align-items-center" fluid>
            <Row>
              <Col lg="9" md="10">
                <h1 className="display-2 text-white">Hello, {sessionStorage.getItem('first_name')[0].toUpperCase() + sessionStorage.getItem('first_name').slice(1)}!</h1>
                { sessionStorage.getItem('role') === 'user' ? 
                    <p className="text-white mt-0 mb-5">
                      This is your profile page. Here you can track your currently assigned projects, as well as update your user information.
                    </p> 
                  :
                    <p className="text-white mt-0 mb-5">
                      This is your profile page. Here you can keep track of all active and inactive projects.
                    </p> 
                }
              </Col>
              <Col>
                <br /><br />
                <div className="card-profile-image">
                  {this.state.imgComp}
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default UserHeader;
