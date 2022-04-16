import React, { createRef, TouchEvent, MouseEvent, RefObject } from 'react';
import './App.css';

enum Stage {
  Outline,
  Color,
}

class App extends React.Component<any, {
  stage: Stage,
}> {

  canvas: RefObject<HTMLCanvasElement> = createRef();

  context: CanvasRenderingContext2D = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;

  colors = new Map([
    ['r', '#EB4334'],
    ['g', '#35AA53'],
    ['b', '#4286F3'],
    ['y', '#FAC230']
  ])

  outlinedImageColorArray = document.createElement('canvas').getContext('2d')?.getImageData(0, 0, 1, 1).data;

  color = '#bfbfbf'

  state = {
    stage: Stage.Outline,
  }

  render() {
    return (
      <>
        {
          this.state.stage === Stage.Outline ? (
            <img
              src={require('./img/forward.png')}
              onClick={() => this.goColor()}
              className='button'
            />
          ) : (
            ['r', 'g', 'b', 'y'].map(color =>
              <img
                key={color}
                src={require(`./img/${color}.png`)}
                onClick={() => this.changeColor(color)}
                className='button'
              />
            )
          )
        }

        <canvas
          width={window.innerWidth - 80}
          height={window.innerHeight - 80}
          onTouchMove={(e: TouchEvent) => { this.touch(e); }} // PC
          onMouseMove={(e: MouseEvent) => { this.mouse(e); }} // Mobile
          ref={this.canvas}
        />
      </>
    );
  }

  componentDidMount() {
    this.context = this.canvas.current?.getContext('2d') as CanvasRenderingContext2D;
  }

  touch(e: TouchEvent) {
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    this.draw(x - (this.canvas.current?.offsetLeft as number), y - (this.canvas.current?.offsetTop as number));
  }

  mouse(e: MouseEvent) {
    if (e.buttons === 1) {
      const x = e.clientX;
      const y = e.clientY;
      this.draw(x - (this.canvas.current?.offsetLeft as number), y - (this.canvas.current?.offsetTop as number));
    }
  }

  draw(x: number, y: number) {
    const context = this.canvas.current?.getContext('2d') as CanvasRenderingContext2D;;
    context.beginPath();
    context.arc(x, y, 20, 0, 2 * Math.PI);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
    if (this.state.stage === Stage.Color) {
      let coloredImageData = this.canvas.current?.getContext('2d')?.getImageData(0, 0, this.canvas.current.width, this.canvas.current.height) as ImageData;
      let colorsArray = coloredImageData.data;
      for (let index = 0; index < colorsArray.length; index++) {
        if ((this.outlinedImageColorArray as Uint8ClampedArray)[index] === 0) {
          colorsArray[index] = 0;
        }
      }
      this.canvas.current?.getContext('2d')?.putImageData(coloredImageData, 0, 0);
    }
  }

  changeColor(color: string) {
    this.color = this.colors.get(color) as string;
  }

  goColor() {
    this.setState({ stage: Stage.Color });
    this.outlinedImageColorArray = this.canvas.current?.getContext('2d')?.getImageData(0, 0, this.canvas.current.width, this.canvas.current.height).data;
  }

}

export default App;