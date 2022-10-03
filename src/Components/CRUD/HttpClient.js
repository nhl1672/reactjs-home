export default class HttpClient{
    get = (url) => {
       
        return fetch(url);
    }
}