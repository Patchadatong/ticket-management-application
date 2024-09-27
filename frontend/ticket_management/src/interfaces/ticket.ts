import { StatusInterface } from './status'

export interface TicketInterface {
    ID?: number;
    Title: string;
    Description: string;
    ContactInfo: string;
    CreatedAt: string;
    UpdatedAt: string;
    StatusID?: number;
    Status?:StatusInterface;
}