import React from 'react';
import './DataBlock.scss';

class DataBlock extends React.Component
{ 
    render()
    {
        const style = {
            left: `${this.props.x}px`,
            top: `${this.props.y}px`,
        }
        return(
            <div className='data-block-model' style={style}></div>        
        );
    }
}

export default DataBlock;
