export interface CustomersDetailResponse {
    data: Customer
    message: string
  }
  
  export interface Customer {
    id: number
    name: string
    phone_number: string
    country_origin: string
    email: string
    identity_file: string[]
    created_at: string
    updated_at: string
    deleted_at: any
  }
  