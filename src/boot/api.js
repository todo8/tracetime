import axios from 'axios';

let Token = localStorage['token'] || '' ;

// axios.defaults.withCredentials = true;  //或导致cors 异常;
axios.defaults.timeout = 6000; //http默认超时时间是60秒
axios.defaults.retry = 3; //在main.js设置全局的请求次数，请求的间隙
axios.defaults.retryDelay = 1000;
axios.defaults.baseURL = 'http://localhost:8401';
// axios.defaults.baseURL = 'http://localhost:8401';
axios.defaults.headers.common['token'] = Token;

let Api = {
    setToken : (token)=>{
        Token = token ;
        axios.defaults.headers.common['token'] = token;
        localStorage['token'] = token ;
    },    
    loginGet : params => axios.get(`/api/login`, { "params": params }).then(r => r.data).catch(e=>{}),
    actionGet : params => axios.get(`/api/action`, { "params": params }).then(r => r.data).catch(e=>{}),
    actionPost : params => axios.post(`/api/action`, params).then(r => r.data).catch(e=>{}),
    configGet : params => axios.get(`/api/config`, { "params": params }).then(r => r.data).catch(e=>{}),
    configPost : params => axios.post(`/api/config`, params).then(r => r.data).catch(e=>{}),
}


// configGet : params => axios.get(`/api/config`, { "params": params }).then(r => r.data).catch(e=>{}),
// configPost : data => axios.post(`/api/config`, data).then(r => r.data).catch(e=>{}) ,
// configPut : params => axios.put(`/api/config`, params).then(r => r.data).catch(e=>{}),
// configDel : params => axios.delete(`/api/config`, { "params": params }).then(r => r.data).catch(e=>{}),

// export const apiGet = params => {
//     return axios.get(`api/action`, { "params": params }).then(r => r.data).catch(e=>{}) ;
// };
// export const apiPost = params => {
//     return axios.post(`/checkuser`, params).then(r => r.data).catch(e=>{});
// };
// export const apiSet = params => {   
//     return axios.put(`${ base }/api/z43friend`, params).then(r => r.data).catch(e=>{}) ;
// };
// export const apiDel = params => {
//     return axios.delete(`${ base }/api/z43friend`, { "params": params }).then(r => r.data).catch(e=>{}) ;
// };

export default Api ;
// export default { loginGet , actionGet , actionPost ,configGet , configPost , setToken  }
