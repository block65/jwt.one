import { createRoot } from 'react-dom/client';
import { App } from './App.js';

import 'the-new-css-reset';
import '@block65/react-design-system/css';
import './global.scss';

const el = document.getElementById('root');

if (!el) {
  throw new Error('missing el');
}

createRoot(el).render(<App />);
