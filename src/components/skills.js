import React, { useState, useEffect } from 'react'
import { MdAddCircleOutline, MdEdit, MdClose, MdOutlineCancel } from 'react-icons/md';
import { ImCheckmark, ImCross } from 'react-icons/im'
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import {Form, Button, Modal, Row, Col} from "react-bootstrap";

function Skills() {

  const skills = useSelector(state => state.skills)
  const dispatch = useDispatch();
  const {updateSkills} = bindActionCreators(actionCreators, dispatch);

  // const [skills, setSkills] = useState([]);
  const [show, setShow] = useState(false);
  const [localSkills, setLocalSkills] = useState(skills);

  const handleClose = () => {
    setShow(false);
    setValidated(false);
    setLocalSkills(skills);
  }
  const handleShow = () => setShow(true);
  const [isEdit, setIsEdit] = useState(true);
  const [validated, setValidated] = useState(false);

  const [input, setInput] = useState("")
  const handleInput = (e) => {
    setInput(e.target.value)
  }

  const handleSkills = (e) => {
    e.preventDefault();
    const valid = e.currentTarget;
    if (!valid.checkValidity()) {
      setValidated(true);
    }
    else {
      const userId = localStorage.getItem('user');
      fetch(
        "http://localhost:5000/user/"+userId+"/updateSkills", {
        method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        body: JSON.stringify({skills: localSkills})
        })
                    .then((res) => res.json())
                    .then(() => { 
                      setIsEdit(true);
                      updateSkills(localSkills);
                      setInput("");
                      handleClose();
                    });
    }
  }

  const handleDelete = (id) => {
    setLocalSkills((prevState) => {
      let arr = [...prevState];
      arr.splice(id, 1);
      return arr;
    });
  }

  const handleAddSkill = (e) => {
    e.preventDefault();
    const valid = e.currentTarget;
    if (!valid.checkValidity()) {
      setValidated(true);
    }
    else {
    setLocalSkills((prevState) => {
      return [...prevState, input]
    });
  }
    setInput("");
  }

  useEffect(()=>{
    if (skills.length === 0) {
      setIsEdit(false);
    }
  },[skills])

  return (
    <Row className="justify-content-center mt-2">
      <Col md={8} sm={12} className="d-flex justify-content-between align-items-center bg-light rounded">
        <h5 className="m-0">Skills</h5>
        {!isEdit && <MdAddCircleOutline size={30} className="rounded edit" onClick={handleShow} />}
        {isEdit && <MdEdit size={30} className="rounded edit" onClick={handleShow} />}
      </Col>
      <Col md={8} sm={12}>
        <Row className="border-bottom pt-3">
          <Col md={12} className="d-flex flex-wrap">
            {
              skills.map((items, id) => {
                return (
                  <p className="technology rounded" key={id}>{items}</p>
                )
              })
            }


          </Col>
        </Row>

      </Col>
      <Modal show={show} onHide={handleClose} centered backdrop="static">
        <Modal.Header>
          <Modal.Title>Skills</Modal.Title>
          <MdClose size={30} className="rounded edit" onClick={handleClose} />
        </Modal.Header>

        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleAddSkill}>
            <div className="d-flex align-item-start mb-2">
            <Form.Group >
              <Form.Control required type="text" size="sm" placeholder="Enter Skill" value={input} onChange={handleInput} />
            </Form.Group>
            <button type="submit" className="rounded edit m-0 mx-2">
              Add Skill
            </button>
            </div>
          </Form>
          <hr></hr>
          <div className="d-flex flex-wrap">
            {
              localSkills.map((items, id) => {
                return (
                  <p key={id} className="technology rounded ">{items} &nbsp; <MdOutlineCancel className="delete rounded" onClick={() => { handleDelete(id) }} /></p>
                )
              })
            }
          </div>
          <Button onClick={handleSkills}>Update</Button>
        </Modal.Body>

      </Modal>
    </Row>
  )
}

export default Skills