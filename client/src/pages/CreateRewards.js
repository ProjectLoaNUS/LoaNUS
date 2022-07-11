import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import ButtonComponent from "../components/Button";
import { BACKEND_URL } from "../database/const";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../database/auth";
import NavigationBar from "../components/NavBar/NavigationBar";

const MainContainer = styled.div`
  height: 100%;
  width: 100%;
`;

function CreateRewardPage() {
  const { user } = useAuth();
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(0);
  const [date, setDate] = useState("");
  const [image, setImage] = useState();
  const navigate = useNavigate();
  const handleSubmit = async () => {
    console.log(category);
    console.log(points);
    console.log(date);
    console.log(image);
    let formData = new FormData();
    formData.append("deadline", date);
    formData.append("category", category);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("claimed", false);
    formData.append("points", points);
    formData.append("image", image);
    console.log(Object.fromEntries(formData));

    await axios
      .post(`${BACKEND_URL}/api/reward/createreward`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (!user.admin) {
      navigate(-1);
    }
  });

  const handleFileSubmitChange = (event) => {
    const fileUploaded = event.target.files[0];
    setImage(fileUploaded);
  };
  console.log(user.admin);

  return (
    <MainContainer>
      <NavigationBar></NavigationBar>
      <form>
        <input
          type="text"
          placeholder="Vouchers/Beverages/Others"
          onChange={(e) => setCategory(e.target.value)}
        ></input>
        <input
          type="text"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <input
          type="text"
          placeholder="Description"
          size="50"
          onChange={(e) => setDescription(e.target.value)}
        ></input>
        <input
          type="number"
          placeholder="Points"
          onChange={(e) => setPoints(e.target.value)}
        ></input>
        <input
          type="datetime-local"
          onChange={(e) => setDate(e.target.value)}
        ></input>
        <input
          type="file"
          id="choose-image"
          name="image"
          accept="image/gif,image/jpeg,image/png,image/svg+xml"
          onChange={handleFileSubmitChange}
        />
        <ButtonComponent
          text={"Submit"}
          state="primary"
          size={"small"}
          onClick={handleSubmit}
          setFontsize={"0.45rem"}
        ></ButtonComponent>
      </form>
    </MainContainer>
  );
}

export default CreateRewardPage;
