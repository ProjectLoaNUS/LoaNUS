import { Box } from "@mui/material";
import ItemCard from "./ItemCard";
import Loading from "../../assets/loading.svg";
import styled from "styled-components";

const ItemsBox = styled(Box)`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
`;

const ImageDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    img {
        height: 35vh
    }
`;

export default function ItemList(props) {
    const { texts, setTexts, imgUrls, setImgUrls } = props;

    return (
        <ItemsBox>
            { texts ? 
                (texts.map((text, index) => {
                    function Image() {
                        return (
                            <ImageDiv>
                                <img src={ imgUrls[index] } height="35vh" />
                            </ImageDiv>
                        );
                    }

                    function LoadingDisplay() {
                        return (
                            <img src={ Loading } />
                        );
                    }

                    return <ItemCard 
                                key={ index } 
                                title={text.name} 
                                component={ Image || LoadingDisplay } 
                                description={text.desc} />
                })) : 
                "Loading..." 
            }
        </ItemsBox>
    );
}