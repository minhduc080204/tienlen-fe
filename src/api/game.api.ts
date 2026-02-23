import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./endpoints";

export const gameApi = {
    createRoom: ()=>
        axiosClient.post<{roomId: number}>(API_ENDPOINTS.ROOM.CREATE)
        .then(res=>res.data),
    joinRoom: (roomId: number)=> 
        axiosClient.post(API_ENDPOINTS.ROOM.JOIN+'/'+roomId),
    quickJoin: ()=>
        axiosClient.post<{roomId: number, wsUrl: string}>(API_ENDPOINTS.ROOM.QUICK_JOIN)
        .then(res=>res.data)
}