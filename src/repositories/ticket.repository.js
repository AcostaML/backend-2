import { TicketDAO } from '../dao/mongo/ticket.dao.js';

export class TicketRepository {
  constructor() {
    this.dao = new TicketDAO();
  }

  createTicket(data) {
    return this.dao.create(data);
  }
}
