const skillReducer = (skills = [], action) => {
  switch (action.type) {
    case "UPDATE_SKILLS":
      return [...action.payload];
    default:
      return skills;
  }
};
export default skillReducer;
