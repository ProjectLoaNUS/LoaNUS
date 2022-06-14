import styled from "styled-components";
import NewItemCard from "../components/NewItem/NewItemCard";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0rem;
  background-color: #fafdf3;
  min-height: 100vh;
`;

function NewItemPage() {

  return (
    <MainContainer>
      <NewItemCard />
    </MainContainer>
  );
}

export default NewItemPage;
