import React, { useEffect } from "react";
import "./styles.scss";
import Header from "./Header";
import Form from "./Form";
import Empty from "./Empty";
import Show from "./Show";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const EDIT = "EDIT";
  const CONFIRM = "CONFIRM";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
  const { mode, transition, back } = useVisualMode(
    props.interview? SHOW : EMPTY
  );

  function save(name, interviewer) {
    transition(SAVING);
    const interview = {
      student: name,
      interviewer
    };

    props
      .bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW);
      })
      .catch(error => transition(ERROR_SAVE, true)) 
  };

  function removeAppointment() {
    transition(DELETING);
    props
      .onDelete(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch(error => {
        transition(ERROR_DELETE, true)
      })
  };

  function updateAppointment(name, interviewerId) {
    transition(SAVING)

    props
      .updateInterview(props.id, name, interviewerId)
      .then(() => {
        transition(SHOW);
      })
      .catch(error => {
        transition(ERROR_SAVE, true);
      })
  };

  return  (
    <article className="appointment">
    <Header time={props.time}/>
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onDelete={() => transition(CONFIRM)}
        onEdit={() => transition(EDIT)}
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
        values={props.interviewers}
        interviewer={props.interview.interviewer.id}
        name={props.interview.student}
        onCancel={() => transition(SHOW)}
        onSave={(name, interviewer) => updateAppointment(name, interviewer)}
        mode={"EDIT"}
      />
    )}
    {mode === ERROR_SAVE && (
      <Error
      message={"Error! Could not save"}
      onClose={back}
      />
    )}
    {mode === ERROR_DELETE && (
      <Error
      message={"Error! Could not delete"}
      onClose={back}
      />
    )}
    </article>
  );
}