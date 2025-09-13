import { beforeEach, test } from "node:test";
import TicketService from "../src/pairtest/TicketService.js";

let service;

beforeEach(() => {
  service = new TicketService();
})

test("throws an exception if an account ID is invalid", () => {
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
