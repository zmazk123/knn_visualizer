import React from 'react';
import {Link} from 'react-router-dom';

class Navbar extends React.Component
{
    render()
    {
        return(
        <nav class="navbar navbar-expand-md bg-primary navbar-dark" id="navbar">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <Link to={process.env.PUBLIC_URL+"/"}><a class="nav-link"><text style={{ color:"#f9f9f9" }}>Home</text></a></Link>
                </li>
                <li class="nav-item">
                    <Link to={process.env.PUBLIC_URL+"/about"}><a class="nav-link"><text style={{ color:"#f4f4f4" }}>About</text></a></Link>
                </li>
            </ul>
        </nav>
      );
    }
}

export default Navbar;