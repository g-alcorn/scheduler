import React from "react";
import PropTypes from "prop-types";
import InterviewerListItem from "components/InterviewerListItem";
import "components/InterviewerList.scss";

export default function InterviewerList(props) {
  const response = props.values.map((value) => 
   <InterviewerListItem
      key={value.id}
      name={value.name}
      avatar={value.avatar}
      onChange={() => {props.onChange(value.id)}}
      selected={value.id === props.interviewer}
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

InterviewerList.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired
};