import React, { Component } from 'react'
import Visualizer from './visualizer'
import getDrawMethod from './draw'

export default class AudioVision extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visualizer: null
    }
  }

  static defaultProps = {
    src: null,
    bars: 64,
    barColor: 'black',
    height: 300,
    width: 600,
    pause: false,
    volume: 0.6
  }

  resize = () => {
    const { width, height } = this.props
    const canvas = this.canvas
    canvas.width = width
    canvas.height = height
  }

  play = () => {
    const { src } = this.props
    if (src instanceof Blob) {
      const fileReader = new FileReader()
      fileReader.onload = e => {
        this.state.visualizer.play(e.target.result)
      }
      fileReader.readAsArrayBuffer(src)
    } else if (typeof src === 'string') {
      this.state.visualizer.play(src)
    }
  }

  componentDidMount() {
    const ctx = this.canvas.getContext('2d')
    const { height, width, bars, barColor, volume } = this.props
    const param = { ctx, height, width, bars, barColor }
    this.setState({
      visualizer: new Visualizer({
        size: bars,
        draw: getDrawMethod(param),
        volume
      })
    }, this.play)
    this.resize()
  }

  componentDidUpdate(prevProps) {
    const {
      src: prevSrc,
      pause: prevPause,
      volume: prevVolume,
      height: prevHeight,
      width: prevWidth
    } = prevProps
    const { visualizer } = this.state
    const { src, pause, volume, height, width } = this.props
    if (prevSrc !== src) {
      this.play()
    }
    if (prevPause !== pause) {
      visualizer[pause ? 'pause' : 'resume']()
    }
    if (prevVolume !== volume) {
      visualizer.updateVolume(volume)
    }
    if (prevHeight !== height || prevWidth !== width) {
      this.resize()
    }
  }

  componentWillUnmount() {
    this.state.visualizer.stop()
  }

  render() {
    return (
      <div className="react-audio-vision">
        <canvas ref={ref => { this.canvas = ref }}/>
      </div>
    )
  }
}
