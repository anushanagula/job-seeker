const authReducer = (isLoggedIn = false, action) => {
    switch (action.type) {
      case "CHANGE_LOGIN_STATUS":
        return action.payload;
      default:
        return isLoggedIn;
    }
  };
  export default authReducer;
  