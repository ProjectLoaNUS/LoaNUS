describe(" user sets profile picture", () => {
  it("user sets profile picture in", () => {
    //visit website homepage
    cy.visit("http://localhost:3000");
    //sign in button
    cy.findByRole("link", { name: /sign in/i }).click();
    //signs in after verification
    cy.findByRole("textbox", { name: /email/i }).type("yongbin@gmail.com");
    cy.findByRole("button", { name: /next/i }).click();
    cy.get("[id=password1]").type("P@ssword1234");
    cy.get("[id=submit]").click();
    cy.findByTestId("AccountCircleIcon").click();
    cy.findByRole("menuitem", { name: /account/i }).click();
    //set image
    cy.get("input[type=file]").attachFile("Student_Pic.jpg");
    //upload
    cy.findByRole("button", { name: /upload image/i }).click();
  });
});
