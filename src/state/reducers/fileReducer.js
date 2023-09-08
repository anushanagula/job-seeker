const fileReducer = (file = "./images/profile_image.jpg", action) => {
  switch (action.type) {
    case "MANAGE_FILE":
      return action.payload;
    default:
      return file;
  }
};
export default fileReducer;
