import styled from "styled-components";
import { NavLink } from "react-router-dom";
import React from "react";

const LinkContainer = styled.div`
  flex: 1 1 0;
  height: 5vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const StyledLink = styled(NavLink)`
  color: #2d3c4a;
  font-size: 20px;
  text-align: center;

  &:active {
    color: #eb8736;
  }
`;

function ProfileLink(props) {
  return (
    <LinkContainer>
      <StyledLink to={props.link || ""}>{props.text}</StyledLink>
    </LinkContainer>
  );
}
export default ProfileLink;
