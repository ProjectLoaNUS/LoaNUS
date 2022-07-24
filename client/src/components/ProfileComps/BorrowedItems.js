import { useEffect, useState } from "react";
import { useAuth } from "../../database/auth";
import { BACKEND_URL } from "../../database/const";
import { returnItemAction } from "../ItemDetails/detailsDialogActions";
import ItemList from "../ItemList/ItemList";

export default function BorrowedItems(props) {
    const { user } = useAuth();
    const [ borrowedTexts, setBorrowedTexts ] = useState(null);
    const [ borrowedImgs, setBorrowedImgs ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
      if (user) {
        if (borrowedImgs === null) {
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
        }
        if (borrowedTexts === null) {
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
        }
      }
    }, [user]);

    return (
      <ItemList
        isLoading={isLoading}
        noItemsText="No items borrowed. Check out recent item listings for some options!"
        buttonText="Return it"
        onClickAction={returnItemAction}
        itemImages={borrowedImgs}
        itemDatas={borrowedTexts}
        setItemDatas={setBorrowedTexts}
        onClickAction={returnItemAction}
        buttonText="Return it!" />
    );
}
