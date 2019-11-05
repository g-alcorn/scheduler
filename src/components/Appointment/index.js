import React, { useEffect } from "react";
import "./styles.scss";
import Header from "./Header";
import Form from "./Form";
import Empty from "./Empty";
import Show from "./Show";
import Status from "./Status";
import Confirm from "./Confirm";
import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const EDIT = "EDIT";
  const CONFIRM = "CONFIRM";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const { mode, transition, back } = useVisualMode(
    props.interview? SHOW : EMPTY
  )

  function save(name, interviewer) {
    console.log(name);
    console.log(interviewer);
    const interview = {
      student: name,
      interviewer
    };
    
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW);
      }); 
  }

  function removeAppointment() {
    transition(SAVING);
    props.onDelete(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch(() => {
        back();
      })
  }


  return  (
    <article className="appointment">
    <Header time={props.time}/>
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onDelete={() => transition(CONFIRM)}
        onEdit={() => transition(CREATE)}
      />
    )}
    {mode === CREATE && (
      <Form 
        values={props.interviewers}
        onCancel={() => transition(EMPTY)}
        onSave={(name, interviewer) => save(name, interviewer)}
      />
    )}
    {mode === SAVING && (
      <Status 
        message={"Saving..."}
      />
    )}
    {mode === CONFIRM && (
      <Confirm 
        message={"Are you sure you want to delete?"}
        onCancel={() => transition(SHOW)}
        onConfirm={() => removeAppointment()}
      />
    )}
    {mode === DELETING && (
      <Status 
        message={"Deleting..."}
      />
    )}
    {mode === EDIT && (
      <Form
        values={}
        onCancel={() => transition(SHOW)}
        onSave={(name, interviewer) => updateAppointment(name, interviewer)}
      
      />
    )}
    </article>
  );
}