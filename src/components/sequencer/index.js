import fps from 'usfl/fps'
import gui from 'usfl/gui'
import World from '../world'
import {createScene} from '../scene'
import loop from 'usfl/loop'
import observeStore from '../../utils/observeStore'
import sono from 'sono'
import {createScheduler} from '../scheduler'
import bleep from '../scheduler/bleep'

export default class Sequencer {
  lastDrawnStep = -1
  metronome = true

  async create (store, el) {
    this.store = store

    this.world = new World({
      el,
      fov: 65
    })
    this.world.camera.position.set(0, 10, 12)
    this.world.camera.lookAt(this.world.container.position)
    this.world.container.rotation.x = 0.2

    this.scene = createScene({
      dispatch: store.dispatch,
      world: this.world,
      tempo: store.getState().tempo,
      sounds: store.getState().soundIds
    })

    this.scene.updateSound(store.getState().selectedSoundId)

    this.scheduler = createScheduler(sono.context, this.schedule)

    store.getState().soundIds.map(key => {
      observeStore(store, state => state.sounds[key], sound => {
        console.log('=>', key, store.getState().selectedSoundId)
        if (key === store.getState().selectedSoundId) {
          // console.log('=> ', sound);
          console.log('=> steps:', sound.steps)
        }
        this.scene.updatePattern(sound.steps, sound.id)
      })
    })

    observeStore(store, state => state.playing, playing => {
      console.log('=> playing:', playing)
      if (playing) {
        this.scheduler.play()
      } else {
        this.scheduler.stop()
      }
    })

    observeStore(store, state => state.tempo, tempo => {
      console.log('=> tempo:', tempo)
      this.scheduler.setTempo(tempo)
    })

    observeStore(store, state => state.selectedSoundId, selectedSoundId => {
      console.log('=> selectedSoundId:', selectedSoundId)
      console.log('store.getState().sounds', store.getState().sounds)
      console.log('store.getState().sounds', store.getState().sounds[selectedSoundId].steps)
      this.scene.updateSound(selectedSoundId)
      this.scene.updatePattern(store.getState().sounds[selectedSoundId].steps, selectedSoundId)
    })

    this.gui = await gui()
    this.gui.add(this, 'metronome')
    this.gui.add(this.world.camera.position, 'x', -50, 50).listen()
    this.gui.add(this.world.camera.position, 'y', -50, 50).listen()
    this.gui.add(this.world.camera.position, 'z', -50, 50).listen()
  }

  start = () => {
    loop.add(this.update)
    loop.start()
  }

  schedule = (beatNumber, time) => {
    if (this.metronome) {
      bleep(sono.context, beatNumber, time)
    }

    // const {steps} = store.getState();
    const {sounds, soundIds} = this.store.getState()
    soundIds.map(key => {
      const {steps, sound} = sounds[key]
      for (let j = 0; j < steps.length; j++) {
        // console.log('beatNumber', j);
        if (beatNumber === j && steps[j]) {
          // console.log('play', j, time, sound);
          sound.play(time - sono.context.currentTime)
          // console.log(kick.sourceInfo);
        }
      }
    })
  }

  update = () => {
    const currentStep = this.scheduler.getCurrentStep()

    if (this.lastDrawnStep !== currentStep) {
      this.scene.update(currentStep)
      this.lastDrawnStep = currentStep
    }
    this.world.render()
    fps.update()
  }

  resize = () => {
    this.world.resize()
  }
}
