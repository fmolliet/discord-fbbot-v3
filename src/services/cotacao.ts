import axios from "axios";

const cotacao = axios.create({
    baseURL: 'https://economia.awesomeapi.com.br/last'
});

export default cotacao;