import axios from "axios";

const birthday = axios.create({
    baseURL: process.env.MEETING_BASEURL,
});

export default birthday;