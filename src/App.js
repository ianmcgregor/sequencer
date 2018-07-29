import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import reducers from './reducers'
import sono from 'sono'
import array from 'usfl/array/array'
import Sequencer from './components/sequencer'
import {loadText} from './components/text'

const soundFiles = [{
  id: 'kick',
  url: ['audio/808-Kicks01.ogg', 'audio/808-Kicks01.mp3']
}, {
  id: 'snare',
  url: ['audio/808-Snare02.ogg', 'audio/808-Snare02.mp3']
}, {
  id: 'hihat',
  url: ['audio/808-HiHats06.ogg', 'audio/808-HiHats06.mp3']
}, {
  id: 'clap',
  url: ['audio/808-Clap06.ogg', 'audio/808-Clap06.mp3']
}]

const store = createStore(reducers, {
  playing: false,
  tempo: 60,
  sounds: soundFiles.reduce((ob, s) => {
    ob[s.id] = Object.assign({}, s, {
      sound: sono.create(s),
      steps: array(16, 0)
    })
    return ob
  }, {}),
  soundIds: soundFiles.map(s => s.id),
  selectedSoundId: soundFiles[0].id
})

class App extends Component {
  async componentDidMount () {
    await loadText({
      font: 'font/Roboto-msdf.json',
      image: 'font/Roboto-msdf.png'
    })
    this.sequencer = new Sequencer()
    await this.sequencer.create(store, this.el)
    this.sequencer.start()
    window.addEventListener('resize', this.sequencer.resize)
  }

  render () {
    return <div ref={el => (this.el = el)} />
  }
}

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
)
