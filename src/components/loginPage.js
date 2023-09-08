import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../App.css'
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { useNavigate } from 'react-router-dom';
import { actionCreators } from "../state/index";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";


function LoginPage() {
    const [isLoginPage, setLoginPage] = useState(true);
    var loginEmail;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { manageProfile, manageFile, manageEducation, updateSkills,handleLogin } = bindActionCreators(
        actionCreators,
        dispatch
      );

    const changePage = () => {
        setLoginPage((prevState) => {
            return !prevState;
        });
    }

    const emailHandler = (e) => {
        loginEmail = e.target.value;
    }

    const handleLoginSubmit = (e) => {
    e.preventDefault();
    let user;
    fetch(
    "http://localhost:5000/user?email="+loginEmail, {
    method: "GET",
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    },})
        .then((res) => res.json())
        .then((json) => {
            console.log(json);
            manageProfile({
                firstName: json.firstName,
                lastName: json.lastName,
                email: json.email,
                location: json.location,
                contact: json.contact
                });
                if(json.profileImage)
                manageFile(json.profileImage);
                if(json.education)
                manageEducation(json.education)
                if(json.skills) 
                updateSkills(json.skills)
            localStorage.setItem('user', json._id);
            handleLogin(true);
            navigate('/');
        })
    }
    const handleSubmit = (userData) => {
        let user;
        var temp = userData;
        temp.contact = parseInt(temp.contact)
        fetch(
            "http://localhost:5000/user/createUser", {
            method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            body: JSON.stringify(temp)
            })
            .then((res) => res.json())
            .then((json) => {
                manageProfile({
                    userId: json._id,
                    firstName: json.firstName,
                    lastName: json.lastName,
                    email: json.email,
                    location: json.location,
                    contact: json.contact
                    });
                localStorage.setItem('user', json._id);
                user = json._id;
                handleLogin(true);
                navigate('/')
                              
        })
    }
    const SignupSchema = Yup.object().shape({
        firstName: Yup.string()
          .min(2, "Too Short!")
          .max(50, "Too Long!")
          .required("Required"),
        lastName: Yup.string()
          .min(2, "Too Short!")
          .max(50, "Too Long!")
          .required("Required"),
        email: Yup.string().email("Invalid email").required("Required"),
        contact: Yup.number().positive().integer().required('Required')
      });
    if(!isLoginPage)
    return (
        <div className="login-form">
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            contact:'',
          }}

          validationSchema={SignupSchema}
          onSubmit={(values, {setSubmitting}) => {
            handleSubmit(values);
            setSubmitting(false);
          }}
        >
          {props => (
            <Form onSubmit={props.handleSubmit}>
                <div style={{textAlign: "center"}}>
                    <h4> SignUp</h4>
                    <p> Already registered? <span onClick = {changePage} style={{color: "blue"}} >  Login </span></p>
                </div>
              <Form.Group className="mb-3">
                  <Form.Label> First Name</Form.Label>
                  <Form.Control type="text" name="firstName" size="sm" placeholder="First Name" value={props.values.firstName} onChange={props.handleChange}/>
              </Form.Group>
              <ErrorMessage name="firstName" render={msg => <div className="error-msg">{msg}</div>}/>
              <Form.Group className="mb-3">
                  <Form.Label> Last Name</Form.Label>
                  <Form.Control type="text" name="lastName" size="sm" placeholder="Last Name" value={props.values.lastName} onChange={props.handleChange}/>
              </Form.Group>
              <ErrorMessage name="lastName" render={msg => <div className="error-msg">{msg}</div>}/>
              <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" size="sm" placeholder="Email Address" value={props.values.email} onChange={props.handleChange}/>
              </Form.Group>
              <ErrorMessage name="email" render={msg => <div className="error-msg">{msg}</div>}/>
              <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="number" name="contact" size="sm" placeholder="Contact Number" value={props.values.contact} onChange={props.handleChange}/>
              </Form.Group>
              <ErrorMessage name="contact" render={msg => <div className="error-msg">{msg}</div>}/>

              <Button type = "submit">
              Submit
            </Button>
          </Form>
          )}
        </Formik> 
    </div>
    );
    return (
    <div className="login-form">
    <Form onSubmit={handleLoginSubmit}>
        <div style={{textAlign: "center"}}>
            <h4> Login</h4>
            <p> New User? <span onClick = {changePage} style={{color: "blue"}} >  SignUp </span></p>
        </div>
        <Form.Group className="mb-3">
            <Form.Label> Email</Form.Label>
            <Form.Control type="email" name="email" size="sm" placeholder="Email Address"  onChange={emailHandler}/>
        </Form.Group>
        <Button type = "submit" >
            Submit
        </Button>
        </Form>
        </div>
    );
}

export default LoginPage;