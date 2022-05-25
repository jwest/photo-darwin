import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Button from '@mui/material/Button';

function render() {
  ReactDOM.render(<Button variant="contained">Hello World</Button>, document.body);
}

render();