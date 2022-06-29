import styled from "styled-components";
import { NavLink } from "react-router-dom";
import React from "react";

const LinkContainer = styled.div`
  height: 5vh;
  width: 10vw;
  //border: 2px solid green;
  display: flex;
  align-items: center;
`;
const StyledLink = styled(NavLink)`
  color: #2d3c4a;
  font-size: 20px;

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
