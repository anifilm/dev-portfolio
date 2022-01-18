import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './routes/Home';
import Detail from './routes/Detail';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/hello">
          <h1>Hello, React!</h1>
        </Route>
        <Route path="/movie/:id">
          <Detail />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
