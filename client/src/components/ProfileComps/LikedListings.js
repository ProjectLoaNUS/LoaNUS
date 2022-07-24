import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../database/auth";
import { BACKEND_URL } from "../../database/const";
import ItemList from "../ItemList/ItemList";

export default function LikedListings() {
    const {user} = useAuth();
    const [listingsTexts, setListingsTexts] = useState([]);
    const [listingsImgs, setListingsImgs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLikedListings = useCallback(async () => {
        if (user) {
            const res = await fetch(`${BACKEND_URL}/api/items/getlikeditems?userId=` + user.id, {
                method: "GET"
            });
            const data = await res.json();
            if (data.status === "success") {
                fetch(`${BACKEND_URL}/api/items/getTheseListingsTexts`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        listingIds: data.items
                    })
                })
                .then(res => res.json())
                .then(data => {
                    setListingsTexts(data.listingsData);
                    setIsLoading(false);
                });
                fetch(`${BACKEND_URL}/api/items/getTheseListingsImgs`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        listingIds: data.items
                    })
                })
                .then(res => res.json())
                .then(data => {
                    setListingsImgs(data.listingsImgs);
                });
            } else {
                console.log("LikedListings: Error while fetching liked listings data from backend");
            }
        }
    }, [user]);
    useEffect(() => {
        fetchLikedListings();
    }, [fetchLikedListings]);

    return (
        <ItemList
          isLoading={isLoading}
          noItemsText="No item listings liked yet. Browse some items?"
          itemImages={listingsImgs}
          itemDatas={listingsTexts}
          setItemDatas={setListingsTexts}
          buttonText="Borrow it" />
    );
}