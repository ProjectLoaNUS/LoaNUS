import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import NewItemCard from "../components/NewItem/NewItemCard";
import { useAuth } from "../database/auth";
import { SIGN_IN } from "./routes";

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
  const { user, setUser, isUserLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && isUserLoaded) {
      navigate(SIGN_IN, {
        state: {
          open: true,
          message: "Sign in before requesting or listing an item"
        }
      });
    }
  }, [user]);

  return (
    <MainContainer>
      <NewItemCard />
    </MainContainer>
  );
}

export default NewItemPage;
