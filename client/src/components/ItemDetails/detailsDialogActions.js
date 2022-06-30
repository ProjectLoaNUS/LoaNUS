import { BACKEND_URL } from "../../database/const";

export const borrowAction = (setError, setIsButtonEnabled, setOpen, onActionDone, itemId, user) => {
    return async () => {
        const BORROW_RES_CODES = {
            SUCCESS: 0,
            BORROWED_BY_ANOTHER: 1,
            ALR_BORROWED_BY_U: 2,
            NO_SUCH_ITEM: 3,
            NO_SUCH_USER: 4
        };
        const BORROW_RES_TEXT = [
            "Item borrowed!",
            "Already borrowed by another user",
            "Already borrowed by you",
            "Cannot find this item in database",
            "Cannot authenticate you"
        ];
    
        if (user) {
            const url = `${BACKEND_URL}/api/items/borrowItem`;
            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: user.id,
                    itemId: itemId
                })
            });
            const data = await req.json();
            if (data.status !== "ok") {
                setError(true, "");
                console.log(`Error occurred in backend while marking item ${itemId} as borrowed`);
            } else {
                setError(false, BORROW_RES_TEXT[data.statusCode]);
                setIsButtonEnabled(false);
                setTimeout(() => {
                    setOpen(false);
                }, 5000);
                if (onActionDone) {
                    setTimeout(() => {
                        onActionDone();
                    }, 7000);
                }
            }
        } else {
            setError(true, "Please log in before borrowing");
        }
    }
}

export const isUserListingRelated = (user, listing) => {
    if (listing && listing.listedBy) {
        return user.id === listing.listedBy.id;
    }
    return false;
}

export const deleteListingAction = (setError, setIsButtonEnabled, setOpen, onActionDone, itemId, user) => {
    return async () => {
        if (itemId) {    
            const url = `${BACKEND_URL}/api/items/rmListing`;
            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    itemId: itemId
                })
            });
            const data = await req.json();
            if (!data.status === "ok") {
                setError(true, "Error while deleting listing");
            } else {
                setError(false, "Listing deleted");
                setIsButtonEnabled(false);
                setTimeout(() => {
                    setOpen(false);
                }, 5000);
                if (onActionDone) {
                    setTimeout(() => {
                        onActionDone();
                    }, 7000);
                }
            }
        } else {
            setError(true, "Item listing is invalid");
        }
    }
}

export const returnItemAction = (setError, setIsButtonEnabled, setOpen, onActionDone, itemId, user) => {
    return async () => {
        const RETURN_STATUS_TEXTS = [
            "Item returned",
            "Cannot find you in database",
            "Cannot find this item in database",
            "Item not lent to anyone",
            "Item lent to another user",
            "You did not borrow this item",
            "Error identifying item owner"
        ];

        if (itemId && user.id) {    
            const url = `${BACKEND_URL}/api/items/returnItem`;
            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    itemId: itemId,
                    userId: user.id
                })
            });
            const data = await req.json();
            if (!data.status === "ok") {
                setError(true, RETURN_STATUS_TEXTS[data.statusCode]);
            } else {
                setError(false, RETURN_STATUS_TEXTS[data.statusCode]);
                setIsButtonEnabled(false);
                setTimeout(() => {
                    setOpen(false);
                }, 5000);
                if (onActionDone) {
                    setTimeout(() => {
                        onActionDone();
                    }, 7000);
                }
            }
        } else if (!itemId) {
            setError(true, "Item listing is invalid");
        } else {
            setError(true, "User is invalid. Please logout and login again");
        }
    }
}