import {
    defineStore
} from 'pinia'
import {
    store
} from '../index'

export const useTokenStore = defineStore('lock', {
    state: () => {
        return {
            token: ''
        }
    },

    persist: {
        enabled: true,
    }
})

export const TokenStore = () => {
    return useTokenStore(store)
}