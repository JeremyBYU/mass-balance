import { VueComponent } from 'vue-typescript'
import { Example } from '../../components/example/example'
@VueComponent({
    template: require('./home.html'),
    style: require('./home.scss'),
    components: {
      'example': Example
    }
})
export class HomeComponent extends Vue {
    package: string = 'vue-typescript';
    repo: string = 'https://github.com/itsFrank/vue-typescript';

}
