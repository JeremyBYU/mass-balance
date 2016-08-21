import { VueComponent, Prop, Watch } from 'vue-typescript'
import * as _ from 'lodash'
import { CIRCLE_SIZE, FONT_STYLE, BUFFER } from '../../utils/constants'
const SVG: any = require('svgjs')
// declare const Two: any // Two.js Namespace

@VueComponent({
  template: require('./stage.html')
})
export class Stage extends Vue {

  @Prop width: number = 350 // default value
  @Prop height: number = 200 // default value
  @Prop autoStart: boolean = false
  // objects as default values don't need to be wrapped into functions
  @Prop
  object: { default: string } = { default: 'Default object property!' }
  circles = []
  circleIn: number = 5 // circles going in
  circleOut: number = 3 // circles going out
  draw: any = {} // stage canvas
  @Watch('$route.path')
  pathChanged() {
    console.log('Changed current path to: ' + this.$route.path);
  }
  ready() {
    this.constructScene()
    if (this.autoStart) {
      this.startAnimation()
    }
  }
  constructScene() {
    this.draw = SVG(this.$el.querySelector('.stage')).size(this.width, this.height)

    // two has convenience methods to create shapes.
    const startingX = 10
    const spacing = this.height / 2 / CIRCLE_SIZE
    const ciclePerLine = Math.floor(this.height / 2 / spacing) // how many circles can fit in one line

    const rect = this.draw.rect(this.width / 2, this.height / 2).move(this.width / 4, BUFFER)
    // this.createCircles()
    // circle.animate().move(3 * BUFFER + this.width / 2, BUFFER + spacing).loop()
    // const input = this.draw.interpret(this.$el.querySelector('.svg-input'))
    // input.translation.set(-20,0)
    // TEXT
    // const text1 = this.draw.text('IN').move(this.width / 4 - BUFFER, this.height / 2 - BUFFER, FONT_STYLE)
    // const text2 = new Two.Text('OUT', this.width - this.width / 4 + BUFFER, this.height / 2 - BUFFER, FONT_STYLE)
    // const text3 = new Two.Text('1 BALL/S', this.width / 4 - BUFFER, this.height / 2 + BUFFER, FONT_STYLE)
    // const text4 = new Two.Text('1 BALL/S', this.width - this.width / 4 + BUFFER, this.height / 2 + BUFFER, FONT_STYLE)
    // const textGroup = this.draw.makeGroup(text1, text2, text3, text4)
    // this.draw.add(textGroup, input)
    // console.log(input, textGroup)
    // input.rotation = 45
    // // The object returned has many stylable properties:
    // circle.fill = '#FF8000'
    // circle.stroke = 'orangered' // Accepts all valid css color
    // circle.linewidth = 5

    rect.fill('#00C8FF')
    // Make a group for the animation
    // const myGroup = this.draw.makeGroup(circle)

    // this.draw.update()
    // this.draw.bind('update', (frameCount) => {
    //   // This code is called everytime two.update() is called.
    //   // Effectively 60 times per second.
    //   if (myGroup.translation.x > this.width - 1) {
    //     myGroup.translation.x = startingX
    //   }
    //   const t = (this.draw.timeDelta / 1000) * this.width
    //   // debugger
    //   myGroup.translation.x += t
    //   // console.log(myGroup.translation.x)
    //   // console.log(this.two.timeDelta)
    // })
    // this.startAnimation()
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
  circleAnimation() {
    const horizontalSpacing = CIRCLE_SIZE
    const massBalance = this.circleIn - this.circleOut
    _.each(this.circles, (circle, i) => {
      // console.log(circle.x(), circle.y())
      circle.animate({ duration: 750, delay: 0, ease: '='}).move(circle.x() + BUFFER - horizontalSpacing  +  this.width / 2, circle.y() ).after(() => {
        if (i < this.circleOut) {
          circle.animate({ duration: 250, ease: '=' }).move(circle.x() + 2 * BUFFER, circle.y() ).after(() => {
            this.circles.pop()
            circle.remove()
          })
        }
      })
    } )
  }
  startAnimation() {
    setInterval(() => {
      this.createCircles()
      this.circleAnimation()
    },1500)
  }
}
