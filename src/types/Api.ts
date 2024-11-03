export interface Medicine {
    id: number,
    name: string,
    price: number,
    is_discontinued: boolean,
    manufacturer_name: string,
    type: string,
    pack_size_label: string,
    short_composition1: string,
    short_composition2: string | null,
}

export interface MedicineList {
    page: number,
    size: number,
    total: number,
    medicines: Medicine[]
}