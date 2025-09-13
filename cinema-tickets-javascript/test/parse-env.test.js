import { equal } from "node:assert/strict";
import { test } from "node:test";
import parseEnv from "../lib/parse-env.js";

// Default environment variables to stop tests throwing an error.
const r = {};

test("parses TICKET_MAX_PURCHASE as a number", () => {
  const env = parseEnv({ ...r, TICKET_MAX_PURCHASE: 25 });
  equal(env.TICKET_MAX_PURCHASE, 25);
});

test("defaults TICKET_MAX_PURCHASE to 25", () => {
  const env = parseEnv(r);
  equal(env.TICKET_MAX_PURCHASE, 25);
});

test("parses TICKET_PRICE_ADULT as a number", () => {
  const env = parseEnv({ ...r, TICKET_PRICE_ADULT: 25 });
  equal(env.TICKET_PRICE_ADULT, 25);
});

test("defaults TICKET_PRICE_ADULT to 25", () => {
  const env = parseEnv(r);
  equal(env.TICKET_PRICE_ADULT, 25);
});

test("parses TICKET_PRICE_CHILD as a number", () => {
  const env = parseEnv({ ...r, TICKET_PRICE_CHILD: 15 });
  equal(env.TICKET_PRICE_CHILD, 15);
});

test("defaults TICKET_PRICE_CHILD to 15", () => {
  const env = parseEnv(r);
  equal(env.TICKET_PRICE_CHILD, 15);
});

test("parses TICKET_PRICE_INFANT as a number", () => {
  const env = parseEnv({ ...r, TICKET_PRICE_INFANT: 0 });
  equal(env.TICKET_PRICE_INFANT, 0);
});

test("defaults TICKET_PRICE_INFANT to 0", () => {
  const env = parseEnv(r);
  equal(env.TICKET_PRICE_INFANT, 0);
});
