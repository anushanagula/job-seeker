import React, {useEffect, useState} from "react";
import Profile from "./profile";
import Education from "./education";
import Skills from "./skills";
import Container from 'react-bootstrap/Container';
import ReactLoading from "react-loading";
import { useNavigate } from 'react-router-dom';
import {ENDPOINT} from'../constants';
import { actionCreators } from "../state/index"
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
    const dispatch = useDispatch();
    const { manageProfile, manageFile, manageEducation, updateSkills } = bindActionCreators(
        actionCreators,
        dispatch
      );
    useEffect(() => {
        const user = localStorage.getItem('user');
        if(!user) {
            setTimeout(function() { //Start the timer
                navigate('/login');
            }, 1000)
        }
        else {
            fetch(
                "http://localhost:5000/user?id="+user, {
                method: "GET"})
                            .then((res) => res.json())
                            .then((json) => {
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
                                  setIsLoading(false);
                            })
        }
    },[]);
    if(isLoading) return (
      <div className='centerer-div'>
      <ReactLoading type="bars" color="#0000FF"
          height={100} width={50} />
          </div>
);
    return (
        <Container>
          <Profile />
          <Education/>
          <Skills/>
        </Container>
    );
}