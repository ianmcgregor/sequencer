import {
  TOGGLE_STEP,
  CHANGE_TEMPO,
  SELECT_SOUND,
  TOGGLE_PLAY
} from '../actions'

const {assign} = Object

export default (state = {}, action) => {
  console.log('=>', action.type, JSON.stringify(action))
  switch (action.type) {
    case TOGGLE_STEP:
      const name = action.sound || state.selectedSound
      const sound = state.sounds[name]
      console.log('sound', sound)
      const newSteps = sound.steps.slice(0)
      newSteps[action.index] = newSteps[action.index] ? 0 : 1
      return assign({}, state, {
        sounds: assign({}, state.sounds, {
          [name]: Object.assign({}, sound, {
            steps: newSteps
          })
        })
      })
    case CHANGE_TEMPO:
      return assign({}, state, {
        tempo: action.tempo
      })
    case SELECT_SOUND:
      return assign({}, state, {
        selectedSound: action.sound
      })
    case TOGGLE_PLAY:
      console.log('TOGGLE_PLAY')
      return assign({}, state, {
        playing: !state.playing
      })
    default:
      return state
  }
}
