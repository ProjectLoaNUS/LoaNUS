describe("user", () => {
  it("user can use app", () => {
    //login
    cy.visit("http://localhost:3000");
    cy.get("#root > div > div > div > div:nth-child(1) > div").click();
  });
});
