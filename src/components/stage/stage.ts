import { VueComponent, Prop, Watch } from 'vue-typescript'
import * as _ from 'lodash'
import { CIRCLE_SIZE, FONT_STYLE, BUFFER, CIRCLE_DURATION, TIMER } from '../../utils/constants'
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
  draw: any = {} // stage canvas

  @Prop width: number = 350 // default value
  @Prop height: number = 200 // default value
  @Prop autoStart: boolean = false
  @Prop pause: boolean = false
  @Prop circleIn: number = 2 // number of circles going in
  @Prop circleOut: number = 1 // number of circles going out

  ready() {
    this.constructScene()
    if (this.autoStart) {
      setTimeout(() => this.startAnimation(), 100)
    }
  }
  constructScene() {
    this.draw = SVG(this.$el.querySelector('.stage')).size(this.width, this.height)

    // two has convenience methods to create shapes.

    const rect = this.draw.rect(this.width / 2, this.height / 2).move(this.width / 4, BUFFER)
    rect.fill('#00C8FF')
    // this.createCircles()

  }
  createCircles() {
    const verticalSpacing = this.height / 2 / CIRCLE_SIZE
    const ciclePerLine = Math.floor(this.height / 2 / verticalSpacing) // how many circles can fit in one line
    _.times(this.circleIn, (i) => {
      const circle = this.draw.circle(CIRCLE_SIZE)
      circle.fill('#FF8000')
      circle.stroke('#FF4500')
      this.circles.push(circle)
      circle.move(BUFFER, BUFFER + 3 + (verticalSpacing + CIRCLE_SIZE) * (i))
    })
  }
  animateTest2() {
    const horizontalSpacing = CIRCLE_SIZE
    this.timer = Visibility.every(TIMER, () => {
      // Create a new circle array
      // console.log(this.integratedCircles)
      this.circles = []
      this.createCircles()
      _.each(this.circles, (circle, i) => {

        const endOfBox = circle.x() + BUFFER - horizontalSpacing + this.width / 2
        const endOfBoxDuration = CIRCLE_DURATION * (endOfBox - circle.x()) / (endOfBox + BUFFER * 2 - circle.x())
        if (i < this.circleOut) {
          // Just take the circle to the end of teh box
          this.circleAnimate(circle, { duration: CIRCLE_DURATION, ease: '=' }, endOfBox + BUFFER * 2).after(() => {
            circle.remove()
          })
        } else {
          // These circle need to stick around, they need to be removed from the circles array
          // and added to their own array that persists
          // First need to move just a little into the box, then it needs to go to its final position
          this.circleAnimate(circle, { duration: endOfBoxDuration, delay: 0, ease: '=' }, endOfBox)
          this.circles.$remove(circle)
          this.integratedCircles.push(circle)
        }
      })
    })
  }
  circleAnimate(circle, options, distance) {
    return circle.animate(options).move(distance, circle.y())
  }
  startAnimation() {
    // this.createCircles()
    this.animateTest2()
  }
}
