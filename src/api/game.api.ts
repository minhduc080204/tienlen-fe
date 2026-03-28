import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./endpoints";

export const gameApi = {
    createRoom: (betToken: number)=>
        axiosClient.post<{roomId: number, wsUrl: string}>(API_ENDPOINTS.ROOM.CREATE, {betToken})
            .then(res=>res.data),
    joinRoom: (roomId: number)=> 
        axiosClient.post<{roomId: number, wsUrl: string}>(API_ENDPOINTS.ROOM.JOIN, {roomId})
            .then(res=>res.data),
    quickJoin: ()=>
        axiosClient.post<{roomId: number, wsUrl: string}>(API_ENDPOINTS.ROOM.QUICK_JOIN)
            .then(res=>res.data)
}