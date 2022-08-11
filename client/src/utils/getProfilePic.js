import { BACKEND_URL } from "../database/const";
import { Buffer } from "buffer";
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from "./jwt-config";

export const getProfilePicUrl = async (userId) => {
    let url = "";
    if (userId) {
        try {
            const token = jwt.sign(
                {id: userId},
                JWT_SECRET,
                {expiresIn: JWT_EXPIRES_IN}
            );
            const res = await fetch(`${BACKEND_URL}/api/user/getProfilePic`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token
                }
            });
            const data = await res.json();
            if (res.status === 200) {
                const image = data.image;
                if (image.data && image.contentType) {
                    const binary = Buffer.from(image.data);
                    const blob = new Blob([binary.buffer], {type: image.contentType});
                    url = URL.createObjectURL(blob);
                } else if (image.url) {
                    url = image.url;
                }
            } else {
                console.log(`Error occurred while loading profile picture of user with ID "${userId}"`);
                console.log(data.error);
            }
        } catch (err) {
            console.log(err);
        }
    }
    return url;
}