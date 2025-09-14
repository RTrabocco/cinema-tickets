import express from "express";
import nunjucks from "nunjucks";
import path from "path";
import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";

const app = express();
const PORT = 3000;

// Body parser for form data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/assets", express.static(path.resolve(import.meta.dirname, "../node_modules/govuk-frontend/dist/govuk/assets/")));
app.use("/stylesheets", express.static(path.resolve(import.meta.dirname, "../node_modules/govuk-frontend/dist/govuk/")));

// Configure Nunjucks
nunjucks.configure([
  path.resolve(import.meta.dirname, "views"),
  path.resolve(import.meta.dirname, "../node_modules/govuk-frontend/dist"),
], {
  autoescape: true,
  express: app,
});

// GET /purchase-tickets
app.get("/purchase-tickets", (req, res) => {
  res.render("index.njk");
});

// POST /purchase-tickets
app.post("/purchase-tickets", (req, res) => {
  try {
    const service = new TicketService;
    const {
      accountId,
      adultTickets,
      childTickets,
      infantTickets
    } = req.body;

    const counts = service.purchaseTickets(
      parseInt(accountId),
      new TicketTypeRequest("ADULT", parseInt(adultTickets , 10) || 0),
      new TicketTypeRequest("CHILD", parseInt(childTickets , 10) || 0),
      new TicketTypeRequest("INFANT", parseInt(infantTickets, 10) || 0),
    );

    res.render("success.njk", { counts: counts })
  } catch (err) {
    res.render("index.njk", { errorList: [{ text: err.message }] });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
