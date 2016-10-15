import { VueComponent, Prop, Watch } from 'vue-typescript'
import * as _ from 'lodash'
import { CIRCLE_SIZE, FONT_STYLE, BUFFER, CIRCLE_DURATION, TIMER, VERT_BUFFER, MAX_CIRCLES } from '../../utils/constants'
const SVG: any = require('svgjs')
const Visibility = require('visibilityjs')
// declare const Two: any // Two.js Namespace

@VueComponent({
  template: require('./stage.html')
})
export class Stage extends Vue {

  timer: any = {}
  circles: any[] = [] // The incoming circles array
  integratedCircles: any[] = []
  circleIn: number = 1 // number of circles going in
  circleOut: number = 1 // number of circles going out
  rect: any
  draw: any
  rectHeight = 100

  @Prop width: number = 350 // default value
  @Prop height: number = 150 // default value
  @Prop autoStart: boolean
  @Prop pause: boolean = false
  @Prop showControls: boolean
  @Prop initCircleIn: number = 1
  @Prop initCircleOut: number = 1

  ready() {
    this.constructScene()
    this.circleIn = this.initCircleIn
    this.circleOut = this.initCircleOut
    if (this.autoStart) {
      setTimeout(() => this.startAnimation(), 100)
    }
  }
  constructScene() {
    this.draw = SVG(this.$el.querySelector('.stage')).size(this.width, this.height)
    Object.freeze(this.draw) // Freeze draw to prevent vue from watching it

    this.rect = this.draw.rect(this.width / 2, this.rectHeight).move(this.width / 4, VERT_BUFFER)
    Object.freeze(this.rect) // Freeze draw to prevent vue from watching it
    this.rect.fill('#00C8FF')


  }
  get playbackText(): string {
    return this.timer === undefined ? 'Play' : 'Pause'
  }
  createCircles() {
    const verticalSpacing = this.rectHeight / CIRCLE_SIZE
    const ciclePerLine = Math.floor(this.rectHeight / verticalSpacing) // how many circles can fit in one line
    _.times(this.circleIn, (i) => {
      const circle = this.draw.circle(CIRCLE_SIZE)
      circle.fill('#FF8000')
      circle.stroke('#FF4500')
      this.circles.push(circle)
      circle.move(BUFFER, VERT_BUFFER + 3 + (verticalSpacing + CIRCLE_SIZE) * (i))
    })

  }
  animateCircles() {
    const horizontalSpacing = 1.5 * CIRCLE_SIZE
    this.timer = Visibility.every(TIMER, () => {
      // Create a new circle array
      this.circles = []
      this.createCircles()
      if (this.integratedCircles.length >= MAX_CIRCLES) { this.reset() }
      // Loop through each circle indivually
      const endOfBox = BUFFER * 2 - CIRCLE_SIZE + this.width / 2 // the end of the box x position
      const outsideBox = endOfBox + BUFFER * 2 // far outside box x position
      const startOfBox = this.rect.x() + horizontalSpacing // start of box X position
      // Duration to take to move circle to start of Box x position
      const startOfBoxDuration = CIRCLE_DURATION * (startOfBox - BUFFER) / (outsideBox - BUFFER)
      _.each(this.circles, (circle, i) => {
        // Calculate the End of Box duration and Distance 
        if (i < this.circleOut) {
          // These circles are removed from the stage at end of animation.  They go into and out of the box
          this.moveCircle(circle, { duration: CIRCLE_DURATION, ease: '=' }, outsideBox).after(() => {
            circle.remove()
          })
        } else {
          // These circles persist/integrated into the box
          // they will be removed from the circles array and added to the integrated circles array
          // First need to move just a little into the box, then it needs to go to its final position
          this.moveCircle(circle, { duration: startOfBoxDuration, delay: 0, ease: '=' }, startOfBox).after(() => {
            this.integratedCircles.push(circle)
            this.circles.$remove(circle)
            const {xPos, yPos} = this.calcIntegratedPosition() // Calculate the postion to place in box
            const endPosDuration = CIRCLE_DURATION * (Math.sqrt(Math.pow(xPos, 2) + Math.pow(yPos, 2)) - circle.x()) / (outsideBox - BUFFER)
            // Move to final postion
            this.moveCircle(circle, { duration: endPosDuration, ease: '=' }, xPos, yPos )
          })
        }

      })
              // Now to remove circles if the mass balance is negative 
      if (this.circleOut > this.circleIn) {
        const numToPop = this.circleOut - this.circleIn
        _.times(numToPop, () => {
          if (this.integratedCircles.length < 1) { return }
          const circle = this.integratedCircles.pop()
          const duration = CIRCLE_DURATION * (outsideBox - circle.x()) / (outsideBox - BUFFER)
          const delay = CIRCLE_DURATION - duration
          // Duration changes and timing
          this.moveCircle(circle, { duration, ease: '=', delay }, outsideBox).after(() => {
            circle.remove()
          })
        })
      }
    })
  }
  calcIntegratedPosition(){
    // calculate an x and y postion of where to place this next integrated circle
    const verticalSpacing = this.rectHeight / CIRCLE_SIZE
    const horizontalSpacing = 1.5 * CIRCLE_SIZE
    const i = (this.integratedCircles.length - 1)

    const endOfBox = 2 * BUFFER - CIRCLE_SIZE + this.width / 2
    const xPos = endOfBox - (horizontalSpacing) * (Math.floor(i / 5))
    const yPos = VERT_BUFFER + 3 + (verticalSpacing + CIRCLE_SIZE) * (i % 5)

    return { xPos, yPos}
  }
  moveCircle(circle, options, distanceX, distanceY = 0) {
    distanceY = distanceY === 0 ? circle.y() : distanceY
    return circle.animate(options).move(distanceX, distanceY)
  }
  reset() {
    _.each(this.integratedCircles, (circle, i) => {
      circle.remove()
    })
    this.integratedCircles = []
  }
  startAnimation() {
    this.animateCircles()
  }
  toggleState() {
    if (this.timer === undefined) {
      this.animateCircles()
    } else {
      Visibility.stop(this.timer)
      this.timer = undefined
    }
  }
}
