import React from "react";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import { format } from "timeago.js";
import { theme } from "../Theme";

const MessageContainer = styled.div.attrs((props) => ({
  className: props.className,
}))`
  &.own {
    align-items: flex-end;
  }
  display: flex;
  flex-direction: column;
  margin-top: 15px;
`;
const MessageTop = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const MessageBottom = styled.div`
  font-size: 12px;
  margin-top: 10px;
`;
const Text = styled.p.attrs((props) => ({
  className: props.className,
}))`
  &.own {
    border: 1px solid ${theme.palette.primary.main};
    background-color: ${theme.palette.primary.contrastText};
    color: ${theme.palette.primary.main};
  }
  margin-left: 10px;
  padding: 10px;
  border-radius: 15px;
  background-color: ${theme.palette.primary.main};
  color: ${theme.palette.primary.contrastText};
  max-width: 280px;
`;

function Message({ message, own }) {
  return (
    <MessageContainer className={own ? "own" : null}>
      <MessageTop data-testid="message">
        <Avatar></Avatar>
        <Text className={own ? "own" : null}>{message.text}</Text>
      </MessageTop>
      <MessageBottom>{format(message.createdAt)}</MessageBottom>
    </MessageContainer>
  );
}

export default Message;
