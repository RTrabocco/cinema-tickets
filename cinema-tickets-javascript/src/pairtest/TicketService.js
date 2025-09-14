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
    this.#validateTicketTypeRequests(ticketTypeRequests);

    const ticketTotals = this.#caluclateTicketTotal(ticketTypeRequests);
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
   * @returns {{ totalTickets: number, totalCost: number, totalSeats: number }}
   */
  #caluclateTicketTotal(requests) {
    let adultTicketCount = 0;
    let childTicketCount = 0;
    let infantTicketCount = 0;

    // Itterate through each TicketTypeRequest to calculate the totals.
    for (const request of requests) {
      const type = request.getTicketType();
      const count = request.getNoOfTickets();

      // Check if less than 0 tickets have been requested and throw an exception.
      if (count < 0) {
        throw new InvalidPurchaseException(`Ticket count for ${type} must be 0 or more, received ${count}`)
      };

      // Add the ticket count to the total count bassed on type.
      switch (type) {
        case "ADULT":
          adultTicketCount += count;
          break;
        case "CHILD":
          childTicketCount += count;
          break;
        case "INFANT":
          infantTicketCount += count;
          break;
      };
    };

    const totalTicketCount = adultTicketCount + childTicketCount + infantTicketCount;

    // Check if 0 total ticket have been requested and throw an exception.
    if (totalTicketCount === 0) {
      throw new InvalidPurchaseException("One or more total tickets must be requested");
    };
    
    // Check if total tickets requested exceeds maximum and throw an exception.
    if (totalTicketCount > env.TICKET_MAX_PURCHASE) {
      throw new InvalidPurchaseException(`${totalTicketCount} tickets exceeds maximun allowance of ${env.TICKET_MAX_PURCHASE} per purchase`);
    };

    // Check if child and infant tickets are being requested without an adult
    // ticket and throw an exception. 
    if (adultTicketCount === 0 && (childTicketCount > 0 || infantTicketCount > 0)) {
      throw new InvalidPurchaseException("Child and infant tickets must be purchased with at least one adult ticket");
    };
    
    // Check if more infant tickets are requested than adult tickets and throw
    // an exception.
    if (infantTicketCount > adultTicketCount) {
      throw new InvalidPurchaseException(`Each infant must be accompanied by an adult`);
    };
  };
}
