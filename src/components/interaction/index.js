import {
  Raycaster,
  Vector2
} from 'three'

class Interaction {
  constructor ({camera, objects = []}) {
    const raycaster = new Raycaster()
    const mouse = new Vector2()

    function onDocumentTouchStart (event) {
      event.preventDefault()

      event.clientX = event.touches[0].clientX
      event.clientY = event.touches[0].clientY

      onDocumentMouseDown(event)
    }

    function onDocumentMouseDown (event) {
      // event.preventDefault();

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      raycaster.setFromCamera(mouse, camera)

      console.log('onDocumentMouseDown', objects.length)

      const recursive = false
      const intersects = raycaster.intersectObjects(objects, recursive)

      if (intersects.length > 0) {
        console.log('CLICKED!', intersects.length)

        for (let i = 0; i < intersects.length; i++) {
          const ob = intersects[i].object
          if (ob.onMouseDown) {
            ob.onMouseDown()
          } else if (ob.parent.onMouseDown) {
            ob.parent.onMouseDown()
          } else if (ob.parent.parent.onMouseDown) {
            ob.parent.parent.onMouseDown()
          }
          // if (typeof intersects[i].object.onMouseDown === 'function') {
          //     intersects[i].object.onMouseDown();
          // }
        }

        // intersects[0].object.material.color.setHex(Math.random() * 0xffffff);

        document.addEventListener('mouseup', onDocumentMouseUp, false)
        document.addEventListener('touchend', onDocumentMouseUp, false)
      }
    }

    function onDocumentMouseMove (event) {
      event.preventDefault()

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      // console.log('mouse', mouse.x, mouse.y);

      raycaster.setFromCamera(mouse, camera)

      const intersects = raycaster.intersectObjects(objects)
      if (intersects.length > 0) {
        // console.log(intersects[0].point);s

        for (let i = 0; i < intersects.length; i++) {
          const ob = intersects[i].object
          if (ob.onMouseMove) {
            ob.onMouseMove(intersects[i].point, intersects[i])
          } else if (ob.parent.onMouseMove) {
            ob.parent.onMouseMove(intersects[i].point, intersects[i])
          } else if (ob.parent.parent.onMouseMove) {
            ob.parent.parent.onMouseMove(intersects[i].point, intersects[i])
          }
          // if (typeof intersects[i].object.onMouseDown === 'function') {
          //     intersects[i].object.onMouseDown();
          // }
        }
      }
    }

    function onDocumentMouseUp (event) {
      // event.preventDefault();

      for (let i = 0; i < objects.length; i++) {
        const ob = objects[i]
        if (ob.onMouseUp) {
          ob.onMouseUp()
        } else if (ob.parent.onMouseUp) {
          ob.parent.onMouseUp()
        } else if (ob.parent.parent.onMouseUp) {
          ob.parent.parent.onMouseUp()
        }
        // if (typeof objects[i].onMouseUp === 'function') {
        //     objects[i].onMouseUp();
        // }
      }
    }

    document.addEventListener('mousedown', onDocumentMouseDown, false)
    document.addEventListener('touchstart', onDocumentTouchStart, false)

    document.addEventListener('mousemove', onDocumentMouseMove, false)
    // document.addEventListener('touchmove', onDocumentTouchMove, false);
  }
}

export function observeInteractions (opts) {
  return new Interaction(opts)
}
