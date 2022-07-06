import ItemCard from "./ItemCard";
import Loading from "../../assets/loading.svg";
import { Buffer } from 'buffer';
import { useEffect, useState } from "react";

export default function ItemList(props) {
    const { CardContainer, itemImages, itemDatas, setItemDatas, buttonText, onActionDone, onClickAction } = props;
    const [ itemImageUrls, setItemImageUrls ] = useState([]);

    const processImages = async (imageBins) => {
        imageBins.forEach((bin) => {
            const datas = bin.images.data;
            let urls = [];
            datas.forEach((data, i) => {
                const binary = Buffer.from(data.data);
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
            processImages(itemImages);
        }
    }, [itemImages]);

    return (
        <>
            { itemDatas?.length ? (itemDatas.map((itemData, index) => {
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
            })) : 
                'Loading'
            }
        </>
    );
}