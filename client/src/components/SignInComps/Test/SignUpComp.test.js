import { act, render, fireEvent, screen } from "@testing-library/react";
import SignUpComp from "../SignUpComp";
import "@testing-library/jest-dom";

test("name input should be rendered", () => {
  render(<SignUpComp />);
  const nameinputEl = screen.getByLabelText(/Your full name/i);
  expect(nameinputEl).toBeInTheDocument();
});

test("age input should be rendered", () => {
  render(<SignUpComp />);
  const ageinputEl = screen.getByLabelText(/Your age/i);
  expect(ageinputEl).toBeInTheDocument();
});
