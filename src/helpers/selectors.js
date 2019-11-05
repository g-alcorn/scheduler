export function getAppointmentsForDay(state, day) {
  let dayIndex = determineDayIndex(day);
  let response = [];

  if (state.days[dayIndex]) {
    for (let i = 0; i < state.days[dayIndex].appointments.length; i++) {
      for (let appt in state.appointments) {
        if (state.appointments[appt].id === state.days[dayIndex].appointments[i]) {
          response.push(state.appointments[appt]);
        }
      }
    }    
  }

  return response;
};

export function getInterviewersForDay(state, day) {
  let dayIndex = determineDayIndex(day);
  let response = [];

  if (state.days[dayIndex]) {
    for (let i = 0; i < state.days[dayIndex].interviewers.length; i++) {
      for (let interviewer in state.interviewers) {
        if (state.interviewers[interviewer].id === state.days[dayIndex].interviewers[i]) {
          response.push(state.interviewers[interviewer]);
        }
      }
    }
  }

  return response;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const {student, interviewer} = interview;
  let response = {
    student,
    interviewer: state.interviewers[interviewer]
  }
  
  return response;
}

const determineDayIndex = function(day) {
  switch (day) {
    case "Monday":
      return 0;
    case "Tuesday":
      return 1;
    case "Wednesday":
      return 2;
    case "Thursday":
      return 3;
    case "Friday":
      return 4;
    default:
      return [];
  }
}