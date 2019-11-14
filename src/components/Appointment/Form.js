import React, { useState } from "react";
import InterviewerList from "../InterviewerList";
import Button from "../Button";

export default function Form(props) {
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [name, setName] = useState(props.name || "");
  const [error, setError] = useState("");

  const reset = function() {
    setName("");
    setInterviewer(null);
  };

  const cancel = function() {
    reset();
    props.onCancel();
  };

  const onInput = function(event) {
    setName(event.target.value);
  };

  const validate = function(name, interviewer) {
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    } else if (!interviewer) {
      setError("Interviewer must be selected");
      return;
    } 
  
    setError("");
    props.onSave(name, interviewer);
  };

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            value={name}
            placeholder="Enter Student Name"
            onChange={onInput}
            data-testid="student-name-input"
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList 
          values={props.values} 
          interviewer={interviewer} 
          onChange={setInterviewer} 
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
            <Button danger data-testid={"button--cancel"} onClick={cancel}>Cancel</Button>
            <Button confirm data-testid={"button--save"} onClick={(e) => {
              e.preventDefault();
              validate(name, interviewer)}}>Save</Button>
        </section>
      </section>
    </main>      
  )

};

