import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import "./reset.css";
import "./vscode.css";
import  "./my-css.css";
ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
