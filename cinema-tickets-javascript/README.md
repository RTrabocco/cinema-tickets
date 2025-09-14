# DWP Senior Software Engineer JavaScript/Node.JS code test
A ticket purchasing service that validates requests, calculates totals, and integrates with third-party payment and seat reservation providers.

## Contents
- [Features](#features)
- [Running locally](#running-locally)
- [Testing](#testing)
- [Environment variables](#environment-variables)

## <a id="features"></a> Features
- Validates account ID and ticket type requests
- Calculates ticket costs and seats based on rules
- Enforces business rules:
  - At least one ticket must be purchased
  - Maximum of 25 tickets per purchase
  - Children and infants must be accompanied by an adult
  - Each infant must have an accompanying adult

## <a id="running-locally"></a>Running locally
To run this application, you must have Node.js and npm installed on your machine.

### Install
```bash
# Navigate to the JavaScript project
cd cinema-tickets-javascript

# Install dependencies
npm install
```

### Run the app
To provide feedback for different ticket request scenarios, a basic Express app can be ran that allows you to enter an account ID and the number of tickets for each type.
```bash
# Run the Express app
npm run start
```

In your browser, navigate to [http://localhost:3000/purchase-tickets](http://localhost:3000/purchase-tickets) and use the inputs provided.

## <a id="testing"></a>Testing
This project uses the native Node.js test runner for unit tests.
```bash
# Run unit tests
npm run test
```

## <a id="environment-variables"></a>Environment variables

| Variable                  | Default value | Description                                                |
|---------------------------|---------------|------------------------------------------------------------|
| ```TICKET_MAX_PURCHASE``` | 25            | Maximum number of tickets that can be purchased at a time. |
| ```TICKET_PRICE_ADULT```  | 25            | Price of an adult ticket.                                  |
| ```TICKET_PRICE_CHILD```  | 15            | Price of an child ticket.                                  |
| ```TICKET_PRICE_INFANT``` | 0             | Price of an infant ticket.                                 |