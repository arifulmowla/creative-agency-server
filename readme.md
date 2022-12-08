# Creative Agency Server API Documentation

Creative agency is a e-commerce where clients can order fro any service and admin can manage orders.

## Installation

To install all the dependencies run `npm install`

then to run in local server type `nodemon index.js`

then it will run in port 5000 and url will be https://localhost:5000

## Example:

[LIVE](https://creative-agency-api.herokuapp.com/) | [Frontend](https://github.com/nokibrokes/creative-agency-frontend)

## Api Documentation

You must install to use that on your server. Here all of the api information.

Add order: `POST /add-order/`

Get all orders: `POST /get-orders/`

Add user review: `POST /add-review/`

Get user review: `POST /add-review/`

Get All orders: `POST /get-all-orders`

Add a service: `POST /add-service/`

Add an admin email: `POST /add-service/`

Get all services: `GET /get-services/`

Get feedback: `GET /get-feedback/`

Check is admin: `POST /admin/`

Check user status: `POST /change-status/`
