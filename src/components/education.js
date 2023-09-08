import React, { useState, useRef } from "react";

import { MdAddCircleOutline, MdEdit, MdClose, MdDelete } from "react-icons/md";
import { GiGraduateCap } from "react-icons/gi";
import {Form, Button, Modal, Row, Col} from "react-bootstrap";
import { ImCheckmark, ImCross } from "react-icons/im";
import Years from "../smallComponents/Years";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state/index";
import { Formik, ErrorMessage } from "formik";
import ReactLoading from "react-loading";
import * as Yup from "yup";

function Education() {
  const educationList = useSelector((state) => state.educationList);
  const dispatch = useDispatch();
  const { addEducation, editEducation, removeEducation } = bindActionCreators(
    actionCreators,
    dispatch
  );

  const [show, setShow] = useState(false);
  const [Alert, setAlert] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const [form, setForm] = useState({
    eduId: "",
    college: "",
    course: "",
    grade: "",
    branch: "",
    startDate: null,
    endDate: null,
    isEdit: false
  });

  const handleClose = () => {
    setValidated(false);
    setShow(false);
    setForm({
      eduId: "",
      college: "",
      course: "",
      grade: "",
      branch: "",
      startDate: "",
      endDate: "",
      isEdit: false
    });
  };
  const handleShow = () => setShow(true);
  const handleAlertClose = () => setAlert(false);
  const handleAlert = (id) => {
    setDeleteId(id);
    setAlert(true);
  };

  // const [list, setList] = useState([]);
  const handleForm = (e) => {
    setForm((old) => {
      return {
        ...old,
        [e.target.name]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value
      };
    });
  };


  const [validated, setValidated] = useState(false);

  
  const handleEdit = (id) => {
    const form = educationList[id];
    form.isEdit = true;
    setForm(form);
    setShow(true);
  };

  const handleDelete = (id) => {
    const eduid = educationList[id].eduId;
    const userId = localStorage.getItem('user');
    fetch(
      "http://localhost:5000/user/"+userId+"/deleteEducation/"+eduid, {
      method: "DELETE",
    })
          .then((res) => res.json())
          .then((json) => {
            removeEducation(id); 
          }); 
    setAlert(false);
  };

  const educationValidateSchema = Yup.object().shape({
    college: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    course: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    branch: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!'),
    grade: Yup.number().required('Required').positive('Grade should be positive'),
    startDate: Yup.date().required('Required'),
    endDate: Yup.date().min(Yup.ref('startDate'), "End Date should  be greater than start date").required('Required'),
  });
  

  return (
    <Row className="justify-content-center mt-2">
      <Col
        md={8}
        sm={12}
        className="d-flex justify-content-between align-items-center bg-light rounded"
      >
        <h5 className="m-0">Education</h5>
        <MdAddCircleOutline
          size={30}
          className="rounded edit"
          onClick={handleShow}
        />
      </Col>
      <Col md={8} sm={12}>
        {educationList.map((item, id) => {
          return (
            <Row className="border-bottom pt-3" key={id}>
              <Col md={10} className="d-flex justify-content-start">
                <GiGraduateCap
                  size={50}
                  className="rounded color-blue bg-grey p-1 shadow-sm"
                />
                <div className="px-3">
                  <h5 className="m-0">{item.college}</h5>
                  <p className="text-muted m-0">
                    {item.course} • {item.branch}
                  </p>
                  <p className="text-muted">
                    {item.startDate} - {item.endDate} 
                  </p>
                  <p className="text-muted">
                    GPA/Percentage: {item.grade}
                  </p>
                </div>
              </Col>
              <Col md={2}>
                <div className="d-flex flex-wrap justify-content-end">
                  <MdEdit
                    size={30}
                    className="rounded edit"
                    onClick={() => {
                      handleEdit(id);
                    }}
                  />
                  <MdDelete
                    size={30}
                    className="rounded edit"
                    onClick={() => {
                      handleAlert(id);
                    }}
                  />
                </div>
              </Col>
            </Row>
          );
        })}
      </Col>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        scrollable={true}
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title>Education</Modal.Title>
          <MdClose size={30} className="rounded edit" onClick={handleClose} />
        </Modal.Header>

        <Modal.Body>
        <Formik
          initialValues={form}
          validationSchema={educationValidateSchema}
          onSubmit={async (values, { setSubmitting }) => {
            var form = values;
            if (form.isEdit) {
              const userId = localStorage.getItem('user');
              fetch(
                "http://localhost:5000/user/"+userId+"/editEducation/"+form.eduId, {
                method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                body: JSON.stringify({education: form})
                })
                            .then((res) => res.json())
                            .then((json) => { 
                              editEducation(json);
                            });
            } else {
              const userId = localStorage.getItem('user');
              fetch(
                "http://localhost:5000/user/"+userId+"/addEducation", {
                method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                body: JSON.stringify({education: form})
                })
                            .then((res) => res.json())
                            .then((json) => { 
                              addEducation(json);
                            });
              // const newList = list.concat({ ...form });
              // setList(newList);
            }
            setSubmitting(false);
           handleClose();
          }}
        >
       {props => (
        <div>
          {props.isSubmitting && <ReactLoading type="spin"/> }
          <Form noValidate validated={validated} onSubmit={props.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>School / College</Form.Label>
              <Form.Control
                required
                type="text"
                name="college"
                size="sm"
                placeholder="Ex: Government Engineering College"
                value={props.values.college}
                onChange={props.handleChange}
              />
            </Form.Group>
           <ErrorMessage name="college" render={msg => <div className="error-msg">{msg}</div>}/>
            <Form.Group className="mb-3">
              <Form.Label>Degree</Form.Label>
              <Form.Control
                required
                type="text"
                name="course"
                size="sm"
                placeholder="Ex: Bachelor of Engineering"
                value={props.values.course}
                onChange={props.handleChange}
              />
            </Form.Group>
            <ErrorMessage name="course" render={msg => <div className="error-msg">{msg}</div>}/>
            <Form.Group className="mb-3">
              <Form.Label>Field of study</Form.Label>
              <Form.Control
                required
                type="text"
                name="branch"
                size="sm"
                placeholder="Ex: Computer Engineering"
                value={props.values.branch}
                onChange={props.handleChange}
              />
            </Form.Group>
            <ErrorMessage name="branch" render={msg => <div className="error-msg">{msg}</div>}/>
            <Form.Group className="mb-3">
              <Row>
                <Col>
                  <Row>
                    <Form.Label>Start - Year</Form.Label>
                  </Row>
                  <Row>
                    <Col>
                    <input
                      value = {props.values.startDate}
                      name = "startDate"
                      type="date"
                      onChange={props.handleChange}
                      ref={startDateRef}
                    />
                    </Col>
                  </Row>
                  <Row>
                  <ErrorMessage name="startDate" render={msg => <div className="error-msg">{msg}</div>}/>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <Col>
                      <Row>
                        <Form.Label>End - Year</Form.Label>
                      </Row>
                      <Row>
                        <Col>
                        <input
                        value = {props.values.endDate}
                            name = "endDate"
                            type="date"
                            onChange={props.handleChange}
                            ref={endDateRef}
                          />
                        </Col>
                      </Row>
                      <Row>
                      <ErrorMessage name="endDate" render={msg => <div className="error-msg">{msg}</div>}/>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>GPA/Percentage</Form.Label>
              <Form.Control
                required
                type="text"
                name="grade"
                size="sm"
                placeholder="Ex: 8.5/10 CGPA"
                value={props.values.grade}
                onChange={props.handleChange}
              />
            </Form.Group>
            <ErrorMessage name="grade" render={msg => <div className="error-msg">{msg}</div>}/>
            <Button type= "submit">
              Save Changes
            </Button>
          </Form>
          </div>
          )}
          </Formik>
        </Modal.Body>
      </Modal>
      <Modal
        show={Alert}
        onHide={handleAlertClose}
        className="text-center"
        size="sm"
        centered
      >
        <Modal.Body>
          <h4>Are you sure ?</h4>
          <ImCheckmark
            size={30}
            className="rounded edit"
            onClick={() => {
              handleDelete(deleteId);
            }}
          />
          <ImCross
            size={25}
            className="rounded edit"
            onClick={handleAlertClose}
          />
        </Modal.Body>
      </Modal>
    </Row>
  );
}

export default Education;
