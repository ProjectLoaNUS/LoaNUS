import { render, screen } from "@testing-library/react";
import ChatOnline from "../ChatOnline";
import "@testing-library/jest-dom";

test("chatOnline should not be rendered", () => {
  render(<ChatOnline onlineUsers={false} />);
  const chatonlineEl = screen.getByTestId("online");
  expect(chatonlineEl).not.toBeInTheDocument();
});
