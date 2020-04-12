import React from 'react';
import fieldCSS from './Field.scss';
import DataBlockCSS from '../DataBlock/DataBlock.scss';
import Player from '../Player/Player.js';
import DataBlock from '../DataBlock/DataBlock.js';
import MyColorPicker from '../MyColorPicker/MyColorPicker.js';
import Papa from 'papaparse';
import files from '../DemoData/demoData.js';

class Field extends React.Component
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
        this.maximums = [0,0];
        this.minimums = [0,0];
        this.ratios = null;
        this.maxEntries = 30;

        this.labelX = "";
        this.labelY = "";

        this.handleChangeK = this.handleChangeK.bind(this);
        this.handleSubmitK = this.handleSubmitK.bind(this);

        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.handleSubmitFile = this.handleSubmitFile.bind(this);

        this.handleDataSetOne = this.handleDataSetOne.bind(this);
        this.handleDataSetTwo = this.handleDataSetTwo.bind(this);
        this.handleDataSetThree = this.handleDataSetThree.bind(this);

        this.setColor = this.setColor.bind(this);
        this.setDataBlockStats = this.setDataBlockStats.bind(this);
        this.setPlayerCoordinates = this.setPlayerCoordinates.bind(this);
        this.setPlayerCoordinatesToZero = this.setPlayerCoordinatesToZero.bind(this);
        this.getDistace = this.getDistace.bind(this);
        this.setAllDataMarksToFalse = this.setAllDataMarksToFalse.bind(this);
        this.knn = this.knn.bind(this);
        this.setToZero = this.setToZero.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({data: files[0]});  
            this.setState({types: files[1]});       
        }, 100);          
        
        this.labelX = "Rapid";
        this.labelY = "Blitz";
        setTimeout(() => {
            this.setPlayerCoordinatesToZero();     
            this.setAllDataMarksToFalse(); 
        }, 100);
    }

    handleDataSetOne(e) {    
        this.setPlayerToZero();

        setTimeout(() => {
            this.setState({currentStats: ""});
            this.setState({data: files[0]});  
            this.setState({types: files[1]}); 
        }, 100);

        this.labelX = "Rapid";
        this.labelY = "Blitz";
        setTimeout(() => {
            this.setPlayerCoordinatesToZero();      
            this.setAllDataMarksToFalse();
        }, 100);
    }

    handleDataSetTwo(e) {    
        this.setPlayerToZero(); 

        setTimeout(() => {
            this.setState({currentStats: ""});
            this.setState({data: files[2]});  
            this.setState({types: files[3]}); 
        }, 100);

        this.labelX = "Height(cm)";
        this.labelY = "Weight(kg)";  
        setTimeout(() => {
            this.setPlayerCoordinatesToZero();
            this.setAllDataMarksToFalse();      
        }, 100);   
    }

    handleDataSetThree(e) {    
        this.setPlayerToZero();

        setTimeout(() => {
            this.setState({currentStats: ""});
            this.setState({data: files[4]});  
            this.setState({types: files[5]}); 
        }, 100);

        this.labelX = "Height(cm)";
        this.labelY = "Weight(kg)";
        setTimeout(() => {
            this.setPlayerCoordinatesToZero();  
            this.setAllDataMarksToFalse();    
        }, 100);
    }
    
    setPlayerCoordinatesToZero(){
        let minX = Math.min.apply(Math, this.state.data.map(function(dataVar) { return dataVar.x; }));
        let maxY = Math.max.apply(Math, this.state.data.map(function(dataVar) { return dataVar.y; }));
        this.playerCoordinates=[minX, maxY];
    }
  
    handleChangeK(e) {    
        this.setState({k: e.target.value});  
    }

    handleSubmitK(e) {
        if(this.state.k > 0 && this.state.k <= this.state.data.length) this.knn();
        else alert("K value must be between 1 and " + this.state.data.length);
        e.preventDefault();
    }

    handleChangeFile(e) {    
        this.setState({file: e.target.files[0]});  
        document.getElementById("customFileLabel").innerHTML = e.target.files[0].name;
    }

    handleSubmitFile(e) {  
        if(this.state.file == null){
            alert("Upload a file first!");
            e.preventDefault();
            return;                
        } 
        this.setPlayerToZero(); 

        let parseData = [];
        let parseTypes = [];
        let counter = 0;

        var guard = true;

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
            delimiter: ",",
            dynamicTyping: true,
            preview: this.maxEntries,
            encoding: "utf8",
            step: function(results, parser) {
                if(results.data.length < 3) {
                    guard = false;
                    alert("Missing data entry in row " + counter);
                    parser.abort();
                    return;
                }
                if(results.data.length > 3) {
                    guard = false;
                    alert("Too many entries in row " + counter);
                    parser.abort();
                    return;
                }
                if(typeof(results.data[0]) != "number" || results.data[0] < 0 || results.data[0] > 10000) {
                    guard = false;
                    alert("X parameter in row " + counter + " must be a number between 0 and 10000!");
                    parser.abort();
                    return;
                }
                if(typeof(results.data[1]) != "number" || results.data[1] < 0 || results.data[1] > 10000) {
                    guard = false;
                    alert("Y parameter in row " + counter + " must be a number between 0 and 10000!");
                    parser.abort();
                    return;
                }
                if(typeof(results.data[2]) != "string" || results.data[2].length > 30) {
                    guard = false;
                    alert("Type parameter in row " + counter + " must be a string up to 30 characters!");
                    parser.abort();
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
            if(guard === true){        
                this.setState({currentStats: ""});
                this.setState({data: parseData});
                this.setState({types: parseTypes});        
                this.labelX = "X";
                this.labelY = "Y";
                this.setPlayerCoordinatesToZero();
                this.setAllDataMarksToFalse();

                this.setState({file: null});  
                document.getElementById("customFileLabel").innerHTML = "Choose file";
            }
        }, 100);

        e.preventDefault();
    }

    mapDataBlocks(){
        let maxX = Math.max.apply(Math, this.state.data.map(function(dataVar) { return dataVar.x; }));
        let maxY = Math.max.apply(Math, this.state.data.map(function(dataVar) { return dataVar.y; }));

        let minX = Math.min.apply(Math, this.state.data.map(function(dataVar) { return dataVar.x; }));
        let minY = Math.min.apply(Math, this.state.data.map(function(dataVar) { return dataVar.y; }));

        this.minimums = [minX, minY];
        this.maximums = [maxX, maxY];

        let ratioX = 100;
        if(maxX != minX) ratioX = (parseInt(fieldCSS.width) - parseInt(DataBlockCSS.width))/(maxX-minX);

        let ratioY = 100;
        if(maxY != minY) ratioY = (parseInt(fieldCSS.height) - parseInt(DataBlockCSS.height))/(maxY-minY);

        this.ratios = [ratioX, ratioY];

        return this.state.data.map((dataVar) => <DataBlock x={((dataVar.x - minX) * ratioX)} y={(((maxY - dataVar.y)) * ratioY)} types={this.state.types} data={dataVar} setDataBlockStats={this.setDataBlockStats}/>);
    }

    mapTypes(){
        return this.state.types.map((typeVar) => 
            <div class="round-corners">
                <div style={{ paddingBottom:"10px", textAlign:"center" }}><span class="dot" style={{ "background-color": typeVar.color }}></span>
                <text>{typeVar.type.toUpperCase()}, count: {typeVar.count}</text></div>
                <MyColorPicker type={typeVar} setColor={this.setColor}/>
            </div>
        ); 
    }

    setColor(typeVar){
        this.setState({curenntColor: typeVar.color});
    }

    setDataBlockStats(stats){
        this.setState({currentStats: stats});
    }

    setPlayerCoordinates(coordiantes){
        let maxY = this.maximums[1];
        this.playerCoordinates = [(coordiantes[0]/this.ratios[0])+this.minimums[0], maxY - (coordiantes[1]/this.ratios[1])];
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
        <div class="container-fluid" style={{marginTop:30}}> 
            <div class="row">
                <div class="col-md-6">                   
                    <form onSubmit={this.handleSubmitFile}>
                        <div class="custom-file"> 
                            <input type="file" accept=".txt,.csv" onChange={this.handleChangeFile} class="custom-file-input  mb-2 mr-sm-2" id="customFile" name="filename"></input>
                            <label class="custom-file-label" for="customFile" id="customFileLabel">Choose file</label>                           
                            <button type="submit" class="btn btn-primary mb-2">Submit</button>
                        </div>   
                    </form>
                    <h3 style={{ marginTop:"20px" }}>Demo data sets:</h3>
                    <button class="btn btn-primary mb-2" onClick={this.handleDataSetOne} style={{ marginRight:"10px", width:"130px" }}>Chess players</button>
                    <button class="btn btn-primary mb-2" onClick={this.handleDataSetTwo} style={{ marginRight:"10px", width:"130px" }}>Elephants</button>
                    <button class="btn btn-primary mb-2" onClick={this.handleDataSetThree} style={{ marginRight:"10px", width:"130px" }}>Dogs</button>
                    <hr style={{marginTop:30}}></hr>
                    <h2>Data blocks:</h2>
                    { this.mapTypes() }  
                    <hr></hr>
                    <h2>Block stats:</h2>
                    <p>X: {this.state.currentStats.x} </p>
                    <p>Y: {this.state.currentStats.y} </p>
                    <p>Type: {this.state.currentStats.type} </p>   
                    <hr></hr>
                </div>
                <div class="col-md-6" >  
                    <form onSubmit={this.handleSubmitK} class="form-inline">
                        <label for="knn" class="mr-sm-2">K value: </label>
                        <input type="text" value={this.state.k} onChange={this.handleChangeK} id="knn" class="form-control mb-2 mr-sm-2"/>
                        <button type="submit" class="btn btn-primary mb-2">Submit</button>                        
                    </form>                 
                    <div className='data-area' id="app">                  
                        <Player setPlayerCoordinates={this.setPlayerCoordinates} setToZero = {this.setToZero}/>
                        { this.mapDataBlocks() }      
                        <div style={{ position: "absolute", left: "452px", top: "350px", transform: "rotate(-90deg)", height:"10px", width:"500px" }}><text>{this.labelY}: {this.minimums[1]} -> {this.maximums[1]}</text></div>
                        <text style={{ position: "absolute", bottom: "-20px"}}>{this.labelX}: {this.minimums[0]} -> {this.maximums[0]}</text>  
                    </div>                                         
                </div>                
            </div>
        </div>  
      );
    }
}
 
export default Field;