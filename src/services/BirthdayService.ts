import axios from "axios";

const birthday = axios.create({
    baseURL: process.env.BIRTHDAY_BASEURL,
    auth: {
        username: process.env.BIRTHDAY_USERNAME ?? "",
        password: process.env.BIRTHDAY_PASSWORD ?? ""
    }
});

export default birthday;