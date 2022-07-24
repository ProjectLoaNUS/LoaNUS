import { useCallback, useEffect, useState } from "react";
import ItemList from "../ItemList/ItemList";

export default function ListingsToApprove(props) {
    const {listingTexts, listingImgs, isLoading} = props;
    const [itemDatas, setItemDatas] = useState([]);
    const [itemImages, setItemImages] = useState([]);
    const [hasLoaded, setHasLoaded] = useState(false);

    const processListings = useCallback(async () => {
        if (!isLoading && (listingTexts && listingImgs)) {
            listingTexts.forEach((listing, index) => {
                const requestUsers = listing.borrowRequests;
                if (requestUsers?.length) {
                    setItemDatas(prevDatas => {
                        return [...prevDatas, listing];
                    });
                    setItemImages(prevImages => {
                        return [...prevImages, listingImgs[index]];
                    });
                }
            });
            setHasLoaded(true);
        }
    }, [isLoading, listingTexts, listingImgs]);
    useEffect(() => {
        processListings();
    }, [processListings]);

    return (
        <ItemList
          isLoading={!hasLoaded}
          noItemsText="No requests to borrow your items yet"
          itemImages={itemImages}
          itemDatas={itemDatas}
          setItemDatas={setItemDatas} />
    );
}