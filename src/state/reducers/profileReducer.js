const profileReducer = (
  profile = {
    userId: "",
    firstName: "First Name",
    lastName: "Last Name",
    location: "City, Name",
    email: "Your Email",
    contact: "Your mobile No"
  },
  action
) => {
  switch (action.type) {
    case "MANAGE_PROFILE":
      return action.payload;
    default:
      return profile;
  }
};
export default profileReducer;
