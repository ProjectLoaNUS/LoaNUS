import React from "react";
import styled from "styled-components";
import ButtonComponent from "../Button";
import { useNavigate } from "react-router-dom";

const MainContainer = styled.div`
  height: auto;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const NoListingsText = styled.h2`
  font-size: 20px;
`;

function ListingsCard() {
  const navigate = useNavigate();
  const handlelist = () => {
    navigate("/new-item");
  };
  return (
    <MainContainer>
      <NoListingsText>No listings made</NoListingsText>
      <ButtonComponent
        state={"primary"}
        text={"List Item"}
        size={"small"}
        onClick={handlelist}
      ></ButtonComponent>
    </MainContainer>
  );
}

export default ListingsCard;
