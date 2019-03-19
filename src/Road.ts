import {vec3, vec2, mat3, vec4, glMatrix} from 'gl-matrix';
import Turtle from './turtle';
import TurtleStack from './turtleStack'
import Map from './map'
import Edge from './edge';
import Intersection from './intersection'
import {worley} from './noiseFunctions';
import { gl } from './globals';






class Road {
    turtleStack: TurtleStack = new TurtleStack();
    currTurtle: Turtle; 
    mapTexture: Array<vec4>;
    mapWidth: number;
    mapHeight: number;

    edges: Set<Edge> = new Set();
    intersections: Set<Intersection> = new Set();

    transformations: mat3[] = new Array();


    constructor (texture: Array<vec4>, width: number, height: number) {
        this.currTurtle = new Turtle(vec3.fromValues(Math.random() - 0.5, Math.random() - 0.5, 1), vec3.fromValues(0, 1, 0), vec3.fromValues(1, 0, 0), 1, false, 2, 3);
        // this.currTurtle = new Turtle(vec3.fromValues(-1.0,-1.0, 1), vec3.fromValues(0, 1, 0), vec3.fromValues(1, 0, 0), 1);

        this.mapTexture = texture;
        this.mapWidth = width;
        this.mapHeight = height;
        this.updateState();
    }

    updateState() {
        let rotateAmt = 45;
        for (var i = 0; i < 7; i++) {
            // this.rotateTurtle(0);

            this.placeEdge(0.1, 0.005);

            if (this.currTurtle.branchDelay == 0) {
                this.saveTurtle();
                console.log("save turtle" + i);

                this.currTurtle.branchDelay = 2;
                // this.rotateTurtle(Math.PI / 4);

            }
            if (this.currTurtle.killDelay == 0) {
                console.log("pre killing turtle" + i);

                if (this.turtleStack.stack.length > 0) {
                    console.log("killing turtle" + i);
                    this.resetTurtle();
                    rotateAmt *= -1;

                }
                this.currTurtle.killDelay = 3;

            }
            this.currTurtle.killDelay --;
            this.currTurtle.branchDelay --;
            this.rotateTurtle(rotateAmt);
        }
    }



    placeEdge(length: number, width: number) {
        let newEdge = new Edge(this.currTurtle.position, length, this.currTurtle.forward, 1.0);
        // let center = vec3.create();
        // vec3.add(center, newEdge.origin, newEdge.endpoint); 
        // vec3.multiply(center, vec3.fromValues(0.5, 0.5, 0.5), center);

        let translateMatrix = mat3.create();
        let identity = mat3.create();
        mat3.identity(identity);
        mat3.translate(translateMatrix, identity, vec2.fromValues(newEdge.origin[0], newEdge.origin[1]));

        let xScale = width;
        let yScale = length;
        let scaleMatrix = mat3.create();
        identity = mat3.create();
        mat3.identity(identity);
        mat3.scale(scaleMatrix, identity, vec2.fromValues(xScale, yScale));


        let baseDirection: vec2 = vec2.fromValues(0, 1);
        let forwardDir: vec2 = vec2.fromValues(newEdge.direction[0], newEdge.direction[1]);

        let theta = Math.acos(vec2.dot(baseDirection, forwardDir) / (vec2.length(baseDirection) * vec2.length(forwardDir)));
        identity = mat3.create();
        mat3.identity(identity);
        let rotMatrix = mat3.create();
        mat3.rotate(rotMatrix, identity, theta);

        let transform = mat3.create();
        mat3.multiply(transform, translateMatrix, rotMatrix);
        mat3.multiply(transform, transform, scaleMatrix);

        this.transformations.push(transform);

        this.currTurtle.moveForward(length);
    }

    saveTurtle() {
        this.turtleStack.push(this.currTurtle);
    }

    resetTurtle() {
        this.currTurtle = this.turtleStack.pop();
    }

    rotateTurtle(theta: number) {
        this.currTurtle.rotate(theta);
    }

    getTerrain(x: number, y: number) : number {
        let terrainColor: vec4 = this.mapTexture[x + this.mapWidth * y];
        let blue: number = terrainColor[2];
        if (blue > 0.0){
            return 0; // Water
        } else {
            return 1; // Land
        }
    }

    getPopulation(x: number, y: number) : number {
        let populationVector: vec4 = this.mapTexture[x + this.mapWidth * y];
        let population: number = populationVector[3];
        return population;
    }



}

export default Road;
