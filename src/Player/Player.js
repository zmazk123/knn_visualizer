import React from 'react';
import './Player.css';

class Player extends React.Component
{ 
    constructor(props) {
        super(props);
        this.state = {
            coordinates: [0,0]
        };
        this.myInput = React.createRef()
    }

    componentDidMount() {
        document.getElementById("player").onmousedown = this.onMouseDown;
    }

    onMouseDown = (e) => {
        document.onmousemove = this.onMouseMove;
    }

    onMouseMove = (e) => {
        this.setState({coordinates: [e.pageX - this.myInput.current.offsetWidth / 2, e.pageY - this.myInput.current.offsetHeight / 2]}); 
        document.onmouseup = this.onMouseUp;
    }

    onMouseUp = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
    }

    render()
    {
        const style = {
            left: `${this.state.coordinates[0]}px`,
            top: `${this.state.coordinates[1]}px`,
        }
        return(
            <div id="player" ref={this.myInput} className='player-model' style={style}></div>
        
        );
    }
}

export default Player;
