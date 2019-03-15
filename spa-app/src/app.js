import Vue from 'vue';
import App from './App.vue';
import { createRouter } from './router';
import './styles/main.scss';
import './styles/main.css';

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp() {
  const router = createRouter();
  const app = new Vue({
    router,
    render: createElement => createElement(App),
  });
  return { app, router };
}
