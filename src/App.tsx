import React, { createRef, TouchEvent, MouseEvent, RefObject } from 'react';
import './App.css';

enum Stage {
  Outline = 0,
  Color,
}

class App extends React.Component<any, {
  stage: Stage,
  color: string,
}> {

  canvas: RefObject<HTMLCanvasElement> = createRef();

  context: CanvasRenderingContext2D = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;

  colors = new Map([
    ['r', '#EB4334'],
    ['g', '#FFCE00'],
    ['b', '#00A8F0'],
    ['y', '#F0F000']
  ])

  state = {
    stage: Stage.Outline,
    color: '#bfbfbf',
  }

  render() {
    return (
      <>
        {
          this.state.stage === Stage.Outline ? (
            <img src={require('./img/forward.png')} onClick={() => this.nextStage()} />
          ) : (
            ['r', 'g', 'b', 'y'].map(color =>
              <img
                key={color}
                src={require(`./img/${color}.png`)}
                onClick={() => this.changeColor(color)}
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
    this.draw(x - 40, y - 40);
  }

  mouse(e: MouseEvent) {
    if (e.buttons === 1) {
      const x = e.clientX;
      const y = e.clientY;
      this.draw(x - 40, y - 40);
    }
  }

  draw(x: number, y: number) {
    const context = this.canvas.current?.getContext('2d') as CanvasRenderingContext2D;;
    context.beginPath();
    context.arc(x, y, 20, 0, 2 * Math.PI);
    context.fillStyle = this.state.color;
    context.fill();
    context.closePath();
  }

  changeColor(color: string) {
    this.setState({ color: this.colors.get(color) as string });
  }

  nextStage() {
    this.setState(state => { return { stage: state.stage + 1 } });
  }

}

export default App;