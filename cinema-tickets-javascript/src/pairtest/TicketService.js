import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import parseEnv from '../../lib/parse-env.js';

const env = parseEnv();

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.#validateAccountId(accountId);
  }

  /**
   * Validates that a given account ID is a positive integer.
   * @private
   * @param {number} id - account ID to be validated.
   * @throws {InvalidPurchaseException} if account ID is not a valid positive integer.
   */
  #validateAccountId(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new InvalidPurchaseException(`Account ID must be greater than 0, received ${id}`);
    }
  };
}
