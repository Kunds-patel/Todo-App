import React from 'react';
import './style.css';
import { createRoot } from 'react-dom/client';
import ToDo from './ToDo';

document.body.innerHTML = '<div id="app"></div>';

const root = createRoot(document.getElementById('app'));

root.render(<ToDo />);
