import React, { useState } from "react";
import "components/InterviewerListItem.scss";
const classnames = require('classnames');

export default function InterviewerListItem(props) {
  const [interviewer, onChange] = useState([]);
  const interviewerClass = classnames({
    "interviewers__item": !props.selected,
    "interviewers__item--selected": props.selected
  });

  return (
    <li 
      className={interviewerClass}
    >
      <img
        className={"interviewers__item-image"}
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  )
}
