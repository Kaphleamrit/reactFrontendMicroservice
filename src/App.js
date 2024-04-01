import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Checkbox, IconButton, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8090/tasks')
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("There was an error!", error));
  }, []);

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
        Todo List
      </Typography>
      <Paper sx={{ my: 2, p: 2 }}>
        <List>
          {tasks.map((task) => (
            <ListItem 
              key={task.id} 
              sx={{ 
                mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 
              }}
            >
              <Checkbox checked={task.completed} onChange={() => toggleComplete(task.id)} color="primary" />
              <ListItemText
                primary={task.title}
                secondary={task.description}
                sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              />
              <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default App;
