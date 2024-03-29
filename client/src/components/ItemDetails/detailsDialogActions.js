import { BACKEND_URL } from "../../database/const";

export const requestBorrowAction = (setError, setIsButtonEnabled, setOpen, onActionDone, itemId, user) => {
    return async () => {
        const REQ_RES_TEXT = [
            "Requested to borrow item!",
            "Already borrowed by another user",
            "You already requested to borrow",
            "Cannot find this item in database",
            "Cannot authenticate you",
            "Cannot identify item's owner"
        ];
    
        if (user) {
            const url = `${BACKEND_URL}/api/items/requestBorrowItem`;
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
                setError(true, REQ_RES_TEXT[data.statusCode]);
            } else {
                setError(false, REQ_RES_TEXT[data.statusCode]);
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
            setError(true, "Please log in before requesting to borrow this");
        }
    }
}

export const approveBorrowAction = (setError, setOpen, onActionDone, itemId, user) => {
    return async () => {
        const APPROVE_RES_TEXT = [
            "Item lent to user!",
            "Already borrowed by another user(somehow)",
            "Did you borrow this item(somehow)?",
            "Cannot find this item in database",
            "Cannot authenticate you"
        ];
    
        if (user) {
            const url = `${BACKEND_URL}/api/items/approveBorrowItem`;
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
                setError(true, APPROVE_RES_TEXT[data.statusCode]);
            } else {
                setError(false, APPROVE_RES_TEXT[data.statusCode]);
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
            setError(true, "Cannot identify the user being approved");
        }
    }
}

export const denyBorrowAction = (setError, setOpen, onActionDone, itemId, user) => {
    return async () => {
        const DENY_RES_TEXT = [
            "Item request rejected!",
            "Cannot authenticate you",
            "Cannot find this item in database"
        ];
    
        if (user) {
            const url = `${BACKEND_URL}/api/items/denyBorrowItem`;
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
                setError(true, DENY_RES_TEXT[data.statusCode]);
            } else {
                setError(false, DENY_RES_TEXT[data.statusCode]);
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
            setError(true, "Cannot identify the user being rejected");
        }
    }
}

export const isUserListingRelated = (user, listing) => {
    if (user && (listing && listing.listedBy)) {
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
                setError(true, "Error while deleting item listing");
            } else {
                setError(false, "Item listing deleted");
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

export const deleteRequestAction = (setError, setIsButtonEnabled, setOpen, onActionDone, itemId, user) => {
    return async () => {
        if (itemId) {    
            const url = `${BACKEND_URL}/api/items/rmRequest`;
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
                setError(true, "Error while deleting item request");
            } else {
                setError(false, "Item request deleted");
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
            setError(true, "Item request is invalid");
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