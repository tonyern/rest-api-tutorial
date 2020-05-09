const express = require('express'); // Import express.
const Joi = require('joi'); // Import Joi.
const app = express(); // Create express application on the app variable.
app.use(express.json()); // Use a JSON file.

// Give data to the server.
const customers = [
	{title: 'George', id: 1},
	{title: 'Josh', id: 2},
	{title: 'Tyler', id: 3},
	{title: 'Alice', id: 4},
	{title: 'Candice', id: 5}
]

// Read request handlers.
// Display the Massage when the URL consists of.
app.get('/', (req, res) => {
	// Send a 200 success status back to the client.
	res.status(200);
	res.send('Welcome to Tony\'s REST API!');
});

// Display the list of customers when URL consists of API customers.
app.get('/api/customers', (req, res) => {
	if (!customers)
	{
		res.status(404).send('<h2 style="font-family: Malgun Gothic;">Database not connected!</h2>');
	}

	// Send a 200 success status back to the client.
	res.status(200);
	res.send(customers);
});

// Display the information of a specific customer when you mention the id.
app.get('/api/customers/:id', (req, res) => {
	
	const customer = customers.find(c => c.id === parseInt(req.params.id));

	// If there is no customer ID then display an error message.
	if (!customer)
	{
		res.status(404).send('<h2 style="font-family: Malgun Gothic;">There is no customer with that specific ID number!</h2>');
	}

	// Send a 200 success status back to the client.
	res.status(200);
	res.send(customer);
});

// Create request handler.
// Create new customer information.
app.post('/api/customers', (req, res) => {
	
	const {error} = validateCustomer(req.body);

	if (error)
	{
		res.status(400).send(error.details[0].message);
		return;
	}

	// Increment the customer ID.
	const customer = {
		id: customers.length + 1,
		title: req.body.title
	};

	customers.push(customer);
	res.send(customer);
});

// Update request handler.
// Update existing customer information.
app.put('/api/customers/:id', (req, res) => {
	
	const customer = customers.find(c => c.id === parseInt(req.params.id));

	// If there is no customer ID then display an error message.
	if (!customer)
	{
		res.status(404).send('<h2 style="font-family: Malgun Gothic;">Customer NOT Found!</h2>');
	}

	const {error} = validateCustomer(req.body);

	if (error)
	{
		res.status(400).send(error.details[0].message);
		return;
	}

	customer.title = req.body.title;
	res.send(customer);
});

// Delete request handler.
// Delete customer details.
app.delete('/api/customers/:id', (req, res) => {

	const customer = customers.find(c => c.id === parseInt(req.params.id));

	// If there is no customer ID then display an error message.
	if (!customer)
	{
		res.status(404).send('<h2 style="font-family: Malgun Gothic;">Customer not found! Can\'t delete!</h2>');
	}

	const index = customers.indexOf(customer);
	customers.splice(index, 1);

	res.send(customer);
});

// Validate Information.
function validateCustomer(customer) {

	// Name must have a minimum of 3 characters.
	const schema = {
		title: Joi.string().min(3).required()
	};

	return Joi.validate(customer, schema);
}

// PORT ENVIRONMENT VARIABLE.
const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port ' + port));