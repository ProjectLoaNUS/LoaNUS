import { Avatar, Skeleton, Stack } from "@mui/material";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1ch;
    padding: 1ch;
    justify-content: space-between;
`;
const FlexStack = styled(Stack)`
    display: flex;
    flex: 0 0 auto;
`;
const GrowStack = styled(FlexStack)`
    flex: 1 1 auto;
    align-items: stretch;
`;

export default function LoadingItemCard(props) {
    const {isItemRequest} = props;

    return (
        <Container>
            <FlexStack direction="row" sx={{gap: "1ch"}}>
                <Skeleton variant="circular" sx={{flex: "0 0 auto"}}>
                    <Avatar />
                </Skeleton>
                <GrowStack direction="column">
                    <Skeleton variant="text" />
                    <Skeleton variant="text" sx={{width: "50%", alignSelf: "flex-start"}} />
                </GrowStack>
            </FlexStack>
            { !isItemRequest && <Skeleton variant="rectangle" sx={{flex: "1 1 auto"}} /> }
            <FlexStack direction="row" sx={{gap: "1ch"}}>
                <Skeleton variant="circular" width={24} height={24} sx={{flex: "0 0 auto"}} />
                <Skeleton variant="text" sx={{flex: "1 1 auto"}} />
            </FlexStack>
        </Container>
    );
}