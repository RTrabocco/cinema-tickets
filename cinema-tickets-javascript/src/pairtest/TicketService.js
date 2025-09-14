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

  /**
   * Handles the purchase of tickets and reservation of seats.
   * @param {number} accountId - account ID of purchaser.
   * @param {...TicketTypeRequest} ticketTypeRequests - ticket requests.
   * @returns {{
   *   totalTicketCount: number,
   *   totalTicketCost: number,
   *   totalSeats: number,
   * }} summary of the purchase.
   * @throws {InvalidPurchaseException} if validation fails.
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.#validateAccountId(accountId);
    this.#validateTicketTypeRequests(ticketTypeRequests);

    const ticketTotals = this.#calculateTicketTotal(ticketTypeRequests);

    new TicketPaymentService().makePayment(accountId, ticketTotals.totalTicketCost);
    new SeatReservationService().reserveSeat(accountId, ticketTotals.totalSeats);

    return ticketTotals;
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

  /**
   * Validates that an array of TicketTypeRequests have been provided.
   * @private
   * @param {TicketTypeRequest[]} requests - array of ticket type requests to be validated.
   * @throws {InvalidPurchaseException} if the array is not provided, or empty.
   */
  #validateTicketTypeRequests(requests) {
    if (!requests || requests.length === 0) {
      throw new InvalidPurchaseException("One or more TicketTypeRequests must be provided");
    }
  };

  /**
   * Calculates total tickets, total cost, and total seats for the given
   * TicketTypeRequests.
   * @private
   * @param {TicketTypeRequest[]} requests - validated ticket type requests.
   * @returns {{ totalTicketCount: number, totalTicketCost: number, totalSeats: number }}
   */
  #calculateTicketTotal(requests) {
    // Create a set of rules for tickets
    const rules = {
      ADULT: { price: env.TICKET_PRICE_ADULT, seats: 1 },
      CHILD: { price: env.TICKET_PRICE_CHILD, seats: 1 },
      INFANT: { price: env.TICKET_PRICE_INFANT, seats: 0 },
    };

    let ticketCounts = { ADULT: 0, CHILD: 0, INFANT: 0 };
    let totalTicketCost = 0;
    let totalSeats = 0;

    // Iterate through each TicketTypeRequest to calculate the totals.
    for (const request of requests) {
      const type = request.getTicketType();
      const count = request.getNoOfTickets();

      // Check if less than 0 tickets have been requested and throw an exception.
      if (count < 0) {
        throw new InvalidPurchaseException(`Ticket count for ${type} must be 0 or more, received ${count}`)
      };

      // Add the ticket count, cost, and seats to the totals bassed on type and
      // rules.
      totalTicketCost += count * rules[type]?.price;
      ticketCounts[type] += count;
      totalSeats += count * rules[type]?.seats;
    };

    const totalTicketCount = ticketCounts.ADULT + ticketCounts.CHILD + ticketCounts.INFANT;

    // Check if 0 total ticket have been requested and throw an exception.
    if (totalTicketCount === 0) {
      throw new InvalidPurchaseException("At least one ticket must be purchased");
    };
    
    // Check if total tickets requested exceeds maximum and throw an exception.
    if (totalTicketCount > env.TICKET_MAX_PURCHASE) {
      throw new InvalidPurchaseException(`Purchase exceeds maximum ticket allowance of ${env.TICKET_MAX_PURCHASE}, requested ${totalTicketCount}`);
    };

    // Check if child and infant tickets are being requested without an adult
    // ticket and throw an exception. 
    if (ticketCounts.ADULT === 0 && (ticketCounts.CHILD > 0 || ticketCounts.INFANT > 0)) {
      throw new InvalidPurchaseException("Child and infant tickets must be purchased with at least one adult ticket");
    };
    
    // Check if more infant tickets are requested than adult tickets and throw
    // an exception.
    if (ticketCounts.INFANT > ticketCounts.ADULT) {
      throw new InvalidPurchaseException(`Each infant must be accompanied by an adult`);
    };

    return {
      totalTicketCount,
      totalTicketCost,
      totalSeats,
    }
  };
}
