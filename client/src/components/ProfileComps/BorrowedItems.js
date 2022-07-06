import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../database/auth";
import { BACKEND_URL } from "../../database/const";
import ItemList from "../ItemList/ItemList";

const PaddedGrid = styled(Grid)`
  align-self: stretch;
  min-height: 40%;
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
    const [ isLoading, setIsLoading ] = useState(true);

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
          setBorrowedImgs(data.borrowedImgs);
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
          setIsLoading(false);
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
          isLoading={isLoading}
          noItemsText="No items borrowed. Check out recent item listings for some options!"
          CardContainer={BorrowedItemsGrid}
          itemImages={borrowedImgs}
          itemDatas={borrowedTexts}
          setItemDatas={setBorrowedTexts} />
      </PaddedGrid>
    );
}