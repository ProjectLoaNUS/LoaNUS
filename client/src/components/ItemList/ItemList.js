import ItemCard from "./ItemCard";
import Loading from "../../assets/loading.svg";
import { Buffer } from "buffer";
import { useEffect, useState } from "react";
import LoadingItemList from "./LoadingItemList";
import styled from "styled-components";
import { Typography } from "@mui/material";

const ItemsGrid = styled.div`
  --grid-layout-gap: 1ch;
  --grid-column-count: 4;
  --grid-item--min-width: 240px;

  --gap-count: calc(var(--grid-column-count) - 1);
  --total-gap-width: calc(var(--gap-count) * var(--grid-layout-gap));
  --grid-item--max-width: calc(
    (100% - var(--total-gap-width)) / var(--grid-column-count)
  );
  --grid-item-width: max(
    var(--grid-item--min-width),
    var(--grid-item--max-width)
  );

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--grid-item-width), 1fr));
  grid-auto-rows: calc(var(--grid-item-width) * 6 / 5);
  grid-gap: var(--grid-layout-gap);
  align-items: stretch;
  justify-items: stretch;
  padding: 1ch;
  height: 100%;
  overflow-y: auto;
`;
const NoItemsTypo = styled(Typography)`
  padding: 1rem 0;
`;

export default function ItemList(props) {
  const {
    ListContainer,
    CardContainer,
    isLoading,
    noItemsText,
    itemImages,
    itemImagesType,
    itemDatas,
    setItemDatas,
    buttonText,
    onActionDone,
    onClickAction,
  } = props;
  const [itemImageUrls, setItemImageUrls] = useState([]);

  const processImages = async (imageBins, imageBinsType) => {
    imageBins.forEach((bin) => {
      const datas = bin.images.data;
      let urls = [];
      datas.forEach((data, i) => {
        const binary = imageBinsType
          ? Buffer.from(data, imageBinsType)
          : Buffer.from(data.data);
        const blob = new Blob([binary.buffer], {
          type: bin.images.contentType[i],
        });
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
        {itemsDatas.map((itemData, index) => {
          if (!itemData.borrowedBy) {
            const removeItem = () => {
              setItemDatas((prevDatas) => {
                return prevDatas.filter((otherData) => otherData !== itemData);
              });
              if (setItemImageUrls) {
                setItemImageUrls((prevUrls) => {
                  const thisUrl = prevUrls[index];
                  return prevUrls.filter((other) => other !== thisUrl);
                });
              }
            };

            function Item() {
              return (
                <ItemCard
                  itemDetails={itemData}
                  imageUrls={itemImages && (itemImageUrls[index] || [Loading])}
                  onActionDone={onActionDone || removeItem}
                  onClickAction={onClickAction}
                  buttonText={buttonText}
                />
              );
            }

            if (CardContainer) {
              return (
                <CardContainer key={index}>
                  <Item />
                </CardContainer>
              );
            }
            return <Item key={index} />;
          }
        })}
      </>
    );
  }

  function ItemListContainer(props) {
    const { children } = props;

    if (ListContainer) {
      return <ListContainer>{children}</ListContainer>;
    }
    return <ItemsGrid>{children}</ItemsGrid>;
  }

  return (
    <>
      {isLoading ? (
        <ItemListContainer>
          <LoadingItemList isItemRequest={!Boolean(itemImages)} />
        </ItemListContainer>
      ) : itemDatas.length ? (
        <ItemListContainer>
          <ItemCardList itemsDatas={itemDatas} />
        </ItemListContainer>
      ) : (
        <NoItemsTypo variant="subtitle1">
          {noItemsText || "No items to display"}
        </NoItemsTypo>
      )}
    </>
  );
}
