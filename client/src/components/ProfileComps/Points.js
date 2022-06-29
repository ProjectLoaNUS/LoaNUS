import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import ButtonComponent from "../Button";
import styled from "styled-components";

const CoinsContainer = styled.div`
    border: 1px solid #c9c9c9;
    border-radius: 7px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 10px;
    align-items: center;
    padding: 5px;
`;
const CoinTitle = styled.h1`
    margin: 10px;
`;
const CoinsSubContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;
const StyledCoin = styled(CurrencyExchangeIcon)`
    color: #2d3c4a;
    margin-right: 10px;
    transform: scale(1.5);
    margin-left: 5px;
`;

export default function Points() {

    return (
        <>
            <CoinTitle>LoaNUS Coins</CoinTitle>
            <CoinsContainer>
                <CoinsSubContainer>
                <StyledCoin></StyledCoin>
                <h2>520 Coins</h2>
                </CoinsSubContainer>

                <ButtonComponent
                    size={"small"}
                    text={"Earn Coins"}
                    state={"primary"}
                    setHeight={"15px"} />
            </CoinsContainer>
        </>
    );
}