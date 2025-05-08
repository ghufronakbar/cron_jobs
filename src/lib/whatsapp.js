import axios, { AxiosError } from "axios";
import { FONNTE_API_KEY, TARGET_PHONE } from "../constants/index.js";

const whatsapp = axios.create({
    baseURL: "https://api.fonnte.com",
});

whatsapp.interceptors.request.use(
    (config) => {
        config.headers.Authorization = FONNTE_API_KEY;
        config.data.countryCode = "62";
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const sendWhatsapp = async (
    message,
) => {
    try {
        const date = new Date();
        const formattedDate = date.toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
            hour: "2-digit",
            minute: "2-digit",            
        });
        const response = await whatsapp.post("/send", {
            target: TARGET_PHONE,
            message,
        });        
        if (response.data?.status === false) {
            console.log("[Error] : ", response.data?.message);
        } else {
            console.log(`**********\nSending Message at ${formattedDate}:\n----------\n${message}\n----------\n`);
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log("Error sending WhatsApp message:", error?.response?.data);
        } else if (error instanceof Error) {
            console.log("Error sending WhatsApp message:", error.message);
        }
        console.log(error);
    }
};
