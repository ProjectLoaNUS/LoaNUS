import styled from "styled-components";
import NavigationBar from "../components/NavBar/NavigationBar";
import { useAuth } from "../database/auth";
import ProfileLink from "../components/ProfileComps/LinkComponent";
import AvatarCard from "../components/ProfileComps/AvatarCard";
import ListingsCard from "../components/ProfileComps/ListingCard";
import Listings from "../components/ProfileComps/Listings";

const MainContainer = styled.div`
  background-color: #fafdf3;
  width: 100vw;
  height: 100vh;
`;
const BelowNavBarContainer = styled.div`
  width: 100%;
  height: 90%;
  flex-direction: row;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const PersonalInfoContainer = styled.div`
  margin-top: 5vh;
  align-self: flex-start;
  width: 25vw;
  height: auto;
`;
const SubContainer = styled.div`
  width: 80vw;
  height: 80vh;
  display: flex;
  flex-direction: column;
  margin-right: 10px;
`;
const ProfileNavBar = styled.div`
  height: 5vh;
  display: flex;
  flex-direction: row;
`;

const InformationDisplayContainer = styled.div`
  border: 1px solid #c9c9c9;
  border-radius: 7px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
  height: 75vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function ProfilePage() {
  const { user } = useAuth();
  return (
    <MainContainer>
      <NavigationBar></NavigationBar>
      <BelowNavBarContainer>
        <PersonalInfoContainer>
          <AvatarCard></AvatarCard>
        </PersonalInfoContainer>
        <SubContainer>
          <ProfileNavBar>
            <ProfileLink link={"/profile"} text={"Listings"} />
            <ProfileLink link={"/profile/points"} text={"Points"} />
            <ProfileLink link={"/profile/reviews"} text={"Reviews"} />
            <ProfileLink link={"/profile/requests"} text={"Requests"} />
            <ProfileLink
              link={"/profile/rewards-claimed"}
              text={"Rewards Claimed"}
            />
          </ProfileNavBar>
          <InformationDisplayContainer>
            <Listings />
          </InformationDisplayContainer>
        </SubContainer>
      </BelowNavBarContainer>
    </MainContainer>
  );
}

export default ProfilePage;
