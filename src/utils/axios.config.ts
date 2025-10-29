'use client'

import axios, { AxiosRequestConfig } from 'axios'

let mainUrl = process.env.NEXT_PUBLIC_MAIN_URL

// const mainUrl = "http://zuvy.navgurukul.org/"
// const mainUrl = "https://main-api.zuvy.org"
// const env_name = process.env.NODE_ENV

// const access_token = localStorage.getItem('access_token')
let headers: AxiosRequestConfig['headers'] = {
    'Content-Type': 'application/json',
}
// let merakiHeaders: AxiosRequestConfig['headers'] = {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${access_token}`,
// }

// if (process.env.NEXT_PUBLIC_ENV_NAME === 'STAGE') {
//     mainUrl = 'https://stage.api.zuvy.org'
// }

const api = axios.create({
    baseURL: mainUrl,
    headers,
})

if (typeof window !== 'undefined') {
    api.interceptors.request.use((config) => {
        // const token = localStorage.getItem('token')
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`
        // }
        const access_token = process.env.NEXT_PUBLIC_ADMIN_TOKEN;
        console.log("Access Token:", access_token);
        // const access_token = localStorage.getItem('access_token')
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`
        }
        return config
    })
}

// apiMeraki.interceptors.request.use((config) => {
//     // const token = localStorage.getItem('token')
//     // if (token) {
//     //     config.headers.Authorization = `Bearer ${token}`
//     // }
//     const access_token = process.env.ADMIN_TOKEN;
//     // const access_token = localStorage.getItem('access_token')
//     if (access_token) {
//         config.headers.Authorization = `Bearer ${access_token}`
//     }
//     return config
// })

// type FailedRequest = {
//     resolve: (access_token: string) => void
//     reject: (error: any) => void
// }

// let isRefreshing = false
// let failedQueue: FailedRequest[] = []

// const processQueue = (error: unknown, access_token = null) => {
//     failedQueue.forEach((prom) => {
//         if (error) {
//             prom.reject(error)
//         } else {
//             access_token && prom.resolve(access_token)
//         }
//     })

//     failedQueue = []
// }

// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config

//           // :no_entry_sign: Skip token refresh if on login route or calling login/refresh endpoints
//         const isLoginOrRefresh =
//             originalRequest.url.includes('/auth/login') ||
//             originalRequest.url.includes('/auth/refresh')

//         if (isLoginOrRefresh) {
//             return Promise.reject(error)
//         }

//         if (error.response?.status === 401 && !originalRequest._retry) {
//             if (isRefreshing) {
//                 return new Promise((resolve, reject) => {
//                     failedQueue.push({ resolve, reject })
//                 })
//                     .then((access_token) => {
//                         originalRequest.headers.Authorization = `Bearer ${access_token}`
//                         return api(originalRequest)
//                     })
//                     .catch((err) => Promise.reject(err))
//             }

//             originalRequest._retry = true
//             isRefreshing = true

//             try {
//                 const refresh_token = localStorage.getItem('refresh_token')
//                 const response = await axios.post(`${mainUrl}/auth/refresh`, {
//                     refresh_token,
//                 })

//                 const newAccessToken = response.data.access_token
//                 localStorage.setItem('access_token', newAccessToken)
//                 localStorage.setItem(
//                     'refresh_token',
//                     response?.data?.refresh_token
//                 )

//                 api.defaults.headers.common[
//                     'Authorization'
//                 ] = `Bearer ${newAccessToken}`
//                 processQueue(null, newAccessToken)
//                 return api(originalRequest)
//             } catch (err) {
//                 processQueue(err, null)
//                 // localStorage.clear()
//                 // document.cookie =
//                 //     'secure_typeuser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

//                 sessionModalStore.setShowModal(true)

//                 return Promise.reject(err)
//             } finally {
//                 isRefreshing = false
//             }
//         }

//         // Suppress default error toast by returning a handled error object
//         // return Promise.reject({ ...error, __handled: true })
//         return Promise.reject(error)
//     }
// )

export { api }
