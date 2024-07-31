import {
    defineStore
} from 'pinia'
import {
    store
} from '../index'

export const usefbStore = defineStore('fbData', {
    state: () => {
        return {
            fbData:{}
        }
    },

    persist: {
        enabled: true,
    }
})

export const FBStore = () => {
    return usefbStore(store)
}