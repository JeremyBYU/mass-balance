import { VueComponent, Prop, Watch } from 'vue-typescript'
import { CIRCLE_SIZE, FONT_STYLE } from '../../utils/constants'
const SVG = require('svgjs')
console.log(SVG)
declare const Two: any // Two.js Namespace

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

  two: any = {} // stage canvas
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
    const params = { width: this.width, height: this.height }
    console.log(this.$el.querySelector('.svg-input'))
    this.two = new Two(params).appendTo(this.$el.querySelector('.stage'))
    const BUFFER = 40
    // two has convenience methods to create shapes.
    const startingX = 10
    const circle = this.two.makeCircle(CIRCLE_SIZE * 1.25, this.height / 2, CIRCLE_SIZE)
    const rect = this.two.makeRectangle(this.width / 2, this.height / 2, 100, 100)
    const input = this.two.interpret(this.$el.querySelector('.svg-input'))
    input.translation.set(-20,0)
    // TEXT
    const text1 = new Two.Text('IN', this.width / 4 - BUFFER, this.height / 2 - BUFFER, FONT_STYLE)
    const text2 = new Two.Text('OUT', this.width - this.width / 4 + BUFFER, this.height / 2 - BUFFER, FONT_STYLE)
    const text3 = new Two.Text('1 BALL/S', this.width / 4 - BUFFER, this.height / 2 + BUFFER, FONT_STYLE)
    const text4 = new Two.Text('1 BALL/S', this.width - this.width / 4 + BUFFER, this.height / 2 + BUFFER, FONT_STYLE)
    const textGroup = this.two.makeGroup(text1, text2, text3, text4)
    this.two.add(textGroup, input)
    console.log(input, textGroup)
    input.rotation = 45
    // The object returned has many stylable properties:
    circle.fill = '#FF8000'
    circle.stroke = 'orangered' // Accepts all valid css color
    circle.linewidth = 5

    rect.fill = 'rgb(0, 200, 255)'
    rect.opacity = 0.75
    rect.noStroke()
    // Make a group for the animation
    const myGroup = this.two.makeGroup(circle)

    this.two.update()
    this.two.bind('update', (frameCount) => {
      // This code is called everytime two.update() is called.
      // Effectively 60 times per second.
      if (myGroup.translation.x > this.width - 1) {
        myGroup.translation.x = startingX
      }
      const t = (this.two.timeDelta / 1000) * this.width
      // debugger
      myGroup.translation.x += t
      // console.log(myGroup.translation.x)
      // console.log(this.two.timeDelta)
    })
  }
  startAnimation() {
    this.two.play()
  }
}
