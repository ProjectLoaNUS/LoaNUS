describe("new user sign up", () => {
  it("user signs up with google", () => {
    //visit website homepage
    cy.visit("http://localhost:3000");
    //sign in button
    cy.findByRole("link", { name: /sign in/i }).click();
    //sign in by google
    cy.findByRole("button", { name: /sign in with google/i }).click();
  });
  it("user signs up manually", () => {
    //visit website homepage
    cy.visit("http://localhost:3000");
    //sign in button
    cy.findByRole("link", { name: /sign in/i }).click();
    //user input random text
    cy.findByRole("textbox", { name: /email/i }).type("test123");
    //user inputs valid email address
    cy.findByRole("textbox", { name: /email/i }).clear();
    cy.findByRole("textbox", { name: /email/i }).type("yongbin@gmail.com");
    //user clicks next
    cy.findByRole("button", { name: /next/i }).click();
    //user clicks sign up without filling form
    cy.findByRole("button", { name: /sign up/i }).click();
    //user fills up halfway and signs up
    cy.findByRole("textbox", { name: /your full name/i }).type("Yb");
    cy.findByRole("spinbutton", { name: /your age/i }).type("22");
    cy.findByRole("button", { name: /sign up/i }).click();
    //user type password too short or not complex enough
    cy.get("[id=password1]").type("123456");
    cy.get("[id=password1]").clear();
    cy.get("[id=password1]").type("password123");
    cy.get("[id=password1]").clear();
    //user types wrong password for confirm password;
    cy.get("[id=password1]").type("P@ssword123");
    cy.get("[id=password1]").clear();
    cy.get("[id=password2]").type("P@ssword1234");
    cy.get("[id=password2]").clear();
    //user types right password and signs up
    cy.get("[id=password1]").type("P@ssword1234");
    cy.get("[id=password2]").type("P@ssword1234");
    cy.findByRole("textbox", { name: /your full name/i }).click();
    cy.findByRole("button", { name: /sign up/i }).click();
  });
});
