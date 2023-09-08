import React, { Fragment, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { MdEdit, MdClose } from "react-icons/md";
import { HiLocationMarker, HiOutlineMail, HiPhone } from "react-icons/hi";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state/index";
const FormData = require("form-data");

function Profile() {
  const profile = useSelector((state) => state.profile);
  const userprofileImage = useSelector((state) => state.file);
  const dispatch = useDispatch();
  const { manageProfile, manageFile } = bindActionCreators(
    actionCreators,
    dispatch
  );

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  return (
    <Fragment>
      <Row className="justify-content-center">
        <Col
          md={8}
          sm={12}
          className="d-flex justify-content-between img-column"
        >
          <img src={userprofileImage} className="profile-image" alt="..."></img>

          <MdEdit size={30} className="rounded edit" onClick={handleShow} />
        </Col>
      </Row>
      <Row className="justify-content-center mt-2">
        <Col md={4} sm={6}>
          <Col>
            <h4>{profile.firstName} {profile.lastName}</h4>
          </Col>
          <Col className="d-flex justify-content-start">
            <HiLocationMarker size={30} className="p-1" />
            <p className="p-1 m-0">{profile.location}</p>
          </Col>
        </Col>
        <Col md={4} sm={6} className="d-flex flex-wrap">
          <p
            className="p-1 m-0"
          >
            <HiOutlineMail size={30} className="p-1" />
            {profile.email}
          </p>
          <p
            className="p-1 m-0"
          >
            <HiPhone size={30} className="p-1" />
            {profile.contact}
          </p>
        </Col>
      </Row>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop="static"
      >
        <Modal.Header >
                <Modal.Title>Profile Details</Modal.Title>
                <MdClose size={30} className="rounded edit" onClick={handleClose}/>
              </Modal.Header>

              <Modal.Body>
        <Formik
          initialValues={{
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            contact: profile.contact,
            location: profile.location,
            profileImage: ''
          }}

          validationSchema={SignupSchema}
          onSubmit={async (values, {setSubmitting}) => {
            const bod= new FormData();
            var form = values;
            bod.append("firstName", values.firstName);
            bod.append("lastName", values.lastName);
            bod.append("location", values.location);
            bod.append("contact", values.contact);
            if(values.profileImage)
            bod.append("profileImage", values.profileImage);
            for(var pair of bod.entries()) {
              console.log(pair[0]+', '+pair[1]);
            }
            console.log(form);
              const userId = localStorage.getItem('user');
              fetch(
                "http://localhost:5000/user/updateProfile/"+userId, {
                method: "POST",
                body: bod,
                })
                .then((res) => res.json())
                .then((json) => { 
                  manageProfile(json);
                  if(json.profileImage != null)
                  manageFile(json.profileImage);
                });
                setSubmitting(false);
                handleClose();
            }
          }
        >
          {props => (
            <Form encType="multipart/form-data" onSubmit={props.handleSubmit}>
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
                  <Form.Label>Location</Form.Label>
                  <Form.Control type="text" name="location" size="sm" placeholder="City, Country" value={props.values.location} onChange={props.handleChange}/>
              </Form.Group>
              
              <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control readOnly type="email" name="email" size="sm" placeholder="Email Address" value={props.values.email}/>
              </Form.Group>
              <ErrorMessage name="email" render={msg => <div className="error-msg">{msg}</div>}/>
              <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="number" name="contact" size="sm" placeholder="Contact Number" value={props.values.contact} onChange={props.handleChange}/>
              </Form.Group>
              <ErrorMessage name="contact" render={msg => <div className="error-msg">{msg}</div>}/>
              <Form.Group controlId="formFileSm" className="mb-3">
                  <Form.Label>Profile Picture</Form.Label>
                  <Form.Control name = "profileImage" type="file" accept="image/*" size="sm" onChange={(event) => {
                    console.log(event.currentTarget.files[0])
              props.setFieldValue('profileImage', event.currentTarget.files[0]);
            }}/>
              </Form.Group>
              <ErrorMessage name="profileImage" render={msg => <div className="error-msg">{msg}</div>}/>
              <Button type = "submit">
              Submit
          </Button>
          </Form>
          )}
        </Formik> 
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}

export default Profile;
