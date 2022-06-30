import styled from "styled-components";
import NavigationBar from "../components/NavBar/NavigationBar";
import { useAuth } from "../database/auth";
import ProfileLink from "../components/ProfileComps/ProfileLink";
import AvatarCard from "../components/ProfileComps/AvatarCard";
import Listings from "../components/ProfileComps/Listings";
import {
  PROFILE,
  PROFILE_BORROWED,
  PROFILE_POINTS,
  PROFILE_REQUESTS,
  PROFILE_REVIEWS,
  PROFILE_REWARDS_CLAIMED
} from "./routes";
import { useLocation } from "react-router-dom";
import Points from "../components/ProfileComps/Points";
import Requests from "../components/ProfileComps/Requests";
import Reviews from "../components/ProfileComps/Reviews";
import Rewards from "../components/ProfileComps/Rewards";
import BorrowedItems from "../components/ProfileComps/BorrowedItems";

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
  justify-content: flex-start;
  align-items: center;
`;

function ProfilePage() {
  const { user } = useAuth();

  function InformationDisplay() {
    const location = useLocation();
    const path = location.pathname;
    switch(path) {
      case PROFILE_BORROWED:
        return <BorrowedItems />
      case PROFILE_POINTS:
        return <Points />
      case PROFILE_REQUESTS:
        return <Requests />
      case PROFILE_REVIEWS:
        return <Reviews />
      case PROFILE_REWARDS_CLAIMED:
        return <Rewards />
      case PROFILE:
      default:
        return <Listings />
    }
  }

  return (
    <MainContainer>
      <NavigationBar></NavigationBar>
      <BelowNavBarContainer>
        <PersonalInfoContainer>
          <AvatarCard></AvatarCard>
        </PersonalInfoContainer>
        <SubContainer>
          <ProfileNavBar>
            <ProfileLink link={PROFILE} text={"Listings"} />
            <ProfileLink link={PROFILE_BORROWED} text="Items Borrowed" />
            <ProfileLink link={PROFILE_POINTS} text={"Points"} />
            <ProfileLink link={PROFILE_REVIEWS} text={"Reviews"} />
            <ProfileLink link={PROFILE_REQUESTS} text={"Requests"} />
            <ProfileLink
              link={PROFILE_REWARDS_CLAIMED}
              text={"Rewards Claimed"}
            />
          </ProfileNavBar>
          <InformationDisplayContainer>
            <InformationDisplay />
          </InformationDisplayContainer>
        </SubContainer>
      </BelowNavBarContainer>
    </MainContainer>
  );
}

export default ProfilePage;
