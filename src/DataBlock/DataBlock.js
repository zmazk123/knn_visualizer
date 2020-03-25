import React from 'react';
import './DataBlock.scss';

class DataBlock extends React.Component
{ 
    constructor(props) {
        super(props);
        this.state = {
            color: ""
        };
    }

    onClickHandler = () =>{
        this.props.setDataBlockStats(this.props.data);
    }

    render()
    {
        let types = this.props.types;
        let type = this.props.data.type;

        for (var i = 0; i < types.length; i++) {
            if(types[i].type === type){
                setTimeout(() => {
                    this.setState({color: types[i].color}); 
                }, 5);       
                break;
            }
        }

        const style = {
            left: `${this.props.x}px`,
            top: `${this.props.y}px`,
            "background-color": `${this.state.color}`,
        }
        return(
            <div className='data-block-model' style={style} onClick={this.onClickHandler}></div>        
        );
    }
}

export default DataBlock;
