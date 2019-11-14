import { exportAllDeclaration } from "@babel/types";

describe("Appointment", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
  
    cy.visit("/");
  
    cy.contains("Monday");
   });

  xit("should book an interview", () => {
    //find add button and click
    cy
      .get("[alt=Add]")
      .first()
      .click();
    
    //find name input and type name
    cy
      .get("[data-testid=student-name-input]")
      .type("Lydia Miller-Jones");

    //find and click on an interviewer
    cy
      .get("[alt='Sylvia Palmer']")
      .click();

    //find and click save button
    cy
      //.get("[class='button button--confirm']")
      .contains("Save")
      .click();

    //Shows saved appointment card with appropriate name and interviewer
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  it("Should edit interview", () => {
    //Click edit button
    cy
      .get("[alt='Edit']")
      .click({ force: true });

    //Should have a form
    cy
      .get("form");

    cy
      .get("[data-testid=student-name-input]")
      .clear()
      .type("Griffin Alcorn")

    cy
      .contains("Save")
      .click();

    //After Saving
    //Shows saved appointment card with appropriate name and interviewer
    cy.contains(".appointment__card--show", "Griffin Alcorn");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  it("Should delete an appointment", () => {
    cy
      .get("[alt='Delete']")
      .click({ force: true });

    cy
      .contains("Confirm")
      .click();

    cy 
      .contains("Deleting...")
      .should("exist");

    cy
      .contains("Deleting...")
      .should("not.exist");

    cy
      .contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist");
  });
});