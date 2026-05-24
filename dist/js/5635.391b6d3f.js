/*!
 * vue-admin-better
 * GitHub: https://github.com/zxwk1998/vue-admin-better
 * Gitee: https://gitee.com/chu1204505056/vue-admin-better
 *
 * 版权所有 (c) 2025 vue-admin-better
 * 本项目使用 MIT 许可证
 * 构建时间: 2026-5-24 18:30:35
 */
"use strict";
(self["rspackChunkvue_admin_better"] = self["rspackChunkvue_admin_better"] || []).push([[5635], {
28735: (function (__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
/* import */ var echarts__rspack_import_0 = __webpack_require__(38414);
/* import */ var vue_echarts__rspack_import_1 = __webpack_require__(11223);


/* export default */ __webpack_exports__["default"] = (vue_echarts__rspack_import_1["default"]);

}),
43168: (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
/* import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__rspack_import_0 = __webpack_require__(31601);
/* import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__rspack_import_0);
/* import */ var _node_modules_css_loader_dist_runtime_api_js__rspack_import_1 = __webpack_require__(76314);
/* import */ var _node_modules_css_loader_dist_runtime_api_js__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__rspack_import_1);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__rspack_import_1_default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__rspack_import_0_default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".index-container[data-v-cb712534]{padding:0 !important;margin:0 !important;background:#f5f7f8 !important}.index-container .stat-card[data-v-cb712534]{border:none;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.05);transition:all .3s ease}.index-container .stat-card[data-v-cb712534]:hover{transform:translateY(-3px);box-shadow:0 6px 20px rgba(0,0,0,.1)}.index-container .stat-card .stat-content[data-v-cb712534]{display:flex;align-items:center;padding:20px}.index-container .stat-card .stat-content .stat-icon[data-v-cb712534]{width:60px;height:60px;border-radius:15px;display:flex;align-items:center;justify-content:center;margin-right:15px;color:#fff;font-size:1.5rem;box-shadow:0 4px 12px rgba(0,0,0,.1)}.index-container .stat-card .stat-content .stat-info[data-v-cb712534]{flex:1}.index-container .stat-card .stat-content .stat-info .stat-value[data-v-cb712534]{font-size:1.8rem;font-weight:700;color:#2c3e50;margin-bottom:5px}.index-container .stat-card .stat-content .stat-info .stat-label[data-v-cb712534]{font-size:.95rem;color:#7f8c8d;font-weight:500}.index-container .chart-card[data-v-cb712534]{border:none;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.05)}.index-container .chart-card .chart-wrapper[data-v-cb712534]{height:300px;padding:10px}", ""]);
// Exports
/* export default */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


}),
58958: (function (__unused_rspack_module, __webpack_exports__, __webpack_require__) {
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ views_index; }
});

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/index/index.vue?vue&type=template&id=cb712534&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"index-container"},[_c('el-row',{attrs:{"gutter":20}},[_vm._l((_vm.statList),function(stat,index){return _c('el-col',{key:index,attrs:{"lg":6,"md":12,"sm":24,"xl":6,"xs":24}},[_c('el-card',{staticClass:"stat-card",attrs:{"shadow":"never"}},[_c('div',{staticClass:"stat-content"},[_c('div',{staticClass:"stat-icon",style:({ background: stat.color })},[_c('vab-icon',{attrs:{"icon":['fas', stat.icon]}})],1),_c('div',{staticClass:"stat-info"},[_c('div',{staticClass:"stat-value"},[_vm._v(_vm._s(stat.value))]),_c('div',{staticClass:"stat-label"},[_vm._v(_vm._s(stat.label))])])])])],1)}),_c('el-col',{attrs:{"lg":12,"md":24,"sm":24,"xl":12,"xs":24}},[_c('el-card',{staticClass:"chart-card",attrs:{"shadow":"never"}},[_c('div',{attrs:{"slot":"header"},slot:"header"},[_c('span',[_vm._v("访问趋势")])]),_c('div',{staticClass:"chart-wrapper"},[_c('vab-chart',{attrs:{"autoresize":"","option":_vm.visitChart}})],1)])],1),_c('el-col',{attrs:{"lg":12,"md":24,"sm":24,"xl":12,"xs":24}},[_c('el-card',{staticClass:"chart-card",attrs:{"shadow":"never"}},[_c('div',{attrs:{"slot":"header"},slot:"header"},[_c('span',[_vm._v("授权统计")])]),_c('div',{staticClass:"chart-wrapper"},[_c('vab-chart',{attrs:{"autoresize":"","option":_vm.authChart}})],1)])],1)],2)],1)}
var staticRenderFns = []


// EXTERNAL MODULE: ./src/plugins/echarts.js
var echarts = __webpack_require__(28735);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/index/index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* export default */ var indexvue_type_script_lang_js_ = ({
  name: 'Index',
  components: {
    VabChart: echarts["default"]
  },
  data() {
    return {
      statList: [{
        icon: 'users',
        label: '总用户数',
        value: '1,234',
        color: '#4d8af0'
      }, {
        icon: 'key',
        label: '授权数量',
        value: '567',
        color: '#10b981'
      }, {
        icon: 'eye',
        label: '今日访问',
        value: '8,901',
        color: '#f59e0b'
      }, {
        icon: 'clock',
        label: '在线时长',
        value: '2.5h',
        color: '#ec4899'
      }],
      visitChart: {
        color: ['#4d8af0'],
        grid: {
          top: '15%',
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          axisLine: {
            lineStyle: {
              color: '#e4e7ed'
            }
          },
          axisLabel: {
            color: '#909399'
          }
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            lineStyle: {
              color: '#f5f7fa',
              type: 'dashed'
            }
          },
          axisLabel: {
            color: '#909399'
          }
        }],
        series: [{
          name: '访问量',
          type: 'line',
          smooth: true,
          data: [1200, 1350, 1100, 1400, 1600, 1800, 1500],
          lineStyle: {
            width: 3,
            color: '#4d8af0'
          },
          itemStyle: {
            color: '#4d8af0'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(77,138,240,0.3)'
              }, {
                offset: 1,
                color: 'rgba(77,138,240,0.1)'
              }]
            }
          }
        }]
      },
      authChart: {
        color: ['#10b981'],
        grid: {
          top: '15%',
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          axisLine: {
            lineStyle: {
              color: '#e4e7ed'
            }
          },
          axisLabel: {
            color: '#909399'
          }
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            lineStyle: {
              color: '#f5f7fa',
              type: 'dashed'
            }
          },
          axisLabel: {
            color: '#909399'
          }
        }],
        series: [{
          name: '授权数',
          type: 'bar',
          barWidth: '60%',
          data: [65, 59, 80, 81, 56, 55, 40],
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: '#10b981'
              }, {
                offset: 1,
                color: '#059669'
              }]
            },
            borderRadius: [6, 6, 0, 0]
          }
        }]
      }
    };
  },
  methods: {}
});
;// CONCATENATED MODULE: ./src/views/index/index.vue?vue&type=script&lang=js&
 /* export default */ var views_indexvue_type_script_lang_js_ = (indexvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(85072);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(97825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(77659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(55056);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(10540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(41113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-3[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-3[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/index/index.vue?vue&type=style&index=0&id=cb712534&lang=scss&scoped=true&
var indexvue_type_style_index_0_id_cb712534_lang_scss_scoped_true_ = __webpack_require__(43168);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-3[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-3[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/index/index.vue?vue&type=style&index=0&id=cb712534&lang=scss&scoped=true&

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(indexvue_type_style_index_0_id_cb712534_lang_scss_scoped_true_["default"], options);




       /* export default */ var views_indexvue_type_style_index_0_id_cb712534_lang_scss_scoped_true_ = (indexvue_type_style_index_0_id_cb712534_lang_scss_scoped_true_["default"] && indexvue_type_style_index_0_id_cb712534_lang_scss_scoped_true_["default"].locals ? indexvue_type_style_index_0_id_cb712534_lang_scss_scoped_true_["default"].locals : undefined);

;// CONCATENATED MODULE: ./src/views/index/index.vue?vue&type=style&index=0&id=cb712534&lang=scss&scoped=true&

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// CONCATENATED MODULE: ./src/views/index/index.vue



;


/* normalize component */

var component = (0,componentNormalizer["default"])(
  views_indexvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "cb712534",
  null
  
)

/* export default */ var views_index = (component.exports);

}),

}]);