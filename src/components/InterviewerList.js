import React from "react";
import InterviewerListItem from "components/InterviewerListItem";
import "components/InterviewerList.scss";

export default function InterviewerList(props) {
  const response = props.interviewers.map((interviewer) =>
    <InterviewerListItem
      name={interviewer.name}
      avatar={interviewer.avatar}
      setInterviewer={props.setInterviewer(interviewer.id)}
      selected={interviewer.name === props.name}
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
