import React from 'react';
import { HuePicker } from 'react-color';

class MyColorPicker extends React.Component
{ 
    constructor(props) {
        super(props);
        this.state = {
            color: ""
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(color){
        this.setState({ color: color.hex });   
        
        let type = this.props.type;
        type.color = this.state.color;

        this.props.setColor(type);
    };

    render()
    {
        return(
            <HuePicker color={ this.state.color } onChange={ this.handleChange } />
        );
    }
}

export default MyColorPicker;