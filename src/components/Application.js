import React, { useState, useEffect } from "react";

import "components/Application.scss";
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "../helpers/selectors";
import useApplicationData from "../hooks/useApplicationData";
import Appointment from "./Appointment/index";
import DayList from "components/DayList";

export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    updateInterview,
    removeInterview
  } = useApplicationData();

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
      updateInterview={updateInterview}
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
