import React from 'react';
import logo from './logo2.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <header className="App-font-header">
          <p>
            BANKCO
          </p>
        </header>
      </header>
      <div class="stage">
        <div class="wrapper">
          <div class="slash"></div>
          <div class="sides">
            <div class="side"></div>
            <div class="side"></div>
            <div class="side"></div>
            <div class="side"></div>
          </div>
          <div class="text">
            <div class="text--backing">Hello</div>
            <div class="text--left">
              <div class="inner">Hello</div>
            </div>
            <div class="text--right">
              <div class="inner">Hello</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
