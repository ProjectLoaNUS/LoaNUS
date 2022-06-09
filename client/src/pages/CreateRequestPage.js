import styled from "styled-components";
import { useState } from "react";
import { BACKEND_URL } from "../database/const";
import InformationContainer from "../components/DesriptionCard";
import Bubbletea from "../assets/BubbleTea.png";
import Coffee from "../assets/Coffee.jpg";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";
import ButtonComponent from "../components/Button";

const MainContainer = styled.div`
  background-color: #fafdf3;
  min-height: 100vh;
`;

function CreateRequestPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const navigate = useNavigate();

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleUpload = (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", selectedFile);
    fetch(`${BACKEND_URL}/item-upload`, {
      method: "POST",
      body: formData,
    })
      .then((result) => {
        console.log("File Upload successful");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <MainContainer>
      <div>Create Request Page</div>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          onChange={(event) => setName(event.target.value)}
        ></input>
        <input
          type="text"
          onChange={(event) => setDescription(event.target.value)}
        ></input>
        <input type="file" onChange={changeHandler}></input>
        <button type="submit">Upload</button>
      </form>
      <InformationContainer title="Earn rewards and make a friend" desc="Do you own items which you seldom use? Loan it to your peers to earn
          attractive rewards and make a potential friend!" imgs={[Bubbletea, Coffee]}>
          <Stack direction="row">
            <ButtonComponent
              state={"primary"}
              onClick={() => {
                navigate("/view-rewards");
              }}
              text={"View Rewards"} />
            <ButtonComponent
              onClick={() => {
                navigate("/create-request");
              }}
              text={"Create Request"} />
          </Stack>
      </InformationContainer>
    </MainContainer>
  );
}

export default CreateRequestPage;
