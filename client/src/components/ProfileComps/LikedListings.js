import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../database/auth";
import { BACKEND_URL } from "../../database/const";
import ItemList from "../ItemList/ItemList";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../utils/jwt-config";

export default function LikedListings() {
    const {user} = useAuth();
    const [listingsTexts, setListingsTexts] = useState([]);
    const [listingsImgs, setListingsImgs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLikedListings = useCallback(async () => {
        if (user) {
            const token = jwt.sign(
                {id: user.id},
                JWT_SECRET,
                {expiresIn: JWT_EXPIRES_IN}
            );
            const res = await fetch(`${BACKEND_URL}/api/items/getlikeditems`, {
                method: "GET",
                headers: {
                    "x-auth-token": token
                }
            });
            const data = await res.json();
            if (data.status === "success") {
                fetch(`${BACKEND_URL}/api/items/getTheseListingsTexts`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": token
                    },
                    body: JSON.stringify({
                        listingIds: data.items
                    })
                })
                .then(res => {
                    res.json().then(data => {
                        if (res.status === 200) {
                            setListingsTexts(data.listingsData);
                            setIsLoading(false);
                        } else {
                            console.log(data.error);
                        }
                    });
                });
                fetch(`${BACKEND_URL}/api/items/getTheseListingsImgs`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": token
                    },
                    body: JSON.stringify({
                        listingIds: data.items
                    })
                })
                .then(res => {
                    res.json().then(data => {
                        if (res.status === 200) {
                            setListingsImgs(data.listingsImgs);
                        } else {
                            console.log(data.error);
                        }
                    });
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