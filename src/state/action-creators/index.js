
export const updateSkills = (skills) => {
  return (dispatch) => {
    dispatch({
      type: "UPDATE_SKILLS",
      payload: skills
    });
  };
};

export const manageFile = (file) => {
  return (dispatch) => {
    dispatch({
      type: "MANAGE_FILE",
      payload: file
    });
  };
};

export const manageProfile = (profile) => {
  return (dispatch) => {
    dispatch({
      type: "MANAGE_PROFILE",
      payload: profile
    });
  };
};

export const addEducation = (form) => {
  return (dispatch) => {
    dispatch({
      type: "ADD_EDUCATION",
      payload: form
    });
  };
};
export const editEducation = (form) => {
  return (dispatch) => {
    dispatch({
      type: "EDIT_EDUCATION",
      payload: form
    });
  };
};

export const removeEducation = (index) => {
  return (dispatch) => {
    dispatch({
      type: "REMOVE_EDUCATION",
      payload: index
    });
  };
};

export const manageEducation = (education) => {
  return (dispatch) => {
    dispatch({
      type: "MANAGE_EDUCATION",
      payload: education
    });
  };
};

export const handleLogin = (isLoggedIn) => {
  return (dispatch) => {
    dispatch({
      type: "CHANGE_LOGIN_STATUS",
      payload: isLoggedIn
    });
  };
};

