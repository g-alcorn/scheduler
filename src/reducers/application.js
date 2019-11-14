export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

export default function reducer(state, action) {
   //REDUCER responds to dispatch functiom
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.value}
    case SET_APPLICATION_DATA:
      return { day: action.value.day, days: action.value.days, appointments: action.value.appointments, interviewers: action.value.interviewers}
    case SET_INTERVIEW: {
      return changeSpots(state, action);
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }

    //RETURN NEW STATE OBJECT WITH SPOTS REMAINING UPDATED
    function changeSpots(state, action) {
      if (action.spots === 1 || action.spots === -1) {
        //add action.spots
        //will be + or - as necessary
        let dayIndex = null;
        switch(state.day) {
          case "Monday":
            dayIndex = 0;
            break;
          case "Tuesday":
            dayIndex = 1;
            break;
          case "Wednesday":
            dayIndex = 2;
            break;
          case "Thursday":
            dayIndex = 3;
            break;
          case "Friday":
            dayIndex = 4;
            break;
        }
  
        console.log(new Error().stack)
        const previous = state;
        
        return {
          ...state,
          days: [
            ...state.days.slice(0, dayIndex),
            {
              ...state.days[dayIndex],
              spots: previous.days[dayIndex].spots + action.spots
            },
            ...state.days.slice(dayIndex + 1)
          ],
          appointments: {
            ...state.appointments, 
            [action.value.id]: action.value
          }    
        }
      } else {
        return { ...state, 
          appointments: {
            ...state.appointments, 
            [action.value.id]: action.value
          }
        }
      }
    }
}

