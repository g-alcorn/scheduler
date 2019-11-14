import { useEffect, useReducer } from "react";
//import axios from "../__mocks__/axios";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "../reducers/application";


export default function useApplicationData() {
  //INITIALIZE EMPTY DAY LIST IN PROGRAM STATE
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  //CHANGE STATE WHEN NAVIGATING TO OTHER DAY
  const setDay = day => dispatch({ type: SET_DAY, value: day });

  //GETS DAYS ONCE UPON PAGE LOAD
  useEffect(() => {
    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`)
    ]).then((all) => {
      const [days, appointments, interviewers] = all;
      const newState = {
        day: state.day,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      }
      dispatch({ type: SET_APPLICATION_DATA, value: newState });
    });
  }, [state.day]);


  //Put new interview data in DB and then dispatch state update
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    return axios.put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then((response) => {
        console.log("Status code " + response.status);
        //setState({...state, appointments});
        dispatch({ type: SET_INTERVIEW, value: appointment, spots: -1 });
      })
      .catch((error) => {
        console.log(error);
        appointment.interview = null;
        dispatch({ type: SET_INTERVIEW, value: appointment })
      });
  };
  

  //Delete interview from DB then update state
  function removeInterview(id) {
    //temporarily keeps the removed interview in case of database query error
    const oldAppt = {
      [id]: state.appointments[id]
    };

    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then((response) => {
        console.log("Deleted " + response.status);
        dispatch({ type: SET_INTERVIEW, value: appointments, spots: 1})
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: SET_INTERVIEW, value: oldAppt})
      })
  };


  //Delete old version of interview, save new version in DB, then update state
  function updateInterview(id, student, interviewerId) {
    const interview = {
      id,
      interview: {
        student: student,
        interviewer: interviewerId
      }
    };

    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
    .then(() => {
      axios.put(`http://localhost:8001/api/appointments/${id}`, interview)
        .then(() => {
          dispatch({ type: SET_INTERVIEW, value: interview});
        })
        .catch((error) => {
          console.log(error);
        })
    });
  };

  return { state, setDay, bookInterview, updateInterview, removeInterview };
}