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

test("throws an exception if 0 tickets are requested", () => {
});

test("throws an exception if a negative number of tickets are requested", () => {
});

test("throws an exception if more than 25 tickets are requested", () => {
});

test("throws an exception if more infant tickets are requested than adult tickets", () => {
});

test("throws an exception if infant tickets are requested without an accompanying adult", () => {
});

test("throws an exception if child tickets are requested without an accompanying adult", () => {
});

test("makes a successful purchase of exactly 25 tickets", () => {
});

test("makes a successful purchase of adult only tickets", () => {
});

test("makes a successful purchase of adult and infant tickets", () => {
});

test("makes a successful purchase of adult and child tickets", () => {
});

test("makes a successful purchase of adult, infant, and child tickets", () => {
});
