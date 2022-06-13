import { Card, Grow, Typography } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import DescriptionField from "./DescriptionField";
import ItemTypeChip from "./ItemTypeChip";
import LocationField from "./LocationField";
import ReturnDateField from "./ReturnDateField";
import TelegramField from "./TelegramField";
import TitleField from "./TitleField";
import { TransitionGroup } from 'react-transition-group';
import { CentredDiv } from "../FlexDiv";

const FormDiv = styled(CentredDiv)`
    flex-direction: column;
    align-self: stretch;
`;
const GrowDown = styled(Grow)`
    transform-origin: center top;
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
    const [ isRequest, setIsRequest ] = useState(true);
    const [ title, setTitle ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ location, setLocation ] = useState("");
    const [ returnDate, setReturnDate ] = useState(new Date());
    const [ telegramHandle, setTelegramHandle ] = useState("");

    return (
        <FlexCard>
            <Typography variant="h3">Item { isRequest ? 'Request' : 'Listing' }</Typography>
            <ItemTypeChip isRequest={isRequest} setIsRequest={setIsRequest} />
            <TitleField setTitle={setTitle} />
            <DescriptionField setDescription={setDescription} />
            <LocationField setLocation={setLocation} />
            <TelegramField setTelegramHandle={setTelegramHandle} />
            <TransitionGroup>
                { !isRequest && 
                    ( <GrowDown timeeout={1000}>
                        <FormDiv>
                            <ReturnDateField returnDate={returnDate} setReturnDate={setReturnDate} />
                        </FormDiv>
                    </GrowDown> )
                }
            </TransitionGroup>
        </FlexCard>
    );
}