import styled from "styled-components";
import { Card, Slide, Typography } from "@mui/material";
import { useRef, useState } from "react";
import MyTextField from "./MyTextField";
import DateField from "./DateField";
import RewardImage from "./RewardImage";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";
import { BACKEND_URL } from "../../../database/const";
import axios from "axios";
import { TransitionGroup } from "react-transition-group";
import RedemptionMethod from "./RedemptionMethod";
import CategoryField from "./CategoryField";

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
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("");
  const [date, setDate] = useState(new Date());
  const [isFormError, setIsFormError] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  const [isHowToRedeemError, setIsHowToRedeemError] = useState(false);
  const [isSubmitError, setIsSubmitError] = useState(false);
  const [image, setImage] = useState(null);
  const [redeemUrl, setRedeemUrl] = useState("");
  const [qrCodeImg, setQrCodeImg] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [resultText, setResultText] = useState("");
  const chosenImg = useRef(null);
  const qrCodeRef = useRef(null);
  const cardRef = useRef(null);

  const clearForm = () => {
    setCategory("");
    setTitle("");
    setDescription("");
    setPoints("");
    setDate(new Date());
    setIsFormError(false);
    setIsImageError(false);
    setIsHowToRedeemError(false);
    setIsSubmitError(false);
    setImage(null);
    chosenImg.current.value = null;
    setRedeemUrl("");
    setQrCodeImg(null);
    qrCodeRef.current.value = null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      // No reward image is selected
      setIsSubmitError(true);
      setIsImageError(true);
      setIsFormError(true);
      setResultText("Image of reward missing");
      setTimeout(() => {
        setIsSubmitError(false);
        setIsFormError(false);
        setResultText("");
      }, 6000);
      return;
    }
    if (!redeemUrl && !qrCodeImg) {
      // Didn't include a way to redeem this reward
      setIsSubmitError(true);
      setIsHowToRedeemError(true);
      setIsFormError(true);
      setResultText("Please provide a way to redeem this reward");
      setTimeout(() => {
        setIsSubmitError(false);
        setIsFormError(false);
        setResultText("");
      }, 6000);
      return;
    }
    // All fields are filled in
    setIsAdding(true);
    let formData = new FormData();
    formData.append("deadline", date);
    formData.append("category", category);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("claimed", false);
    formData.append("points", points);
    formData.append("image", image);
    if (redeemUrl) {
      formData.append("howToRedeemUrl", redeemUrl);
    }
    if (qrCodeImg) {
      formData.append("howToRedeemQrCode", qrCodeImg);
    }
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/reward/createreward`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setIsAdding(false);
      if (res.status !== 200) {
        const data = await res.json();
        console.log(data);
        setIsSubmitError(true);
        setResultText("Error occurred in the backend while adding reward");
      } else {
        clearForm();
        setResultText("Reward added into the system");
        setTimeout(() => {
          setResultText("");
        }, 6000);
      }
    } catch (err) {
      console.log(err);
      setIsAdding(false);
      setIsSubmitError(true);
      setResultText("Error occurred while adding reward");
    }
  };

  return (
    <CreateCard component="form" onSubmit={handleSubmit} ref={cardRef}>
      <Typography align="center" variant="h5" fontWeight="600" color="#eb8736">
        Add a reward
      </Typography>
      <MyTextField
        id="title"
        text={title}
        setText={setTitle}
        label="Title"
        placeholder="e.g. GrabFood $5 voucher"
      />
      <CategoryField
        id="category-field"
        category={category}
        setCategory={setCategory}
      />
      <MyTextField
        id="description"
        text={description}
        setText={setDescription}
        minRows={3}
        multiline={true}
        label="Description"
        placeholder="e.g. Input this voucher code during checkout to get $5 off your next GrabFood order!"
      />
      <MyTextField
        id="points"
        text={points}
        setText={setPoints}
        type="number"
        label="Points required"
        placeholder="e.g. 90"
      />
      <DateField
        date={date}
        setDate={setDate}
        isFormError={isFormError}
        setIsFormError={setIsFormError}
      />
      <RewardImage
        image={image}
        setImage={setImage}
        imageRef={chosenImg}
        isError={isImageError}
        setIsError={setIsImageError}
      />
      <RedemptionMethod
        isFormError={isFormError}
        setIsFormError={setIsFormError}
        redeemUrl={redeemUrl}
        setRedeemUrl={setRedeemUrl}
        qrCode={qrCodeImg}
        setQrCode={setQrCodeImg}
        qrCodeRef={qrCodeRef}
        isError={isHowToRedeemError}
        setIsError={setIsHowToRedeemError}
      />
      <SubmitButton
        type="submit"
        disabled={isFormError}
        color="primary"
        variant="contained"
        loading={isAdding}
        loadingPosition="start"
        startIcon={<AddIcon />}
      >
        Add
      </SubmitButton>
      <TransitionGroup>
        {resultText && (
          <Slide container={cardRef.current} direction="right">
            <Typography
              align="center"
              color={isSubmitError ? "error" : "success.main"}
            >
              {resultText}
            </Typography>
          </Slide>
        )}
      </TransitionGroup>
    </CreateCard>
  );
}
