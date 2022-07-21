import { useEffect, useState } from "react";
import { useAuth } from "../../database/auth";
import { BACKEND_URL } from "../../database/const";
import ItemList from "../ItemList/ItemList";

export default function AllListings(props) {
  const { user } = useAuth();
  const [listingTexts, setListingTexts] = useState(null);
  const [listingImgs, setListingImgs] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      if (listingImgs === null) {
        fetch(`${BACKEND_URL}/api/items/getListingsImgsOfUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.id,
          }),
        })
        .then((req) => req.json())
        .then((data) => {
          if (data.status === "ok") {
            setListingImgs(data.listingsImgs);
          }
        });
      }
      if (listingTexts === null) {
        fetch(`${BACKEND_URL}/api/items/getListingsTextsOfUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.id,
          }),
        })
        .then((req) => req.json())
        .then((data) => {
          if (data.status === "ok") {
            setListingTexts(data.listingsTexts);
            setIsLoading(false);
          }
        });
      }
    }
  }, [user]);

  return (
    <ItemList
      isLoading={isLoading}
      noItemsText="No item listings yet. Create one?"
      itemImages={listingImgs}
      itemDatas={listingTexts}
      setItemDatas={setListingTexts}
    />
  );
}
