import React, { createRef, TouchEvent, MouseEvent, RefObject } from 'react';
import './App.css';

enum Stage {
  Outline,
  Color,
}

class App extends React.Component<{}, {
  stage: Stage,
}> {

  canvas: RefObject<HTMLCanvasElement> = createRef();

  outlinedImageColorArray: Uint8ClampedArray = new Uint8ClampedArray();

  currentBrushColor: string = '#444444'

  readonly brushColors: Map<string, string> = new Map([
    ['r', '#EB4334'],
    ['g', '#35AA53'],
    ['b', '#4286F3'],
    ['y', '#FAC230']
  ])

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

        <img src={require('./img/bg.png')} className='bg' />

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

    // draw circle
    context.beginPath();
    context.arc(x, y, 20, 0, 2 * Math.PI);
    context.fillStyle = this.currentBrushColor;
    context.fill();
    context.closePath();

    if (this.state.stage === Stage.Color) {
      // remove excess pixels
      let coloredImageData = this.canvas.current?.getContext('2d')?.getImageData(0, 0, this.canvas.current.width, this.canvas.current.height) as ImageData;
      let coloredImageColorArray = coloredImageData.data;
      for (let index = 3; index < coloredImageColorArray.length; index += 4) {
        const pixelAlphaBeforeColored = this.outlinedImageColorArray[index];
        if (pixelAlphaBeforeColored === 0) /* if pixel isn't outlined */ {
          // set current transperancy to 0
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
    // set brush color to yellow
    this.outlinedImageColorArray = this.canvas.current?.getContext('2d')?.getImageData(0, 0, this.canvas.current.width, this.canvas.current.height).data as Uint8ClampedArray;
    // get image data for comparison
    this.setState({ stage: Stage.Color });
  }

  reOutline() {
    this.currentBrushColor = '#444444';
    this.canvas.current?.getContext('2d')?.clearRect(0, 0, (this.canvas.current as HTMLCanvasElement).width, (this.canvas.current as HTMLCanvasElement).height);
    // clear all
    this.setState({ stage: Stage.Outline });
  }

}

export default App;