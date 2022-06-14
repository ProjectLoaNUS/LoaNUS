import { Button, Card, Grow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
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

const FormDiv = styled(CentredDiv)`
    flex-direction: column;
    align-self: stretch;
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
    const [ images, setImages ] = useState([]);
    const [ title, setTitle ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ location, setLocation ] = useState("");
    const [ returnDate, setReturnDate ] = useState(new Date());
    const [ isDateError, setIsDateError ] = useState(false);
    const [ telegramHandle, setTelegramHandle ] = useState("");

    const onSubmitItem = async (event) => {
        event.preventDefault();
        const itemData = new FormData();

        if (!isRequest) {
            images.forEach((image) => {
                itemData.append("images", image);
            })
            itemData.append("deadline", returnDate);
        }
        itemData.append("title", title);
        itemData.append("description", description);
        itemData.append("location", location);
        itemData.append("telegram", telegramHandle);
        const apiEndpoint = `${BACKEND_URL}/api/items/addListing`;
        const req = await fetch(apiEndpoint, {
            method: "POST",
            body: itemData
        });
        const data = await req.json();
        if (data.status === 'ok') {
            console.log("File Upload successful");
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
        <FlexCard component="form" onSubmit={onSubmitItem}>
            <Typography variant="h3">Item { isRequest ? 'Request' : 'Listing' }</Typography>
            <ItemTypeChip isRequest={isRequest} setIsRequest={setIsRequest} />
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
            <NarrowBtn
              variant="contained"
              color="secondary"
              type="submit"
              disabled={isFormError}>
                  {isRequest ? "Request it" : "List it"}
            </NarrowBtn>
        </FlexCard>
    );
}