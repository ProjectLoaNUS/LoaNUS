import { BACKEND_URL } from "../database/const";
import { Buffer } from "buffer";

export const getProfilePicUrl = async (userId) => {
    let url = "";
    if (userId) {
        try {
            const res = await fetch(`${BACKEND_URL}/api/user/getProfilePic`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId
                })
            });
            const data = await res.json();
            if (data.status === "ok") {  
                const image = data.image;
                if (image.data && image.contentType) {
                    const binary = Buffer.from(image.data);
                    const blob = new Blob([binary.buffer], {type: image.contentType});
                    url = URL.createObjectURL(blob);
                }
            } else {
                console.log(`Error occurred while loading profile picture of user with ID "${userId}"`);
            }
        } catch (err) {
            console.log(err);
        }
    }
    return url;
}