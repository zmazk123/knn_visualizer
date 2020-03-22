import React from 'react';
import appCSS from './App.scss';
import DataBlockCSS from './DataBlock/DataBlock.scss';
import Player from './Player/Player.js';
import DataBlock from './DataBlock/DataBlock';

class App extends React.Component
{ 
    constructor(props) {
        super(props);
        this.state = {k: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.data = [
            { x: 100, y: 0, type: "bukva" },
            { x: 5, y: 5, type: "hrast" },
            { x: 10, y: 100, type: "hrast" }
        ];
    }
    
    handleChange(e) {    
        this.setState({k: e.target.value});  
    }

    handleSubmit(e) {
        alert('A name was submitted: ' + this.state.k);
        e.preventDefault();
    }

    mapDataBlocks(){
        let maxX = Math.max.apply(Math, this.data.map(function(dataVar) { return dataVar.x; }));
        let maxY = Math.max.apply(Math, this.data.map(function(dataVar) { return dataVar.y; }));

        let ratioX = (parseInt(appCSS.width) - parseInt(DataBlockCSS.width))/maxX;
        let ratioY = (parseInt(appCSS.height) - parseInt(DataBlockCSS.height))/maxY;

        return this.data.map((dataVar) => <DataBlock x={dataVar.x * ratioX} y={(maxY - dataVar.y) * ratioY}/>)
    }

    render()
    {
      return( 
        <div> 
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Name:
                        <input type="text" value={this.state.k} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <hr></hr>
            </div>
            <div className='game-area' id="app">
                <Player/>
                { this.mapDataBlocks() }
            </div>
        </div>  
      );
    }
}
 
export default App;
