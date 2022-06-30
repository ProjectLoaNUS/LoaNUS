import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../database/auth";
import { BACKEND_URL } from "../../database/const";
import ItemList from "../ItemList/ItemList";
import { Buffer } from 'buffer';
import { returnItemAction } from "../ItemDetails/detailsDialogActions";

const PaddedGrid = styled(Grid)`
  height: 100%;
  width: 100%;
  padding: 1ch 1rem;
  margin-top: 0;
  overflow-y: auto;
`;
const ItemGrid = styled(Grid)`
  .MuiCard-root {
    height: 100%;
    width: 100%;
  }
`;

export default function BorrowedItems(props) {
    const { user } = useAuth();
    const [ borrowedTexts, setBorrowedTexts ] = useState([]);
    const [ borrowedImgs, setBorrowedImgs ] = useState([]);

    async function binsToImgUrls(bins) {
      let imgs = [];
      bins.forEach((bin, index) => {
        const datas = bin.images.data;
        let urls = [];
        datas.forEach((data, i) => {
          const binary = Buffer.from(data.data);
          const blob = new Blob([binary.buffer], {type: bin.images.contentType[i]});
          const url = URL.createObjectURL(blob);
          urls[i] = url;
        });
        imgs[index] = urls;
      });
      setBorrowedImgs(imgs);
    }

    useEffect(() => {
      fetch(`${BACKEND_URL}/api/items/getBorrowedImgsOfUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id
        }),
      })
      .then(req => req.json())
      .then(data => {
        if (data.status === "ok") {
          binsToImgUrls(data.borrowedImgs);
        }
      });
      fetch(`${BACKEND_URL}/api/items/getBorrowedTextsOfUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id
        }),
      })
      .then(req => req.json())
      .then(data => {
        if (data.status === "ok") {
          setBorrowedTexts(data.borrowedTexts);
        }
      });
    }, [user]);

    function BorrowedItemsGrid(props) {
        const { children } = props;
    
        return (
          <ItemGrid item alignItems="stretch" justifyContent="center" xl={4} xs={4}>
            {children}
          </ItemGrid>
        );
      }

    return (
      <PaddedGrid container spacing={1}>
        <ItemList
          CardContainer={BorrowedItemsGrid}
          texts={borrowedTexts}
          setTexts={setBorrowedTexts}
          imageUrls={borrowedImgs}
          setimageUrls={setBorrowedImgs}
          buttonText="Return It!"
          onClickAction={returnItemAction} />
      </PaddedGrid>
    );
}