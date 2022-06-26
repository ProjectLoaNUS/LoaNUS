import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../database/auth";
import { BACKEND_URL } from "../../database/const";
import ItemList from "../ItemList/ItemList";

const PaddedGrid = styled(Grid)`
  height: 100%;
  width: 100%;
  padding: 0 1rem;
`;
const ItemGrid = styled(Grid)`
  .MuiCard-root {
    height: 100%;
    width: 100%;
  }
`;

export default function Listings(props) {
    const { user } = useAuth();
    const [ listingTexts, setListingTexts ] = useState([]);
    const [ listingImgs, setListingImgs ] = useState([]);

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
      setListingImgs(imgs);
    }

    useEffect(() => {
      const imgs = fetch(`${BACKEND_URL}/api/items/getListingsImgsOfUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email
        }),
      })
      .then(req => req.json())
      .then(data => {
        if (data.status === "ok") {
          binsToImgUrls(data.listingsImgs);
        }
      });
      const texts = fetch(`${BACKEND_URL}/api/items/getListingsTextsOfUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email
        }),
      })
      .then(req => req.json())
      .then(data => {
        if (data.status === "ok") {
          setListingTexts(data.listingsTexts);
        }
      });
    }, [user]);

    function ListingsGrid(props) {
        const { children, key } = props;
    
        return (
          <ItemGrid item key={key} alignItems="stretch" justifyContent="center" xl={4} xs={4}>
            {children}
          </ItemGrid>
        );
      }

    return (
      <PaddedGrid container spacing={1}>
        <ItemList
          CardContainer={ListingsGrid}
          texts={listingTexts}
          setTexts={setListingTexts}
          imageUrls={listingImgs}
          setimageUrls={setListingImgs} />
      </PaddedGrid>
    );
}