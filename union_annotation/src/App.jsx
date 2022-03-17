import * as React from 'react';
import './App.css';
// import MTurkFormComponent from './components/MTurkFormComponent';
import { examples } from "./examples.jsx";
import { Task } from './components/task';
import MTurkComponent from './components/mturk_component';

function App() {  
  return (
    <MTurkComponent defaultTaskData={examples[0]}>
      <Task
        isOnboarding={false}
        onError={() => { }}
      />
    </MTurkComponent>
  );
}

export default App;
