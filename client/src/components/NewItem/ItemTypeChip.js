import { Chip, Stack } from "@mui/material";
import styled from "styled-components";

const ChipStack = styled(Stack)`
`;

export default function ItemTypeChip(props) {
    const { isRequest, setIsRequest } = props;

    const handleOnClickRequest = () => {
        if (!isRequest) {
            setIsRequest(true);
        }
    }

    const handleOnClickList = () => {
        if (isRequest) {
            setIsRequest(false);
        }
    }
    
    return (
        <ChipStack direction="row" spacing={2}>
            <Chip color="primary" label="Request Item" variant={ isRequest ? "filled" : "outlined" } onClick={handleOnClickRequest} />
            <Chip color="primary" label="List Item" variant={ isRequest ? "outlined" : "filled" } onClick={handleOnClickList} />
        </ChipStack>
    );
}