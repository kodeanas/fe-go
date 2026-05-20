import { Meta } from "@/services/Meta"

export interface BagStagingReguler {
  id: string
  name: string
  code: string
  status: string
  meta: Meta
}

export interface PayloadBagStagingReguler {
  rack_display_id: string
}

export interface QueryParamBagStagingReguler {
  search: string
  page: number
  limit: number
}
