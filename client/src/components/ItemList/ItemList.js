import ItemCard from "./ItemCard";
import Loading from "../../assets/loading.svg";
import { Buffer } from 'buffer';
import { useEffect, useState } from "react";
import LoadingItemList from "./LoadingItemList";
import styled from "styled-components";
import { Typography } from "@mui/material";

const NoItemsTypo = styled(Typography)`

`;

export default function ItemList(props) {
    const {
      CardContainer,
      isLoading,
      noItemsText,
      itemImages,
      itemImagesType,
      itemDatas,
      setItemDatas,
      buttonText,
      onActionDone,
      onClickAction
    } = props;
    const [ itemImageUrls, setItemImageUrls ] = useState([]);

    const processImages = async (imageBins, imageBinsType) => {
        imageBins.forEach((bin) => {
            const datas = bin.images.data;
            let urls = [];
            datas.forEach((data, i) => {
                const binary = imageBinsType ? Buffer.from(data, imageBinsType) : Buffer.from(data.data);
                const blob = new Blob([binary.buffer], {type: bin.images.contentType[i]});
                const url = URL.createObjectURL(blob);
                urls[i] = url;
            });
            setItemImageUrls((prevImageUrls) => {
                return [...prevImageUrls, urls];
            });
        });
    };

    useEffect(() => {
        if (itemImages?.length) {
            processImages(itemImages, itemImagesType);
        }
    }, [itemImages]);

    function ItemCardList(props) {
        const { itemsDatas } = props;

        return (
            <>
                { itemsDatas.map((itemData, index) => {
                    if (!itemData.borrowedBy) {

                        const removeItem = () => {
                            setItemDatas(prevDatas => {
                                return prevDatas.filter(otherData => otherData !== itemData);
                            });
                            if (setItemImageUrls) {
                                setItemImageUrls(prevUrls => {
                                    const thisUrl = prevUrls[index];
                                    return prevUrls.filter(other => other !== thisUrl);
                                });
                            }
                        }

                        function Item() {
                            return (
                                <ItemCard
                                    itemDetails={itemData}
                                    imageUrls={itemImages && ( itemImageUrls[index] || [Loading] )}
                                    onActionDone={onActionDone || removeItem}
                                    onClickAction={onClickAction}
                                    buttonText={buttonText} />
                            );
                        }

                        if (CardContainer) {
                            return <CardContainer key={index}><Item/></CardContainer>
                        }
                        return <Item key={index} />
                    }
                }) }
            </>
        );
    }

    return (
        <>
            { isLoading ?
                <LoadingItemList isItemRequest={!Boolean(itemImages)} /> :
                ( itemDatas.length ?
                    <ItemCardList itemsDatas={itemDatas} /> :
                    <NoItemsTypo variant="subtitle1">{noItemsText || "No items to display"}</NoItemsTypo> )
            }
        </>
    );
}