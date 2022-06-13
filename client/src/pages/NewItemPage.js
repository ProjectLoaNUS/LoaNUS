import styled from "styled-components";
import { useState } from "react";
import { BACKEND_URL } from "../database/const";
import NewItemCard from "../components/NewItem/NewItemCard";

const MainContainer = styled.div`
  background-color: #fafdf3;
  min-height: 100vh;
`;

function NewItemPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState();

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleUpload = (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", selectedFile);
    fetch(`${BACKEND_URL}/api/item-upload`, {
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
      <NewItemCard />
    </MainContainer>
  );
}

export default NewItemPage;
