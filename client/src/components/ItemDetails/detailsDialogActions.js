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
                    email: user.email,
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
                setTimeout(() => {
                    onActionDone();
                }, 7000);
            }
        } else {
            setError(true, "Please log in before borrowing");
        }
    }
}