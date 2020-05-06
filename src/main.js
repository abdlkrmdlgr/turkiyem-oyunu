import Vue from 'vue'
import App from './HomePage.vue'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

Vue.use(BootstrapVue);
Vue.config.productionTip = true;

import {
    faAt,
    faBrush,
    faCalendarAlt,
    faChartLine,
    faCode,
    faSearch,
    faThumbtack,
    faHourglassStart, faHourglassHalf, faHourglassEnd, faHourglass,
    faEllipsisH, faEllipsisV,
    faRandom, faMedal, faPlay, faSync,
    faInfo, faInfoCircle, faCogs, faCog, faQuestionCircle,
    faMinusSquare, faPlusSquare, faMinusCircle, faPlusCircle
} from "@fortawesome/free-solid-svg-icons";

library.add(
    faAt,
    faBrush,
    faCalendarAlt,
    faChartLine,
    faCode,
    faSearch,
    faThumbtack,
    faHourglassStart, faHourglassHalf, faHourglassEnd, faHourglass,
    faEllipsisH, faEllipsisV,
    faRandom, faMedal, faPlay, faSync,
    faInfo, faInfoCircle, faCogs, faCog, faQuestionCircle,
    faMinusSquare, faPlusSquare, faMinusCircle, faPlusCircle
);
Vue.component("FontAwesomeIcon", FontAwesomeIcon);

new Vue({
    render: h => h(App),
}).$mount('#app')
