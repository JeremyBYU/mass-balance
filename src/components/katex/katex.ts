import { VueComponent, Prop, Watch } from 'vue-typescript'

const katex = require('katex')

@VueComponent({
  template: require('./katex.html')
})
export class Katex extends Vue {

  @Watch('expressionChange', {deep: true})
  @Prop expression: string = 'c = \\pm\\sqrt{a^2 + b^2}' // default value
  // objects as default values don't need to be wrapped into functions
  constructor() {
    super()
  }
  ready() {
    katex.render(this.expression, this.$el)
  }
  expressionChange(){
    katex.render(this.expression, this.$el)
  }
}
