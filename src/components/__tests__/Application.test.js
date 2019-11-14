import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, getByPlaceholderText, getByAltText, getAllByTestId, queryByText, queryByAltText, prettyDOM } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);
describe("Application", () => {
  xit("renders without crashing", () => {
    render(<Application />);
  });

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    // console.log(prettyDOM(appointment));
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value: "Archie Cohen" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving...")).toBeInTheDocument();
    
    await waitForElement(() => getByText(appointment, "Archie Cohen"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    //1. render application
    const { container, debug } = render(<Application />);

    //2. Wait for student name text to be displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //3. Click trash icon on appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    )

    fireEvent.click(queryByAltText(appointment, "Delete"));

    //4. Check for confirmation message
    expect(getByText(appointment, "Are you sure you want to delete?")).toBeInTheDocument();

    //5. Click on confirm button
    fireEvent.click(queryByText(appointment, "Confirm"));

    //6. Check for "Deleting..." in the document
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

    //7. Wait until Add button appears
    await waitForElement(() => queryByAltText(appointment, "Add"));
    
    //8. Check for "2 spots remaining" in the document
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

    debug();
  });

  it("Shows error when no student name entered", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value: "" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Student name cannot be blank")).toBeInTheDocument();

  });

  it("Shows error when no interviewer selected", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value: "Griffin" }
    });

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Interviewer must be selected")).toBeInTheDocument();

  })
})
