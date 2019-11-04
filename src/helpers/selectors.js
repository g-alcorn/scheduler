export function getAppointmentsForDay(state, day) {
  let dayIndex = null;
  let response = [];
  switch (day) {
    case "Monday":
      dayIndex = 0;
      break;
    case "Tuesday":
      dayIndex = 1;
      break;
    case "Wednesday":
      dayIndex = 2;
      break;
    case "Thursday":
      dayIndex = 3;
      break;
    case "Friday":
      dayIndex = 4;
      break;
    default:
      return [];
  }

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