import React from 'react';
import AboutCSS from './About.scss';
import ReactEmbedGist from 'react-embed-gist';

function About(){
    return(
        <main role="main" class="container">
            <h1 class="mt-5">KNN algorithm visualizer</h1>
            <p class="lead">The intent of this project is to visualy present the KNN algorithm.
            K nearest neighbour(KNN) is a classification algorithm, which
            means that it assigns a class to an unknown object with known parameters from a provided data set consisting of objects with known parameters and their
            classes. KNN works by searching the provided data set for K objects closest to the unclassified object and than counting which class occurs most
            frequently among the K nearest neighbours, where K is the number of how many nearest objects shall be counted. The class that occurs most frequently is
            assigned to the unknown object.</p>
            <p class="lead">The distances to objects in the data set are calculated using the Euclidean distance formula. The data set can have unlimited data dimensions
            in theory, but becouse this is a visual project implemented in a browser we will limit our data sets to two dimensions of real numbers data plus a class.</p>
            <p class="lead">Read <a href="https://towardsdatascience.com/machine-learning-basics-with-the-k-nearest-neighbors-algorithm-6a6e71d01761">this</a> article for more details.</p>
            <h2>Demo data sets</h2>
            <p class="lead">There are three preprepared data sets ready to explore:
                <ul>
                    <li>Chess players with two parameters: their blitz and rapid ratings. They are classified into three classes: grandmasters, international masters and candidate
                        masters.</li>
                    <li>Elephants with two parameters: their height and weight. They are classified into two classes: indian elephants and african elephants.</li>
                    <li>Dogs with two parameters: their height and weight. They are classified into three classes: german shepherds, border collies and chihuahuas.</li>
                </ul>
            </p>
            <img src="./images/data_sets.png" class="img-fluid"></img>
            <p class="lead"><b>How does this work? </b>Example on the chess playes: Chess players have two parameters: their blitz and rapid ratings, and are classified into three classes: grandmasters, international masters and candidate
            masters. The better their ratings - the better the title. However, since these titles are held for life a player's score can drop but they retain their title.
            With the help of the algorithm we can find out which classification is the most likely for an unknown player based on his ratings.</p>
            <h2>Exploring data sets</h2>
            <p class="lead">The unknown object is represented by the green square - and you can control it by draging it! The data set objects are drawn as dots on the grid, each in
            it's own color, that represents it's class. On the top you have to set the K parameter than click on submit and than the app will give you the classification result. After that, the
            K nearest neighbors get a black circle mark around them.</p>
            <img src="./images/grid.png" style={{ border:"0px" }} class="img-fluid"></img>
            <p class="lead">You can change the classes colors with sliders under the Data block section, where you can also see the name and count of specific objects.</p>
            <img src="./images/colors.png" class="img-fluid"></img>
            <p class="lead">If you click on a dot it's X, Y and class variables will be shown in the Block stats section.</p>            
            <img src="./images/stats.png" class="img-fluid"></img>
            <p class="lead">All of the data in the grid is <b>scaled</b>! This is done so that the data will fit nicely on the grid. The labels on the sides of the grid show the minimums
            and maximums of the data on an axis.</p>
            <img src="./images/scaling.png" class="img-fluid"></img>
            <p class="lead">Scaling can be confusing as some dots may appear closer to the square but in reality they are not! This is shown in the image above with the elephant data set.
            The X axis is the height(cm) and the Y axis is the weight(kg).
            Because the elephants weight is so much larger than it's height we get this scaling. This can be useful however, becouse it can be an indication that we have to tweak the data set
            to make one parameter less decisive.</p>
            <h2>Make your own data set</h2>
            <p class="lead">You can also upload your own data set in the form of a csv file!</p>
            <img src="./images/file_upload.png" class="img-fluid"></img>
            <p class="lead">As mentioned we are limited to two parameters and one class, so the column format of the file is:
            X parameter, Y parameter, class. The delimiter used is the comma(","). A parameter is a number between 0 and 10000 and the class is a string of up to 30 characters. Only the first
            30 rows in the file will be parsed!</p>
            <ReactEmbedGist gist="zmazk123/5f7f9a0e9b26f7cecdbcd77a86552c00"/>
            <p class="lead">Keep in mind that the parsed file will also be scaled on the grid!</p>
        </main>
    )
}

export default About;