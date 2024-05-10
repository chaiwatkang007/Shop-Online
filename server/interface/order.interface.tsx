export interface CreateOrder {
    od_id: number
    od_username: string
    od_name: string
    od_quan: number
    od_price: number
    od_status: string
    odpd_id : string
    od_time : string
}

export interface UpdateOrder {
    od_name: string
    od_quan: string
    od_price: string
    od_status: string
}

export interface Pending {
    od_id: number
    od_status: string
}

export interface Cancel {
    od_id: number
    od_status: string
}



