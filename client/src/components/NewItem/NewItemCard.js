import { Card, Typography } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import ItemTypeChip from "./ItemTypeChip";
import TitleField from "./TitleField";

export const FlexCard = styled(Card)`
    display: flex;
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
        align-self: center;
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
    const [ returnDate, setReturnDate ] = useState("");
    const [ telegramHandle, setTelegramHandle ] = useState("");

    return (
        <FlexCard>
            <Typography variant="h3">Item { isRequest ? 'Request' : 'Listing' }</Typography>
            <ItemTypeChip isRequest={isRequest} setIsRequest={setIsRequest} />
            <TitleField setTitle={setTitle} />
        </FlexCard>
    );
}