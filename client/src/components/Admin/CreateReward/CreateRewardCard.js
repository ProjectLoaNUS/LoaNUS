import styled from "styled-components";
import { Card, Typography } from "@mui/material";
import { useRef, useState } from "react";
import MyTextField from "./MyTextField";
import DateField from "./DateField";
import RewardImage from "./RewardImage";
import ButtonComponent from "../../Button";
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import { BACKEND_URL } from "../../../database/const";
import axios from "axios";

const CreateCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: max(80%, 300px);
  align-self: center;
  padding: 0.5em;
  gap: 0.5em;
`;
const SubmitButton = styled(LoadingButton)`
  align-self: center;
`;

export default function CreateRewardCard() {
    const [ category, setCategory ] = useState("");
    const [ title, setTitle ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ points, setPoints ] = useState("");
    const [ date, setDate ] = useState(new Date());
    const [ isFormError, setIsFormError ] = useState(false);
    const [ image, setImage ] = useState(null);
    const [ isAdding, setIsAdding ] = useState(false);
    const [ resultText, setResultText ] = useState("");
    const chosenImg = useRef(null);

    const clearForm = () => {
        setCategory("");
        setTitle("");
        setDescription("");
        setPoints("");
        setDate(new Date());
        setIsFormError(false);
        setImage(null);
        chosenImg.current.value = null;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsAdding(true);
        let formData = new FormData();
        formData.append("deadline", date);
        formData.append("category", category);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("claimed", false);
        formData.append("points", points);
        formData.append("image", image);
        try {  
          const res = await axios.post(`${BACKEND_URL}/api/reward/createreward`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setIsAdding(false);
          if (res.status !== 200) {
            const data = await res.json();
            console.log(data);
            setResultText("Error occurred in the backend while adding reward");
          } else {
            clearForm();
            setResultText("Reward added into the system");
          }
        } catch (err) {
          console.log(err);
          setResultText("Error occurred while adding reward");
        }
    };

    return (
        <CreateCard
          component="form" 
          onSubmit={handleSubmit}>
            <Typography align="center" variant="h5">Add a reward</Typography>
            <MyTextField
              id="title"
              text={title}
              setText={setTitle}
              label="Title"
              placeholder="e.g. GrabFood $5 voucher" />
            <MyTextField
              id="category"
              text={category}
              setText={setCategory}
              label="Category"
              placeholder="Vouchers/Beverages/Others" />
            <MyTextField
              id="description"
              text={description}
              setText={setDescription}
              minRows={3}
              multiline={true}
              label="Description"
              placeholder="e.g. Input this voucher code during checkout to get $5 off your next GrabFood order!" />
            <MyTextField
              id="points"
              text={points}
              setText={setPoints}
              label="Points required"
              placeholder="e.g. 90" />
            <DateField
              date={date}
              setDate={setDate}
              isFormError={isFormError}
              setIsFormError={setIsFormError} />
            <RewardImage
              image={image}
              setImage={setImage}
              imageRef={chosenImg} />
            <SubmitButton
              type="submit"
              disabled={isFormError}
              color="primary"
              variant="contained"
              loading={isAdding}
              loadingPosition="start"
              startIcon={<AddIcon />} >
                Add
            </SubmitButton>
            {resultText && 
                <Typography
                  align="center"
                  color={isFormError ? "error" : "success.main"}>
                    {resultText}
                </Typography>
            }
        </CreateCard>
    );
}