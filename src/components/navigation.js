import React, { useEffect } from "react";
import { Navbar, Nav, Container, Form, Button, ButtonGroup } from 'react-bootstrap'
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state/index";
import { Link, useNavigate } from 'react-router-dom'

function Navigation() {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const history = useNavigate();
  const dispatch = useDispatch();
  const { handleLogin } = bindActionCreators(
    actionCreators,
    dispatch
  );

  useEffect(() => {
    const user = localStorage.getItem('user');
    if(!user) {
      handleLogin(false);
    }
    else handleLogin(true);
  },[]);

  const handleOnClick = (e) => {
    if(isLoggedIn) {
      localStorage.removeItem('user');
      handleLogin(false);
      history('/login')
    }
  }

  const authButton = () => {
    //const currentUser = localStorage.getItem('user');
    if (!isLoggedIn) {
        return (
            <ButtonGroup>
                <Button variant="secondary" as={Link} to="/login">Login</Button>
            </ButtonGroup>
        )
            
    } else {
        return <Button variant="secondary" onClick={handleOnClick}>Logout</Button>
    }
}

  return (
    <Navbar bg="light" variant="light" className="border-bottom" sticky="top">
      <Container className="col-sm">
        <Navbar.Brand>
          <NavLink to="/" className="text-decoration-none text-black">GetHired</NavLink>
        </Navbar.Brand>
      </Container>
      <Container className = "col-sm-auto">
      <Form inline className="mx-3">
                {authButton()}
            </Form>
      </Container>
    </Navbar>
  );
}

export default Navigation;