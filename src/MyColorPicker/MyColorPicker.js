import React from 'react';
import { HuePicker } from 'react-color';

class MyColorPicker extends React.Component
{ 
    constructor(props) {
        super(props);
        this.state = {
            color: ""
        };
    }

    handleChange = (color) => {
        this.setState({ color: color.hex });   
        
        let type = this.props.type;
        type.color = this.state.color;

        this.props.setTypes(type);
    };

    render()
    {
        return(
            <HuePicker color={ this.state.color } onChange={ this.handleChange } />
        );
    }
}

export default MyColorPicker;