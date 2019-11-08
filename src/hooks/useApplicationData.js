import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

export default function useApplicationData() {
  //INITIALIZE EMPTY DAY LIST IN PROGRAM STATE
  const [state, dispatch] = useReducer(reducer, {
    day: {
      name: "Monday",
      spots: 0
    },
    days: [],
    appointments: {},
    interviewers: {}
  });


  const setDay = day => dispatch({ type: SET_DAY, value: day });

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.value}
      case SET_APPLICATION_DATA:
        return { day: action.value.day, days: action.value.days, appointments: action.value.appointments, interviewers: action.value.interviewers}
      case SET_INTERVIEW: {
        console.log(action.value);
        return { ...state, appointments: action.value}
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  //GETS DAYS ONCE UPON PAGE LOAD
  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:8001/api/days`),
      axios.get(`http://localhost:8001/api/appointments`),
      axios.get(`http://localhost:8001/api/interviewers`)
    ]).then((all) => {
      const [days, appointments, interviewers] = all;
      //setState(prev => ({ days: days.data, appointments: appointments.data, interviewers: interviewers.data}));
      const newState = {
        day: state.day,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      }
      dispatch({ type: SET_APPLICATION_DATA, value: newState });
    });
  }, [state.day]);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    return axios.put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then((response) => {
        console.log("Status code " + response.status);
        //setState({...state, appointments});
        dispatch({ type: SET_INTERVIEW, value: appointment });
      })
      .catch((error) => {
        console.log(error);
        appointment.interview = null;
        dispatch({ type: SET_INTERVIEW, value: appointment})
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
        //setState({ ...state, appointments });
        dispatch({ type: SET_INTERVIEW, value: appointments})
      })
      .catch((error) => {
        console.log(error);



        //dispatch({ type: SET_INTERVIEW, value: prev})
      })
  };

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
          const appointments = {
            ...state.appointments[id],
            [id]: interview.interview
          };

          dispatch({ type: SET_INTERVIEW, value: interview});
          //setState({...state, appointments});
        })
        .catch((error) => {
          console.log(error);
        })
    });
  };

  return { state, setDay, bookInterview, updateInterview, removeInterview };
}