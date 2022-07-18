import { act, render, fireEvent, screen } from "@testing-library/react";
import ChatBox from "../ChatBox";
import "@testing-library/jest-dom";

test("chatwrapper should be rendered", () => {
  render(<ChatBox />);
  const chatwrapperEl = screen.getByTestId("wrapper");
  expect(chatwrapperEl).toBeInTheDocument();
});

test("chattop should not be rendered", () => {
  render(<ChatBox currentChat={false} />);
  const noconvEl = screen.getByText("Open a conversation to start a chat");
  expect(noconvEl).toBeInTheDocument();
});
