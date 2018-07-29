let container = null
let lastDrawnStep = -1

export default function createUI (scheduler) {
  function draw () {
    window.requestAnimationFrame(draw)

    const currentStep = scheduler.getCurrentStep()

    if (lastDrawnStep !== currentStep) {
      container.innerHTML = currentStep
      // const x = Math.floor(canvas.width / 18);
      // for (let i = 0; i < 16; i++) {
      //     canvasContext.fillStyle = currentStep === i ? (currentStep % 4 === 0 ? 'red' : 'blue') : 'black';
      //     canvasContext.fillRect(x * (i + 1), x, x / 2, x / 2);
      // }
      lastDrawnStep = currentStep
    }
  }

  container = document.createElement('div')
  container.style.color = 'white'
  container.style.fontSize = '60px'
  container.style.position = 'fixed'
  container.style.top = '0'
  container.style.right = '50%'
  container.style.zIndex = '10000'
  document.body.appendChild(container)

  const playPause = document.createElement('button')
  playPause.style.background = 'white'
  playPause.style.position = 'fixed'
  playPause.style.top = '80px'
  playPause.style.right = '50%'
  playPause.style.zIndex = '10000'
  playPause.innerHTML = 'PLAY'
  playPause.addEventListener('click', () => {
    if (scheduler.playing) {
      scheduler.stop()
    } else {
      scheduler.play()
    }
    playPause.innerHTML = scheduler.playing ? 'STOP' : 'PLAY'
  })
  document.body.appendChild(playPause)

  const tempo = document.createElement('input')
  tempo.type = 'number'
  tempo.style.position = 'fixed'
  tempo.style.top = '120px'
  tempo.style.right = '50%'
  tempo.style.zIndex = '10000'
  tempo.value = scheduler.bpm
  tempo.min = 1
  tempo.max = 300
  document.body.appendChild(tempo)
  tempo.addEventListener('change', () => scheduler.setTempo(tempo.value))

  draw()
}
