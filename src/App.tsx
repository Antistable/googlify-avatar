import React, { createRef, TouchEvent, MouseEvent, RefObject } from 'react';
import './App.css';

class App extends React.Component {

  canvas: RefObject<HTMLCanvasElement> = createRef();

  context: CanvasRenderingContext2D = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;

  state = {
    color: '#bfbfbf'
  }

  render() {
    return (
      <>
        <canvas
          width={window.innerWidth - 40}
          height={window.innerHeight - 40}
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
    this.draw(x, y);
  }

  mouse(e: MouseEvent) {
    if (e.buttons === 1) {
      const x = e.clientX;
      const y = e.clientY;
      this.draw(x, y);
    }
  }

  draw(x: number, y: number) {
    this.context.beginPath();
    this.context.arc(x, y, 20, 0, 2 * Math.PI);
    this.context.fillStyle = this.state.color;
    this.context.fill();
    this.context.closePath();
  }

}

export default App;