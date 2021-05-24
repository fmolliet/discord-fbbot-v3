import axios from "axios";

const bcbsite = axios.create({
    baseURL: 'https://www.bcb.gov.br/api/servico/sitebcb'
});

export default bcbsite;