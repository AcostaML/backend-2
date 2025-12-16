import { TicketModel } from '../models/ticket.model.js';

export class TicketDAO {
  create = (data) => TicketModel.create(data);
}
