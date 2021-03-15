import logo from './logo.svg';
import './App.css';
import React, { createRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import Webcam from 'react-webcam';
import { drawFace } from './faceDrawing';
import { drawOutline } from './drawOutline';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      color: '',
      model: '',
    };

    this.getSelection = this.getSelection.bind(this);
    this.detect = this.detect.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.changeModel = this.changeModel.bind(this);
  }

  getSelection = async (selectedOption, webcam, canvas, color) => {
    console.log('getSelection');
    let neuralNetwork;

    if (selectedOption === 'Face') {
      // loads facemesh from tensorflow.js
      console.log('selected Face');
      neuralNetwork = await facemesh.load({
        // inputResolution: { width: 640, height: 480 },
        // shouldLoadIrisModel: true,
      });
    }

    if (selectedOption === 'Objects') {
      console.log('selected Objects');
      // loads cocossd from tensorflow.js
      neuralNetwork = await cocoSsd.load();
    }

    // setup continuous detection
    setInterval(() => {
      console.log('im executing', neuralNetwork);
      this.detect(neuralNetwork, webcam, canvas, selectedOption, color);
    }, 100);
  };

  detect = async (neuralNetwork, webcam, canvas, selectedOption, color) => {
    if (
      typeof webcam.current !== 'undefined' &&
      webcam.current !== null &&
      // check to ensure that we are receiving data
      webcam.current.video.readyState === 4
    ) {
      const { video } = webcam.current;
      const { videoHeight, videoWidth } = video;

      // force the video size - will make it easier to run detections
      webcam.current.video.width = videoWidth;
      webcam.current.video.height = videoHeight;

      // resize canvas to video size
      canvas.current.width = videoWidth;
      canvas.current.height = videoHeight;

      // make detections using neuralNetwork from tensorflow, and pass them to be drawn onto the canvas
      let detectedInput;
      const canvasContext = canvas.current.getContext('2d');

      if (selectedOption === 'Face') {
        detectedInput = await neuralNetwork.estimateFaces(video);
        console.log(detectedInput);
        drawFace(detectedInput, canvasContext, color);
      }

      if (selectedOption === 'Objects') {
        detectedInput = await neuralNetwork.detect(video);
        console.log(detectedInput);
        drawOutline(detectedInput, canvasContext, color);
      }
    }
  };

  changeColor(color) {
    this.setState({ color });
  }

  changeModel(model) {
    this.setState({ model });
  }

  render() {
    const webcam = createRef();
    const canvas = createRef();
    const { model, color } = this.state;
    console.log(this.state);

    return (
      <div className='App'>
        <div id='main-wrapper'>
          <div id='model-header'>
            <div id='model-text'>Model Options: </div>
            <button
              className='button button-css'
              onClick={() => this.changeModel('Face')}
            >
              FACE
            </button>
            <button
              className='button button-css'
              onClick={() => this.changeModel('Objects')}
            >
              OBJECTS
            </button>
            <button
              className='button-two button-css'
              onClick={() => {
                this.getSelection(model, webcam, canvas, color);
              }}
            >
              DETECT
            </button>
          </div>
          <div>
            {/* render our webcam */}
            <Webcam ref={webcam} id='webcam' />

            {/* render a canvas over the webcam to draw on */}
            <canvas ref={canvas} width='640' height='480' id='canvas'></canvas>
          </div>

          <div id='color-options'>
            <div id='color-option-text'>Color Options: </div>
            <button
              className='button-css red'
              onClick={() => this.changeColor('red')}
            >
              Red
            </button>
            <button
              className='button-css yellow'
              onClick={() => this.changeColor('yellow')}
            >
              Yellow
            </button>
            <button
              className='button-css blue'
              onClick={() => this.changeColor('blue')}
            >
              Blue
            </button>
            <button
              className='button-css cyan'
              onClick={() => this.changeColor('cyan')}
            >
              Cyan
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default App;
