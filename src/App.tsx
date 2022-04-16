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

  brushColors: Map<string, string> = new Map([
    ['r', '#EB4334'],
    ['g', '#35AA53'],
    ['b', '#4286F3'],
    ['y', '#FAC230']
  ])

  outlinedImageColorArray: Uint8ClampedArray = new Uint8ClampedArray();

  currentBrushColor: string = '#bfbfbf'

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

        {
          <>
            <img src={require('./img/re.png')} onClick={() => this.reOutline()} />
            <img src={require('./img/open.png')} onClick={() => this.save()} />
          </>
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

  save() {
    const link = document.createElement('a');
    link.download = 'avatar.png';
    link.href = this.canvas.current?.toDataURL() as string;
    link.click();
  }

  touch(e: TouchEvent) {
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    this.draw(x - (this.canvas.current?.offsetLeft as number), y - (this.canvas.current?.offsetTop as number));
  }

  mouse(e: MouseEvent) {
    if (e.buttons === 1) /* if pressing */ {
      const x = e.clientX;
      const y = e.clientY;
      this.draw(x - (this.canvas.current?.offsetLeft as number), y - (this.canvas.current?.offsetTop as number));
    }
  }

  draw(x: number, y: number) {
    const context = this.canvas.current?.getContext('2d') as CanvasRenderingContext2D;

    // make iOS Chrome compatible
    this.canvas.current?.getContext('2d')?.putImageData(this.canvas.current?.getContext('2d')?.getImageData(0, 0, this.canvas.current.width, this.canvas.current.height) as ImageData, 0, 0);

    // draw circle
    context.beginPath();
    context.arc(x, y, 20, 0, 2 * Math.PI);
    context.fillStyle = this.currentBrushColor;
    context.fill();
    context.closePath();

    // remove excess
    if (this.state.stage === Stage.Color) {
      let coloredImageData = this.canvas.current?.getContext('2d')?.getImageData(0, 0, this.canvas.current.width, this.canvas.current.height) as ImageData;
      let coloredImageColorArray = coloredImageData.data;
      for (let index = 3; index < coloredImageColorArray.length; index += 4) {
        if (this.outlinedImageColorArray[index] === 0) /*if pixel wasn't outlined */ {
          // set transperancy 0
          coloredImageColorArray[index] = 0;
        }
      }
      this.canvas.current?.getContext('2d')?.putImageData(coloredImageData, 0, 0);
    }
  }

  changeColor(color: string) {
    this.currentBrushColor = this.brushColors.get(color) as string;
  }

  goColor() {
    this.currentBrushColor = this.brushColors.get('y') as string;
    this.outlinedImageColorArray = this.canvas.current?.getContext('2d')?.getImageData(0, 0, this.canvas.current.width, this.canvas.current.height).data as Uint8ClampedArray;
    this.setState({ stage: Stage.Color });
  }

  reOutline() {
    this.currentBrushColor = '#bfbfbf';
    this.setState({ stage: Stage.Outline });
    this.canvas.current?.getContext('2d')?.clearRect(0, 0, (this.canvas.current as HTMLCanvasElement).width, (this.canvas.current as HTMLCanvasElement).height);
  }

}

export default App;