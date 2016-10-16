import { VueComponent, Prop, Watch } from 'vue-typescript'
@VueComponent({
  template: require('./example.html'),
  events: {
    'change-balance': function (msg) {
      // `this` in event callbacks are automatically bound
      // to the instance that registered it
      this.message = `${msg[0]}ball/s = ${msg[1]}ball/s + ${msg[2]}ball/s`
    }
  }
})
export class Example extends Vue {

  message: string = 'blah'
  ready() {
  }
 
}
