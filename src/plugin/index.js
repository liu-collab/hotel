import Vue from 'vue'
//导入自定义插件
import myplugs from './myplugs'
//使用插件
Vue.use(myplugs)

//导入elemen--ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//使用elemen--ui
Vue.use(ElementUI);

//导入VueQuillEditor 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)