import React from 'react';
import Field from './Field/Field.js';
import About from './About/About.js';
import Navbar from './Navbar.js';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

class App extends React.Component
{ 
    render()
    {
      return( 
        <div>
            <Navbar></Navbar>

                    <Route exact path={process.env.PUBLIC_URL+"/"} component={Field} />
                    <Route exact path={process.env.PUBLIC_URL+"/about"} component={About} />

     
        </div>
      );
    }
}
 
export default App;