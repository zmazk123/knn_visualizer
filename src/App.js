import React from 'react';
import appCSS from './App.scss';
import DataBlockCSS from './DataBlock/DataBlock.scss';
import Player from './Player/Player.js';
import DataBlock from './DataBlock/DataBlock.js';
import MyColorPicker from './MyColorPicker/MyColorPicker.js';
import Papa from 'papaparse'

class App extends React.Component
{ 
    constructor(props) {
        super(props);
        this.state = {
            k: '',
            file: null,
            data: [],
            types: [],
            curenntColor: "",
            currentStats: "",
            playerCoordinates: null,
            ratios: null
        };

        this.handleChangeK = this.handleChangeK.bind(this);
        this.handleSubmitK = this.handleSubmitK.bind(this);

        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.handleSubmitFile = this.handleSubmitFile.bind(this);

        this.setTypes = this.setTypes.bind(this);
        this.setDataBlockStats = this.setDataBlockStats.bind(this);
        this.setPlayerCoordinates = this.setPlayerCoordinates.bind(this);
    }
  
    handleChangeK(e) {    
        this.setState({k: e.target.value});  
    }

    handleSubmitK(e) {
        alert('A name was submitted: ' + this.state.k);     
        e.preventDefault();
    }

    handleChangeFile(e) {    
        this.setState({file: e.target.files[0]});  
    }

    handleSubmitFile(e) {
        let parseData = [];
        let parseTypes = [];
        let counter = 0;

        function getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        Papa.parse(this.state.file, {
            header: false,
            dynamicTyping: true,
            preview: 10,
            encoding: "utf8",
            step: function(results, parser) {
                if(results.data.length < 3) {
                    alert("Missing data entry in row " + counter);
                    parser.abort();
                    parseData = [];
                    parseTypes = [];
                    return;
                }
                if(results.data.length > 3) {
                    alert("Too many entries in row " + counter);
                    parser.abort();
                    parseData = [];
                    parseTypes = [];
                    return;
                }
                if(typeof(results.data[0]) != "number" || results.data[0] < 0 || results.data[0] > 1000) {
                    alert("X parameter in row " + counter + " must be a number between 0 and 1000!");
                    parser.abort();
                    parseData = [];
                    parseTypes = [];
                    return;
                }
                if(typeof(results.data[1]) != "number" || results.data[1] < 0 || results.data[1] > 1000) {
                    alert("Y parameter in row " + counter + " must be a number between 0 and 1000!");
                    parser.abort();
                    parseData = [];
                    parseTypes = [];
                    return;
                }
                if(typeof(results.data[2]) != "string" || results.data[2].length > 15) {
                    alert("Type parameter in row " + counter + " must be a string up to 15 characters!");
                    parser.abort();
                    parseData = [];
                    parseTypes = [];
                    return;
                }

                if(counter === 0){
                    let color = getRandomColor();
                    parseTypes.push({ type:results.data[2], count:0, color: color  });
                } 

                for (var i = 0; i < parseTypes.length; i++) {
                    if(results.data[2] === parseTypes[i].type){
                        parseTypes[i].count++;
                        break;
                    }
                    if(i === parseTypes.length-1){
                        let color = getRandomColor();
                        parseTypes.push({ type:results.data[2], count:1, color: color  });
                        break;
                    }
                }

                parseData.push({ x: results.data[0], y: results.data[1], type: results.data[2] });

                counter++;
            }
        });
            
        setTimeout(() => {
            this.setState({data: parseData});
            this.setState({types: parseTypes});
            this.setState({currentStats: ""});
            this.setState({ratios: null});
        }, 10);

        e.preventDefault();
    }

    mapDataBlocks(){
        let maxX = Math.max.apply(Math, this.state.data.map(function(dataVar) { return dataVar.x; }));
        let maxY = Math.max.apply(Math, this.state.data.map(function(dataVar) { return dataVar.y; }));

        let ratioX = (parseInt(appCSS.width) - parseInt(DataBlockCSS.width))/maxX;
        let ratioY = (parseInt(appCSS.height) - parseInt(DataBlockCSS.height))/maxY;

        setTimeout(() => {
            this.setState({ratios: [ratioX, ratioY]});
        }, 5);

        return this.state.data.map((dataVar) => <DataBlock x={dataVar.x * ratioX} y={(maxY - dataVar.y) * ratioY} types={this.state.types} data={dataVar} setDataBlockStats={this.setDataBlockStats}/>); 
    }

    mapTypes(){
        return this.state.types.map((typeVar) => <div style={{ "background-color": typeVar.color }}><text> | {typeVar.type}: {typeVar.count} | </text><MyColorPicker type={typeVar} setTypes={this.setTypes}/></div>); 
    }

    setTypes(typeVar){
        this.setState({curenntColor: typeVar.color});
    }

    setDataBlockStats(stats){
        this.setState({currentStats: stats});
    }

    setPlayerCoordinates(coordiantes){
        this.setState({playerCoordinates: [coordiantes[0]/this.state.ratios[0], coordiantes[1]/this.state.ratios[0]]});
    }

    render()
    {
      return( 
        <div> 
            <div>
                <form onSubmit={this.handleSubmitK}>
                    <label>
                        Name:
                        <input type="text" value={this.state.k} onChange={this.handleChangeK} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <hr></hr>
            </div>
            <div>
                <form onSubmit={this.handleSubmitFile}>
                    <input type="file" accept=".txt,.csv" onChange={this.handleChangeFile} />
                    <input type="submit" value="Submit" />
                </form>
                <h2>You have:</h2>
                { this.mapTypes() }     
                <hr></hr>
            </div>
            <div className='data-area' id="app">                           
                <Player setPlayerCoordinates={this.setPlayerCoordinates}/>
                { this.mapDataBlocks() }           
            </div>
            <div>
                <h2>Current stats</h2>
                <hr></hr>
                <text>X: {this.state.currentStats.x} </text>
                <text>Y: {this.state.currentStats.y} </text>
                <text>Type: {this.state.currentStats.type} </text>
            </div>
        </div>  
      );
    }
}
 
export default App;
