// tslint:disable-next-line: no-submodule-imports
import 'antd/dist/antd.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './style/index.css';

import fundebug from 'fundebug-javascript';
import 'fundebug-revideo';

import dt from './sdk';
// tslint:disable-next-line: no-var-keyword
var _dt = dt;

// tslint:disable-next-line: no-var-keyword
var _fundebug = fundebug;
_fundebug.init({
  apikey: 'f008a16a9cbfcba1852984346bc5ef9e714ef7b183a783f9ca5035c0703217e6',
});
interface IState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  public componentDidCatch(error: any, info: any) {
    this.setState({ hasError: true });
    // 将component中的报错发送到Fundebug
    _fundebug.notifyError(error, {
      metaData: {
        info,
      },
    });
  }

  public render() {
    if (this.state.hasError) {
      return null;
      // Note: 也可以在出错的component处展示出错信息，返回自定义的结果。
    }
    return this.props.children;
  }
}

// 初始化配置
if (_dt) {
  _dt.set({
    pid: 'project_id', // [必填]项目id, 由灯塔项目组统一分配
    uuid: '', // [可选]设备唯一id, 用于计算uv数&设备分布. 一般在cookie中可以取到, 没有uuid可用设备mac/idfa/imei替代. 或者在storage的key中存入随机数字, 模拟设备唯一id.
    ucid: '', // [可选]用户ucid, 用于发生异常时追踪用户信息, 一般在cookie中可以取到, 没有可传空字符串

    record: {
      time_on_page: true, // 是否监控用户在线时长数据, 默认为true
      performance: true, // 是否监控页面载入性能, 默认为true
      js_error: true, //  是否监控页面报错信息, 默认为true
      // 配置需要监控的页面报错类别, 仅在js_error为true时生效, 默认均为true(可以将配置改为false, 以屏蔽不需要上报的错误类别)
      js_error_report_config: {
        ERROR_RUNTIME: true, // js运行时报错
        ERROR_SCRIPT: true, // js资源加载失败
        ERROR_STYLE: true, // css资源加载失败
        ERROR_IMAGE: true, // 图片资源加载失败
        ERROR_AUDIO: true, // 音频资源加载失败
        ERROR_VIDEO: true, // 视频资源加载失败
        ERROR_CONSOLE: true, // vue运行时报错
        ERROR_TRY_CATCH: true, // 未catch错误
        // 自定义检测函数, 上报前最后判断是否需要报告该错误
        // 回调函数说明
        // 传入参数 =>
        //            desc:  字符串, 错误描述
        //            stack: 字符串, 错误堆栈信息
        // 返回值 =>
        //            true  : 上报打点请求
        //            false : 不需要上报
        checkErrrorNeedReport(desc: any, stack: any) {
          return true;
        },
      },
    },

    // 业务方的js版本号, 会随着打点数据一起上传, 方便区分数据来源
    // 可以不填, 默认为1.0.0
    version: '1.0.0',

    // 对于如同
    // test.com/detail/1.html
    // test.com/detail/2.html
    // test.com/detail/3.html
    // ...
    // 这种页面来说, 虽然url不同, 但他们本质上是同一个页面
    // 因此需要业务方传入一个处理函数, 根据当前url解析出真实的页面类型(例如: 二手房列表/经纪人详情页), 以便灯塔系统对错误来源进行分类
    // 回调函数说明
    // 传入参数 => window.location
    // 返回值 => 对应的的页面类型(50字以内, 建议返回汉字, 方便查看), 默认是返回当前页面的url
    getPageType(location: any) { return `${location.host}${location.pathname}`; },
  });
}

ReactDOM.render(<ErrorBoundary><App /></ErrorBoundary>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
