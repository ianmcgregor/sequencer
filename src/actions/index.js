export const TOGGLE_STEP = 'TOGGLE_STEP'
export const CHANGE_TEMPO = 'CHANGE_TEMPO'
export const SELECT_SOUND = 'SELECT_SOUND'
export const TOGGLE_PLAY = 'TOGGLE_PLAY'

export function toggleStep (index, sound) {
  return {type: TOGGLE_STEP, index, sound}
}

export function changeTempo (tempo) {
  return {type: CHANGE_TEMPO, tempo}
}

export function selectSound (sound) {
  return {type: SELECT_SOUND, sound}
}

export function togglePlay () {
  return {type: TOGGLE_PLAY}
}

// export function thunkAction(some) {
//     return dispatch => {
//
//     };
// }
