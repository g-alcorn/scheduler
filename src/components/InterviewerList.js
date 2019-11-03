import React, { useState } from "react";
import InterviewerListItem from "components/InterviewerListItem";
import "components/InterviewerList.scss";

export default function InterviewerList(props) {
  const [interviewer, setInterviewer] = useState(props.interviewer || []);
  const response = props.values.map((value) =>
    <InterviewerListItem
      name={value.name}
      avatar={value.avatar}
      onChange={setInterviewer}
      selected={value.name === props.value}
    />
  )

  return (
    <section className="interviewers">
    <h4 className="interviewers__header text--light">Interviewer</h4>
    <ul className="interviewers__list">
    {response}
    </ul>
    </section>
  )
}
