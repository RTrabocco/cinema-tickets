import { beforeEach, test } from "node:test";
import { equal, ok } from "node:assert/strict";
import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";

let service;

beforeEach(() => {
  service = new TicketService();
});

test("throws an exception if an account ID is invalid", () => {
  const accountIds = [
    -1,
    0,
    "accountId",
  ];

  for (const id of accountIds) {
    let caughtError;

    try {
      service.purchaseTickets(
        id,
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("CHILD", 0),
        new TicketTypeRequest("INFANT", 0),
      );
    } catch (error) {
      caughtError = error;
    };

    ok(caughtError instanceof InvalidPurchaseException);
    equal(caughtError.message, `Account ID must be greater than 0, received ${id}`);
  };
});

test("throws an exception if there are no TicketTypeRequests", () => {
  let caughtError;

  try {
    service.purchaseTickets(123456);
  } catch (error) {
    caughtError = error;
  };

  ok(caughtError instanceof InvalidPurchaseException);
  equal(caughtError.message, "One or more TicketTypeRequests must be provided");
});

test("throws an exception if 0 total tickets are requested", () => {
  let caughtError;
  
  try {
    service.purchaseTickets(
      123456,
      new TicketTypeRequest("ADULT", 0),
      new TicketTypeRequest("CHILD", 0),
      new TicketTypeRequest("INFANT", 0),
    );
  } catch (error) {
    caughtError = error;
  };
  
  ok(caughtError instanceof InvalidPurchaseException);
  equal(caughtError.message, "At least one ticket must be purchased");
});

test("throws an exception if a negative number of tickets are requested", () => {
  let caughtError;

  try {
    service.purchaseTickets(
      123456,
      new TicketTypeRequest("ADULT", -2),
    );
  } catch (error) {
    caughtError = error;
  };

  ok(caughtError instanceof InvalidPurchaseException);
  equal(caughtError.message, "Ticket count for ADULT must be 0 or more, received -2");
});

test("throws an exception if more than 25 tickets are requested", () => {
  let caughtError;

  try {
    service.purchaseTickets(
      123456,
      new TicketTypeRequest("ADULT", 20),
      new TicketTypeRequest("CHILD", 6),
    );
  } catch (error) {
    caughtError = error;
  };

  ok(caughtError instanceof InvalidPurchaseException);
  equal(caughtError.message, "Purchase exceeds maximum ticket allowance of 25, requested 26");
});

test("throws an exception if more infant tickets are requested than adult tickets", () => {
  let caughtError;

  try {
    service.purchaseTickets(
      123456,
      new TicketTypeRequest("ADULT", 1),
      new TicketTypeRequest("INFANT", 2),
    );
  } catch (error) {
    caughtError = error;
  };

  ok(caughtError instanceof InvalidPurchaseException);
  equal(caughtError.message, "Each infant must be accompanied by an adult");
});

test("throws an exception if infant tickets are requested without an accompanying adult", () => {
  let caughtError;

  try {
    service.purchaseTickets(
      123456,
      new TicketTypeRequest("ADULT", 0),
      new TicketTypeRequest("INFANT", 1),
    );
  } catch (error) {
    caughtError = error;
  };

  ok(caughtError instanceof InvalidPurchaseException);
  equal(caughtError.message, "Child and infant tickets must be purchased with at least one adult ticket");
});

test("throws an exception if child tickets are requested without an accompanying adult", () => {
  let caughtError;

  try {
    service.purchaseTickets(
      123456,
      new TicketTypeRequest("ADULT", 0),
      new TicketTypeRequest("CHILD", 1),
    );
  } catch (error) {
    caughtError = error;
  };

  ok(caughtError instanceof InvalidPurchaseException);
  equal(caughtError.message, "Child and infant tickets must be purchased with at least one adult ticket");
});

test("makes a successful purchase of exactly 25 tickets", () => {
  const response = service.purchaseTickets(
    123456,
    new TicketTypeRequest("ADULT", 20),
    new TicketTypeRequest("CHILD", 5),
    new TicketTypeRequest("INFANT", 0),
  );

  ok("totalTicketCost" in response);
  ok("totalTicketCount" in response);
  ok("totalSeats" in response);
  equal(response.totalTicketCost, 575);
  equal(response.totalTicketCount, 25);
  equal(response.totalSeats, 25);
});

test("makes a successful purchase of adult only tickets", () => {
  const response = service.purchaseTickets(
    123456,
    new TicketTypeRequest("ADULT", 10),
    new TicketTypeRequest("CHILD", 0),
    new TicketTypeRequest("INFANT", 0),
  );

  ok("totalTicketCost" in response);
  ok("totalTicketCount" in response);
  ok("totalSeats" in response);
  equal(response.totalTicketCost, 250);
  equal(response.totalTicketCount, 10);
  equal(response.totalSeats, 10);
});

test("makes a successful purchase of adult and infant tickets", () => {
  const response = service.purchaseTickets(
    123456,
    new TicketTypeRequest("ADULT", 7),
    new TicketTypeRequest("CHILD", 0),
    new TicketTypeRequest("INFANT", 5),
  );

  ok("totalTicketCost" in response);
  ok("totalTicketCount" in response);
  ok("totalSeats" in response);
  equal(response.totalTicketCost, 175);
  equal(response.totalTicketCount, 12);
  equal(response.totalSeats, 7);
});

test("makes a successful purchase of adult and child tickets", () => {
  const response = service.purchaseTickets(
    123456,
    new TicketTypeRequest("ADULT", 3),
    new TicketTypeRequest("CHILD", 2),
    new TicketTypeRequest("INFANT", 0),
  );

  ok("totalTicketCost" in response);
  ok("totalTicketCount" in response);
  ok("totalSeats" in response);
  equal(response.totalTicketCost, 105);
  equal(response.totalTicketCount, 5);
  equal(response.totalSeats, 5);
});

test("makes a successful purchase of adult, infant, and child tickets", () => {
  const response = service.purchaseTickets(
    123456,
    new TicketTypeRequest("ADULT", 5),
    new TicketTypeRequest("CHILD", 5),
    new TicketTypeRequest("INFANT", 5),
  );

  ok("totalTicketCost" in response);
  ok("totalTicketCount" in response);
  ok("totalSeats" in response);
  equal(response.totalTicketCost, 200);
  equal(response.totalTicketCount, 15);
  equal(response.totalSeats, 10);
});
