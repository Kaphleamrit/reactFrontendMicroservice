import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Checkbox, IconButton, TextField, Button, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const backendUrl = "http://go-backend:8090"

  useEffect(() => {
    fetch(backendUrl + '/tasks')
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("There was an error!", error));
  }, []);


  const toggleComplete = (id) => {
    // Toggle task completion logic...
    const task = tasks.find(task => task.id === id);
  const updatedTask = { ...task, completed: !task.completed };

  fetch(`http://go-backend:8090/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedTask),
  })
  .then(response => response.json())
  .then(() => {
    setTasks(tasks.map(task => task.id === id ? updatedTask : task)); // Update the task in UI
  })
  .catch((error) => console.error("There was an error!", error));
  };


  const deleteTask = (id) => {
    fetch(`http://go-backend:8090/tasks/${id}`, {
    method: 'DELETE',
  })
  .then(() => {
    // Ensure this runs by checking console output
    console.log(`Deleted task with ID: ${id}`);

    // Ensure the ID types match, adjusting if necessary (e.g., converting to Number)
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks); // This should trigger re-render
  })
  .catch((error) => {
    console.error("There was an error!", error);
  }); 
  };

  const addTask = (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    const taskData = {
      title: newTitle,
      description: newDescription,
      completed: false,
    };

    fetch('http://go-backend:8090/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
    .then(response => response.json())
    .then(data => {
      setTasks([...tasks, data]); // Add the new task to the local state to update the UI
      setNewTitle(''); // Reset the title input field
      setNewDescription(''); // Reset the description input field
    })
    .catch((error) => console.error("There was an error!", error));
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" gutterBottom>Todo List</Typography>
      <Box component="form" onSubmit={addTask} noValidate sx={{ mt: 1 }}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Title"
          autoFocus 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Add Task
        </Button>
      </Box>
      <List>
        {tasks.map((task) => (
          <ListItem key={task.id} dense>
            <Checkbox checked={task.completed} onChange={() => toggleComplete(task.id)} color="primary" />
            <ListItemText primary={task.title} secondary={task.description} />
            <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default App;
