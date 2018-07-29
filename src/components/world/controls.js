import {TweenLite} from 'gsap'

const PI2 = Math.PI * 2
const HALFPI = Math.PI / 2

export default class Controls {
  constructor (world) {
    this.world = world

    this.targetRotation = {
      y: 0,
      x: 0,
      z: 0
    }

    this.rotationOnDown = 0
    this.mouseX = 0
    this.mXOnMouseDown = 0
    this.windowHalfX = window.innerWidth / 2
    this.windowHalfY = window.innerHeight / 2
    this.fromTop = false
    this.active = false
    this.moving = false

    // this.$interfaceBtn = $('#interfacebtn');
    // this.$interfaceBtn.click(this.onInterfaceBtnClicked.bind(this));

    this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this)
    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this)
    this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this)
  }

  stop () {
    document.removeEventListener('mousedown', this.onDocumentMouseDown)
    document.removeEventListener('mousemove', this.onDocumentMouseMove)
    document.removeEventListener('mouseup', this.onDocumentMouseUp)
    document.removeEventListener('mouseout', this.onDocumentMouseUp)

    this.targetRotation.y = 0
    this.active = false
  }

  start () {
    // console.log('Controls.start');
    document.addEventListener('mousedown', this.onDocumentMouseDown)
    document.addEventListener('touchstart', this.onDocumentMouseDown)
    this.active = true
  }

  onInterfaceBtnClicked (event) {
    this.fromTop = !this.fromTop
    this.$interfaceBtn.toggleClass('active')
    if (this.fromTop) {
      this.move(this.getSnappedAngle(this.targetRotation.y) + Math.PI / 4, 1)
    } else {
      this.move(this.getSnappedAngle(this.targetRotation.y), this.world.camera.position.y, true)
    }
  }

  showTopViewButton () {
    this.$interfaceBtn.addClass('showing')
  }

  move (rotation, offset, unlock) {
    this.moving = true

    TweenLite.to(this.world.scene.rotation, 0.5, {y: rotation})

    TweenLite.to(this.world.camera.position, 0.5, {
      x: offset,
      z: offset,

      onUpdate: () => {
        this.world.camera.lookAt(this.world.scene.position)
      },

      onComplete: () => {
        if (unlock) {
          this.moving = false
        }
      }

    })
  }

  onDocumentMouseDown (event) {
    // event.preventDefault();

    document.addEventListener('touchmove', this.onDocumentMouseMove)
    document.addEventListener('mousemove', this.onDocumentMouseMove)

    document.addEventListener('touchend', this.onDocumentMouseUp)
    document.addEventListener('mouseup', this.onDocumentMouseUp)
    document.addEventListener('mouseout', this.onDocumentMouseUp)

    const x = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX
    this.mXOnMouseDown = x - this.windowHalfX
    this.rotationOnDown = this.targetRotation.y
  }

  onDocumentMouseMove (event) {
    const x = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX
    this.mouseX = x - this.windowHalfX
    this.targetRotation.y = (this.rotationOnDown + (this.mouseX - this.mXOnMouseDown) * 0.01)
  }

  onDocumentMouseUp (event) {
    document.removeEventListener('touchmove', this.onDocumentMouseMove)
    document.removeEventListener('mousemove', this.onDocumentMouseMove)

    document.removeEventListener('touchend', this.onDocumentMouseUp)
    document.removeEventListener('mouseup', this.onDocumentMouseUp)
    document.removeEventListener('mouseout', this.onDocumentMouseUp)

    this.targetRotation.y = this.getSnappedAngle(this.targetRotation.y)
  }

  getSnappedAngle (angle) {
    const wrappedAngle = angle % PI2
    let revolutions = Math.floor(angle / PI2)

    // augment revolutions of 1 if negative !!important!!
    if (angle < 0) {
      revolutions++
    }
    const snappedAngle = Math.round(wrappedAngle / HALFPI) * HALFPI + revolutions * PI2
    return snappedAngle
  }

  update () {
    if (!this.active) {
      return
    }
    if (!this.moving) {
      this.world.container.rotation.y += (this.targetRotation.y - this.world.container.rotation.y) * 0.05
    }
  }
}
