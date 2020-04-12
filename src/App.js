import React from 'react';
import Field from './Field/Field.js';
import About from './About/About.js';
import Navbar from './Navbar.js';
import {Route} from 'react-router-dom';

class App extends React.Component
{ 
    render()
    {
      return( 
        <div>
            <Navbar></Navbar>
            <Route exact path="/" component={Field}></Route>
            <Route exact path="/about" component={About}></Route>        
        </div>
      );
    }
}
 
export default App;