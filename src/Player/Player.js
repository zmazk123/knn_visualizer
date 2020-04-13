import React from 'react';
import PlayerCSS from'./Player.scss';
import fieldCSS from '../Field/Field.scss';

class Player extends React.Component
{ 
    constructor(props) {
        super(props);
        this.state = {
            coordinates: [0,0]
        };
        this.playerRef = React.createRef()

        this.props.setToZero(this.setToZero);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    setToZero = () => {
        this.setState({coordinates : [0,0]});    
    }

    componentDidMount() {
        document.getElementById("player").onmousedown = this.onMouseDown;
    }

    onMouseDown(e){
        document.onmousemove = this.onMouseMove;
    }

    onMouseMove(e){
        let appElement = document.getElementById("app");

        let parentOffsetX = appElement.getBoundingClientRect().left + document.documentElement.scrollLeft;
        let parentOffsetY = appElement.getBoundingClientRect().top + document.documentElement.scrollTop;

        let newPosX = e.pageX - this.playerRef.current.offsetWidth/2 - parentOffsetX;
        let newPosY = e.pageY - this.playerRef.current.offsetHeight/2 - parentOffsetY;

        if(newPosX >= 0 && newPosY >= 0 && newPosX <= parseInt(fieldCSS.width) - parseInt(PlayerCSS.width) && newPosY <= parseInt(fieldCSS.height) - parseInt(PlayerCSS.height)){
            this.setState({coordinates: [newPosX, newPosY]}); 
            this.props.setPlayerCoordinates(this.state.coordinates);
        }

        document.onmouseup = this.onMouseUp;
    }

    onMouseUp(e){
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
