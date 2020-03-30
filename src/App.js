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
        };
        
        this.playerCoordinates = [0, 100];
        this.ratios = null;
        this.maxEntries = 10;

        this.handleChangeK = this.handleChangeK.bind(this);
        this.handleSubmitK = this.handleSubmitK.bind(this);

        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.handleSubmitFile = this.handleSubmitFile.bind(this);

        this.setColor = this.setColor.bind(this);
        this.setDataBlockStats = this.setDataBlockStats.bind(this);
        this.setPlayerCoordinates = this.setPlayerCoordinates.bind(this);
        this.getDistace = this.getDistace.bind(this);
        this.setAllDataMarksToFalse = this.setAllDataMarksToFalse.bind(this);
        this.knn = this.knn.bind(this);
        this.setToZero = this.setToZero.bind(this);
    }
  
    handleChangeK(e) {    
        this.setState({k: e.target.value});  
    }

    handleSubmitK(e) {
        if(this.state.file == null){
            alert("Upload a file first!");
            e.preventDefault();
            return;
        }
        if(this.state.k > 0 && this.state.k <= this.state.data.length) this.knn();
        else alert("K value must be between 0 and " + this.state.data.length);
        e.preventDefault();
    }

    handleChangeFile(e) {    
        this.setState({file: e.target.files[0]});  
    }

    handleSubmitFile(e) {       
        this.setPlayerToZero();
        this.playerCoordinates =  [0, 100]; 

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
            preview: this.maxEntries,
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
                    parseTypes.push({ type:results.data[2], count:0, color: color });
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

                parseData.push({ x: results.data[0], y: results.data[1], type: results.data[2], mark: false });

                counter++;
            }
        });
            
        setTimeout(() => {
            this.setState({currentStats: ""});
            this.setState({data: parseData});
            this.setState({types: parseTypes});
        }, 100);

        this.ratios = null;

        e.preventDefault();
    }

    mapDataBlocks(){
        let maxX = Math.max.apply(Math, this.state.data.map(function(dataVar) { return dataVar.x; }));
        let maxY = Math.max.apply(Math, this.state.data.map(function(dataVar) { return dataVar.y; }));

        let ratioX = (parseInt(appCSS.width) - parseInt(DataBlockCSS.width))/maxX;
        let ratioY = (parseInt(appCSS.height) - parseInt(DataBlockCSS.height))/maxY;

        this.ratios = [ratioX, ratioY];

        return this.state.data.map((dataVar) => <DataBlock x={dataVar.x * ratioX} y={(maxY - dataVar.y) * ratioY} types={this.state.types} data={dataVar} setDataBlockStats={this.setDataBlockStats}/>); 
    }

    mapTypes(){
        return this.state.types.map((typeVar) => <div style={{ "background-color": typeVar.color }}><text> | {typeVar.type}: {typeVar.count} | </text><MyColorPicker type={typeVar} setColor={this.setColor}/></div>); 
    }

    setColor(typeVar){
        this.setState({curenntColor: typeVar.color});
    }

    setDataBlockStats(stats){
        this.setState({currentStats: stats});
    }

    setPlayerCoordinates(coordiantes){
        let maxY = Math.max.apply(Math, this.state.data.map(function(dataVar) { return dataVar.y; }));
        this.playerCoordinates = [coordiantes[0]/this.ratios[0], maxY - (coordiantes[1]/this.ratios[1])];
    }

    getDistace(a, b){
        return Math.sqrt(a*a + b*b);
    }

    knn(){
        let distances = [];

        for (var i = 0; i < this.state.data.length; i++) {
            distances.push({distance: this.getDistace(this.state.data[i].x - this.playerCoordinates[0], this.state.data[i].y - this.playerCoordinates[1]), type: this.state.data[i].type, index: i });
        }

        distances.sort(function(a, b){return a.distance - b.distance});
        distances.splice(this.state.k, distances.length-this.state.k);  

        var types = [];

        for (var i = 0; i < this.state.types.length; i++) {
            types.push({type: this.state.types[i].type, count: 0});
        }

        for (var i = 0; i < distances.length; i++) {
            for (var j = 0; j < types.length; j++) {
                if(distances[i].type === types[j].type){
                    types[j].count++;
                    break;
                }
            }
        }

        types.sort(function(a, b){return a.count - b.count});

        let winners = [];
        for (var i = types.length-1; i >= 0; i--) {
            if(types[i].count === types[types.length-1].count) winners.push(types[i].type);
            else break;
        }

        if(winners.length === 1) alert("Winner: " + winners[0] + "!");
        else{
            let out = winners[0];
            for (var i = 1; i < winners.length; i++){
                out = out + ", " + winners[i];
            }
            alert("Winners: " + out + "!");
        }

        this.setAllDataMarksToFalse();
        let data = this.state.data;
        
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < distances.length; j++) {
                if(i === distances[j].index){
                    data[i].mark = true; 
                    break;
                }
            }
        }

        this.setState({data: data});
    }

    setAllDataMarksToFalse(){
        let data = this.state.data;
        for (var i = 0; i < this.state.data.length; i++) {
            data[i].mark = false;
        }
        this.setState({data: data});
    }

    setToZero(setToZero){
        this.setPlayerToZero = setToZero;
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
                <Player setPlayerCoordinates={this.setPlayerCoordinates} setToZero = {this.setToZero}/>
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
