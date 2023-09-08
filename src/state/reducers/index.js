import { combineReducers } from "redux";
import skillsReducer from "./skillsReducer";
import profileReducer from "./profileReducer";
import educationReducer from "./educationReducer";
import fileReducer from "./fileReducer";
import authReducer from "./authReducer";

const reducers = combineReducers({
  skills: skillsReducer,
  file: fileReducer,
  profile: profileReducer,
  educationList: educationReducer,
  isLoggedIn: authReducer,
});

export default reducers;
