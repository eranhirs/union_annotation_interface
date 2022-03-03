import * as React from 'react';
import './App.css';
import MTurkFormComponent from './components/MTurkFormComponent';


function App() {
  return (
    <div className="App">
      <MTurkFormComponent>
        <h1>What's up?</h1>
        <p><textarea name='comment' cols='80' rows='3'></textarea></p>
        <p><input type='submit' id='submitButton' value='Submit' /></p>
      </MTurkFormComponent>

  </div>
  );
}

export default App;
