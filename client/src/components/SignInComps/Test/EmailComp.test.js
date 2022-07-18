import { act, render, fireEvent, screen } from "@testing-library/react";
import EmailComp from "../EmailComp";
import "@testing-library/jest-dom";

test("email box should be rendered", () => {
  render(<EmailComp />);
  const emailboxEl = screen.getByLabelText(/email/i);
  expect(emailboxEl).toBeInTheDocument();
});

test("email box should be empty", () => {
  render(<EmailComp />);
  const emailboxEl = screen.getByLabelText(/email/i);
  expect(emailboxEl.value).toBe("");
});

test("email box input should change", () => {
  render(
    <EmailComp
      setIsEmailError={() => {
        console.log(true);
      }}
      setEmail={() => {
        console.log(true);
      }}
    />
  );
  const emailboxEl = screen.getByLabelText(/email/i);
  const testValue = "yongbin_01@hotmail.com";
  fireEvent.change(emailboxEl, { target: { value: testValue } });
  expect(emailboxEl.value).toBe(testValue);
});
