export interface WebhookType {
    _id?: string
    url: string
    secret: string
    bId: string
    events: {
      discountSent: boolean
      invoiceIssued: boolean
      postGenerated: boolean
      meetingScheduled: boolean
    }
    createdAt: string
  }
  
  export interface DeliveryType {
    _id: string
    webhookId: string
    url: string
    event: string
    payload: any
    success: boolean
    statusCode?: number
    message?: string
    timestamp: string
  }
  