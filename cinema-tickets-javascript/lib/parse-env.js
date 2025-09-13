import envSchema from "env-schema";

export default (data) =>
  envSchema({
    schema: {
      type: "object",
      properties: {
        TICKET_MAX_PURCHASE: {
          type: "number",
          default: 25,
        },
        TICKET_PRICE_ADULT: {
          type: "number",
          default: 25,
        },
        TICKET_PRICE_CHILD: {
          type: "number",
          default: 15,
        },
        TICKET_PRICE_INFANT: {
          type: "number",
          default: 0,
        },
      }
    },
    data,
    dotenv: true,
  });
