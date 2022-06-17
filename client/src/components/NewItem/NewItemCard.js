import { Button, Card, Grow, Slide, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import DescriptionField from "./DescriptionField";
import ItemTypeChip from "./ItemTypeChip";
import LocationField from "./LocationField";
import ReturnDateField from "./ReturnDateField";
import TelegramField from "./TelegramField";
import TitleField from "./TitleField";
import { TransitionGroup } from 'react-transition-group';
import { CentredDiv } from "../FlexDiv";
import ItemImages from "./ItemImages";
import { BACKEND_URL } from "../../database/const";
import { useAuth } from "../../database/auth";
import CategoryField from "./CategoryField";
import { HOME } from "../../pages/routes";
import { useNavigate } from "react-router-dom";

const FormDiv = styled(CentredDiv)`
    flex-direction: column;
    align-self: stretch;
`;
const GapDiv = styled(CentredDiv)`
    gap: 1rem;
`;
const GrowDown = styled(Grow)`
    transform-origin: center top;
`;
const NarrowBtn = styled(Button)`
    align-self: center;
`;

export const FlexCard = styled(Card)`
    display: flex;
    width: 75vw;
    flex-direction: column;
    align-items: stretch;
    align-self: center;
    padding: 1em 1ex;
    gap: 1rem;
    div:empty {
        margin: -1rem 0rem 0rem;
    }
    div:not([class]) {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        align-self: stretch;
        gap: 1rem;
    }
    p {
        text-align: center;
    }
    & .MuiFormControl-root {
        align-self: stretch;
    }
`;

export default function NewItemCard() {
    const [ isFormError, setIsFormError ] = useState(false);
    const [ isRequest, setIsRequest ] = useState(true);
    const [ category, setCategory ] = useState(18);
    const [ images, setImages ] = useState([]);
    const [ title, setTitle ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ location, setLocation ] = useState("");
    const [ returnDate, setReturnDate ] = useState(new Date());
    const [ isDateError, setIsDateError ] = useState(false);
    const [ telegramHandle, setTelegramHandle ] = useState("");
    const [ submitResultText, setSubmitResultText ] = useState("");
    const [ isSubmitError, setIsSubmitError ] = useState(false);

    const itemCardRef = useRef(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const backHome = () => {
        navigate(HOME, {replace: true});
    }

    const onSubmitItem = async (event) => {
        event.preventDefault();
        const date = new Date().toISOString();

        let object = {
            method: "POST"
        }
        if (isRequest) {
            object["headers"] = {'Content-Type': 'application/json'};
            object["body"] = JSON.stringify({
                category: category,
                title: title,
                description: description,
                location: location,
                telegram: telegramHandle,
                date: date,
                userName: user.displayName
            });
        } else {
            const itemData = new FormData();
            images.forEach((image) => {
                itemData.append("images", image);
            })
            itemData.append("deadline", returnDate);
            itemData.append("category", category);
            itemData.append("title", title);
            itemData.append("description", description);
            itemData.append("location", location);
            itemData.append("telegram", telegramHandle);
            itemData.append("date", date);
            itemData.append("userName", user.displayName);
            object["body"] = itemData;
        }
        const apiEndpoint = isRequest ? 
                `${BACKEND_URL}/api/items/addRequest` : 
                `${BACKEND_URL}/api/items/addListing`;
        const req = await fetch(apiEndpoint, object);
        const data = await req.json();
        if (data.status === 'ok') {
            setIsSubmitError(false);
            setSubmitResultText("Item " + (isRequest ? "requested" : "listed"));
        } else {
            setIsSubmitError(true);
            setSubmitResultText("Error occurred when creating item " + (isRequest ? "request" : "listing"));
        }
    }

    useEffect(() => {
        if (isDateError) {
            setIsFormError(true);
        } else {
            if (isFormError) {
                setIsFormError(false);
            }
        }
    }, [isFormError, isDateError]);

    return (
        <FlexCard component="form" onSubmit={onSubmitItem} ref={itemCardRef}>
            <Typography variant="h3">Item { isRequest ? 'Request' : 'Listing' }</Typography>
            <ItemTypeChip isRequest={isRequest} setIsRequest={setIsRequest} />
            <CategoryField category={category} setCategory={setCategory} />
            <TransitionGroup>
                { !isRequest &&
                    (<GrowDown timeout={750}>
                        <FormDiv>
                            <ItemImages images={images} setImages={setImages} />
                        </FormDiv>
                    </GrowDown>)
                }
            </TransitionGroup>
            <TitleField setTitle={setTitle} />
            <DescriptionField setDescription={setDescription} />
            <LocationField setLocation={setLocation} />
            <TelegramField setTelegramHandle={setTelegramHandle} />
            <TransitionGroup>
                { !isRequest && 
                    ( <GrowDown timeout={750}>
                        <FormDiv>
                            <ReturnDateField 
                              returnDate={returnDate}
                              setReturnDate={setReturnDate}
                              isDateError={isDateError}
                              setIsDateError={setIsDateError} />
                        </FormDiv>
                    </GrowDown> )
                }
            </TransitionGroup>
            <GapDiv>
                <NarrowBtn
                  variant="outlined"
                  color="secondary"
                  onClick={backHome}>
                      Back to Home
                </NarrowBtn>
                <NarrowBtn
                variant="contained"
                color={!!submitResultText ? (isSubmitError ? "error" : "success") : "secondary"}
                type="submit"
                disabled={isFormError}>
                    {isRequest ? "Request it" : "List it"}
                </NarrowBtn>
            </GapDiv>
            <TransitionGroup>
                { submitResultText && (
                    <Slide container={itemCardRef.current} direction="right" >
                        <Typography align="center" variant="caption">{ submitResultText }</Typography>
                    </Slide>
                )}
            </TransitionGroup>
        </FlexCard>
    );
}