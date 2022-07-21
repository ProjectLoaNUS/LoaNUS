import { useEffect, useState } from "react";
import { useAuth } from "../../database/auth";
import { BACKEND_URL } from "../../database/const";
import ItemList from "../ItemList/ItemList";

export default function ListingsToApprove(props) {
    const { user } = useAuth();
    const [listingTexts, setListingTexts] = useState(null);
    const [listingImgs, setListingImgs] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
        if (listingImgs === null) {
            fetch(`${BACKEND_URL}/api/items/getBorrowRequestsImgsOfUser`, {
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
            fetch(`${BACKEND_URL}/api/items/getBorrowRequestsTextsOfUser`, {
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
          noItemsText="No requests to borrow your items yet"
          itemImages={listingImgs}
          itemDatas={listingTexts}
          setItemDatas={setListingTexts} />
    );
}