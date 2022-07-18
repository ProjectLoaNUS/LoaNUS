import { render, screen } from "@testing-library/react";
import Message from "../Message";
import "@testing-library/jest-dom";

test("Message should be rendered", () => {
  render(
    <Message
      own={true}
      message={{ text: "hello", createdAt: "2022-07-02T15:41:23.785+00:00" }}
    />
  );
  const messageEl = screen.getByTestId("message");
  expect(messageEl).toBeInTheDocument();
});
