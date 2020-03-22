import React from 'react';
import './Player.scss';

class Player extends React.Component
{ 
    constructor(props) {
        super(props);
        this.state = {
            coordinates: [0,0]
        };
        this.playerRef = React.createRef()
    }

    componentDidMount() {
        document.getElementById("player").onmousedown = this.onMouseDown;
    }

    onMouseDown = (e) => {
        document.onmousemove = this.onMouseMove;
    }

    onMouseMove = (e) => {
        let parentOffsetX = document.getElementById("app").getBoundingClientRect().left;
        let parentOffsetY = document.getElementById("app").getBoundingClientRect().top;

        this.setState({coordinates: [e.pageX - this.playerRef.current.offsetWidth/2 - parentOffsetX, e.pageY - this.playerRef.current.offsetHeight/2 - parentOffsetY]}); 

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
            <div id="player" ref={this.playerRef} className='player-model' style={style}></div>        
        );
    }
}

export default Player;
