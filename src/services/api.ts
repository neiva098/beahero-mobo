import axios from 'axios'

const api = axios.create({
    baseURL: 'http://192.168.0.19:3333'
})

export const loadIncidents = async (page: number) => {
    return await api.get('incidents', {
        params: {  page }
    })
}