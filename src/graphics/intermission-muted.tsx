import React from 'react';
import { createRoot } from 'react-dom/client';

import { Intermission } from './intermission';

createRoot(document.getElementById('root')!).render(<Intermission muted />);
