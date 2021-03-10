const express = require("express");
const { v4: uuid4 } = require("uuid");

const app = express();

app.use(express.json());

const customers = [];

/**
 * cpf - string
 * name - string
 * id - uuid
 * statement - []
 * ----------------------
 * Middlewares: Uma função que fica entre o request e response, será utilizado 
 * nessa aplicação para validação da conta e o token (admin ou user).
 */

function verifyIfExistsAccountCPF(request, response, next) {
	const { cpf } = request.headers;

	const customer = customers.find(customer => customer.cpf === cpf);

	if(!customer){
		return response.status(400).json({error: "Customer not found! :( "});
	}

	//Adiciona informação ao request para a rota que está executando o middleware
	request.customer = customer; 

	return next();
}

app.post("/account", (request, response) => {
	const {cpf, name} = request.body;

	const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf);
	if (customerAlreadyExists){
		return response.status(400).json({ error:"Customer already exists!" });
	}

	customers.push({
		cpf,
		name,
		id: uuid4(),
		statement: []
	});

	return response.status(201).send();
});

//Somente se utiliza quando se quer que todas as rotas abaixo passem por ela.
//app.use(verifyIfExistsAccountCPF);

// Busca a informação pelo header com o middleware específico
app.get("/statement/", verifyIfExistsAccountCPF,(request, response) => {
	const {customer} = request;
	return response.json(customer.statement);
});

app.listen(3334);