import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";

export default function useApplicationData() {
  //INITIALIZE EMPTY DAY LIST IN PROGRAM STATE
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });
  //const setDays = days => setState(prev => ({ ...prev, days }))

  //GETS DAYS ONCE UPON PAGE LOAD
  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:8001/api/days`),
      axios.get(`http://localhost:8001/api/appointments`),
      axios.get(`http://localhost:8001/api/interviewers`)
    ]).then((all) => {
      const [days, appointments, interviewers] = all;
      setState(prev => ({ days: days.data, appointments: appointments.data, interviewers: interviewers.data}));
    });
  }, []);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
    ...state.appointments,
    [id]: appointment
    };

    return axios.put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then((response) => {
        console.log("Status code " + response.status);
        setState({...state, appointments});
      })
      .catch((error) => {
        console.log(error);
        appointments.appointments.pop();
        setState(prev => ({ ...state, appointments }));
      });
  };
  
  function removeInterview(id) {
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
        setState({ ...state, appointments });
      })
      .catch((error) => {
        console.log(error);
        setState(prev=> ({ ...state, appointments }));
      })
  };

  function updateInterview(id, student, interviewerId) {
    const interview = {
      interview: {
        student: student,
        interviewer: interviewerId
      }
    };

    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
    .then(() => {
      axios.put(`http://localhost:8001/api/appointments/${id}`, interview)
        .then(() => {
          const appointments = {
            ...state.appointments[id],
            [id]: interview.interview
          };

          //setState({...state, appointments});
        })
        .catch((error) => {
          console.log(error);
        })
    });
  };


  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { /* insert logic */ }
      case SET_APPLICATION_DATA:
        return { /* insert logic */ }
      case SET_INTERVIEW: {
        return /* insert logic */
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }


  return { state, setDay, bookInterview, updateInterview, removeInterview };
}