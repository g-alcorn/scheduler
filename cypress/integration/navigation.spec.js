describe("Navigation", () => {
  it("should visit root", () => {
    cy.visit("/");
  });

  it("should navigate to tuesday", () => {
    //Open homepage
    cy.visit("/");

    //Find list item Tuesday and click, then check the background color to show if it is selected or not
    cy
      .contains("[data-testid=day]", "Tuesday")
      .click()
      .should("have.class", "day-list__item--selected");
  })
});
