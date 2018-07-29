/*
 * https://github.com/cwilso/metronome
 */

import createTimer from './create-timer'

const lookahead = 0.025
const scheduleAheadTime = lookahead * 4
const notesInQueue = []

let audioContext = null
let schedule = null
let playing = false
// What note is currently last scheduled?
let current16thStep = 0
// tempo (in beats per minute)
let tempo = 0
let timePer16thStep = 0
// How frequently to call scheduling function (sec)
// How far ahead to schedule audio (sec) overlapping with next interval in case the timer is late
let nextStepTime = 0.0
let lastStep = -1
let timer = null

function setTempo (value) {
  tempo = value
  timePer16thStep = 60.0 / tempo / 4
}

function nextStep () {
  // Advance current note and time by a 16th note
  // Add beat length to last beat time
  nextStepTime += timePer16thStep

  // Advance the beat number, wrap to zero
  current16thStep++
  if (current16thStep === 16) {
    current16thStep = 0
  }
}

function scheduleStep (beatNumber, time) {
  // push the note on the queue, even if we're not playing.
  notesInQueue.push({note: beatNumber, time: time})

  schedule(beatNumber, time)
}

function scheduler () {
  // while there are notes that will need to play before the next interval,
  // schedule them and advance the pointer.
  while (nextStepTime < audioContext.currentTime + scheduleAheadTime) {
    scheduleStep(current16thStep, nextStepTime)
    nextStep()
  }
}

export function play () {
  if (playing) {
    return
  }
  playing = true
  current16thStep = 0
  nextStepTime = audioContext.currentTime
  timer.postMessage('start')
}

export function stop () {
  if (!playing) {
    return
  }
  playing = false
  timer.postMessage('stop')
}

function getCurrentStep () {
  let currentStep = lastStep

  const currentTime = audioContext.currentTime

  while (notesInQueue.length && notesInQueue[0].time < currentTime) {
    currentStep = notesInQueue[0].note
    notesInQueue.shift()
  }

  lastStep = currentStep

  return currentStep
}

export function createScheduler (context, cb) {
  audioContext = context
  schedule = cb

  setTempo(60)

  timer = createTimer()
  timer.onmessage = () => scheduler()
  timer.postMessage({interval: lookahead})

  return {
    play,
    stop,
    getCurrentStep,
    setTempo,
    get playing () {
      return playing
    }
  }
}
