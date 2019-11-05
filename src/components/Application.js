import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";

import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "../helpers/selectors";
import Appointment from "./Appointment/index";
import DayList from "components/DayList";

export default function Application(props) {
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
    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then((response) => {
        console.log("Deleted " + response.status);
        const appointment = {
          ...state.appointments[id],
          interview: null
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };

        setState({ ...state, appointments });
      })
      .catch((error) => {
        console.log(error);
        setState(prev=> ({ ...state, appointments }));
      })
  }


  const appointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);
  
  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    
    return (
    <Appointment 
      key={appointment.id}
      {...appointment}
      interviewers={interviewers}
      interview={interview}
      bookInterview={bookInterview}
      onDelete={removeInterview}
    />)
  });


  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
          <nav className="sidebar__menu">
            <DayList
              days={state.days}
              day={state.day}
              setDay={setDay}
            />

          </nav>
          <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {/* Replace this with the schedule elements durint the "The Scheduler" activity. */}
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
