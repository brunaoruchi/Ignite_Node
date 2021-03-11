const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

/**
 * Estrutura do user
 * id: 'uuid', // precisa ser um uuid
 * name: 'Danilo Vieira',
 * username: 'danilo', 
 * todos: [{ 
    id: 'uuid', // precisa ser um uuid
    title: 'Nome da tarefa',
    done: false, 
    deadline: '2021-02-27T00:00:00.000Z', 
    created_at: '2021-02-22T00:00:00.000Z'
  }]
 */

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

	const user = users.find(user => user.username === username);

	if(!user){
		return response.status(404).json({error: "User not found! :( "});
	}

	request.user = user;

  return next();
}

//Criação de usuário
app.post('/users', (request, response) => {
  const { name, username } = request.body;
  
  const userExists = users.some(user => user.username === username);

	if (userExists){
		return response.status(400).json({ error:"user already exists!" });
	}

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }
  users.push(user);

  return response.status(201).send(user);
});

//Listagem Todos
app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

//Criação de Todos
app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title, deadline} = request.body;
  const {user} = request;

  const todo = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline:  new Date(deadline),
    created_at: new Date()
  }
  
  user.todos.push(todo)

  return response.status(201).json(todo);
});

//Atualização de Todo
app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;
  
  const todo = user.todos.find(user => user.id === id);

  if(!todo){
		return response.status(404).json({error: "Todo not found! :( "});
	}

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(201).json(todo);
});

//Atualização parcial do Todo
app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find(user => user.id === id);

  if(!todo){
		return response.status(404).json({error: "Todo not found! :( "});
	}

  todo.done = true;

  return response.status(201).json(todo);
});

//Remove Todo
app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find(user => user.id === id);

  if(!todo){
		return response.status(404).json({error: "Todo not found! :( "});
	}

  user.todos.splice(todo, 1);

  return response.status(204).send();
});

module.exports = app;