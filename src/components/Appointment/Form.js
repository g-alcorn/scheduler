import React, { useState } from "react";
import InterviewerList from "../InterviewerList";
import Button from "../Button";

export default function Form(props) {
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [name, setName] = useState(props.name || "");
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

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            name={name}
            value={name}
            placeholder="Enter Student Name"
            type="text"
            onChange={onInput}
          />
        </form>
        
        <InterviewerList 
          values={props.values} 
          interviewers={props.interviewers} 
          interviewer={interviewer} 
          onChange={setInterviewer} 
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={(e) => {
            e.preventDefault();
            props.onSave(name, interviewer)}}>Save</Button>
        </section>
      </section>
    </main>      
  )

};

