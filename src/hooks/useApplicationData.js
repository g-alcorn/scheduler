import React, { useState, useEffect, useReducer } from "react";
import axios from "../__mocks__/axios";
import { statement } from "@babel/template";
const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

export default function useApplicationData() {
  //INITIALIZE EMPTY DAY LIST IN PROGRAM STATE
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });


  const setDay = day => dispatch({ type: SET_DAY, value: day });

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
  
  //REDUCER responds to dispatch functiom
  function reducer(state, action) {
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
  }

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