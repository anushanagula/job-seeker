const educationReducer = (list = [], action) => {
  var edu = action.payload;
  switch (action.type) {
    case "ADD_EDUCATION":
      edu.startDate = edu.startDate.split('T')[0];
      edu.endDate = edu.endDate.split('T')[0];
      return [...list, edu];
    case "EDIT_EDUCATION":
      let newArr = [...list];
      var index=0;
      for(var i=0;i<newArr.length;i++) {
        if(action.payload.eduId == newArr[i].eduId) {
          index = i;
          break;
        }
      }
      edu.startDate = edu.startDate.split('T')[0];
      edu.endDate = edu.endDate.split('T')[0];
      newArr[index] = edu;
      return newArr;
    case "REMOVE_EDUCATION":
      let arr = [...list];
      arr.splice(action.payload, 1);
      return arr;
    case "MANAGE_EDUCATION":
      console.log(action.payload);
      var newAr = [... action.payload];
      for(i =0 ;i< newAr.length;i++) {
        var educ = newAr[i];
        educ.eduId= educ._id;
        educ.startDate = educ.startDate.split('T')[0];
        educ.endDate = educ.endDate.split('T')[0];
        newAr[i] = educ;
      }
      return [...newAr];
    default:
      return list;
  }
};
export default educationReducer;
