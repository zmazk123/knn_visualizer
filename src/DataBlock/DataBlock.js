import React from 'react';
import './DataBlock.scss';

class DataBlock extends React.Component
{ 
    constructor(props) {
        super(props);
        this.state = {
            color: "blue"
        };

        this.onClickHandler = this.onClickHandler.bind(this);
    }

    onClickHandler(){
        this.props.setDataBlockStats(this.props.data);
    }

    componentWillReceiveProps(nextProps){
        let types = nextProps.types;
        let type = this.props.data.type;

        for (var i = 0; i < types.length; i++) {
            if(types[i].type === type){
                this.setState({color: types[i].color});                 
                break;
            }
        }
    }


    render()
    {
        const styleUnmarked = {
            left: `${this.props.x}px`,
            top: `${this.props.y}px`,
            "background-color": `${this.state.color}` 
        }

        const styleMarked = {
            left: `${this.props.x}px`,
            top: `${this.props.y}px`,
            "background-color": `${this.state.color}` ,
            border: "2px solid #000"
        }

        let mark = this.props.data.mark;

        if(mark === false){
            return(
                <div className='data-block-model' style={styleUnmarked} onClick={this.onClickHandler}></div>        
            );
        }
        else{
            return(
                <div className='data-block-model' style={styleMarked} onClick={this.onClickHandler}></div>        
            );
        }
    }
}

export default DataBlock;
