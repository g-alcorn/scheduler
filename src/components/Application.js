import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";

import { getAppointmentsForDay } from "../helpers/selectors";
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
      axios.get(`http://localhost:8001/api/appointments`)
    ]).then((all) => {
      console.log(all[0]); // first
      console.log(all[1]); // second
    
      const [days, appointments] = all;
      setState(prev => ({ days: days.data, appointments: appointments.data}));
    });
  }, []);

  const response = getAppointmentsForDay(state, state.day).map((appointment) => 
    <Appointment 
      key={appointment.id}
      {...appointment}
    />
  )


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
        {response}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
