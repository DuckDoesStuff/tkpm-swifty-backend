declare namespace Express {
  export interface Request {
    merchantId?: number;
    merchant?: Merchant;
    customerId?: number;
    customer?: Customer;
  }
}