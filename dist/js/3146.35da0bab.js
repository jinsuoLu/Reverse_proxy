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
(self["rspackChunkvue_admin_better"] = self["rspackChunkvue_admin_better"] || []).push([[3146], {
25393: (function (__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  doDelete: function() { return doDelete; },
  doEdit: function() { return doEdit; },
  getList: function() { return getList; }
});
/* import */ var _utils_request__rspack_import_0 = __webpack_require__(39137);

function getList(data) {
  return (0,_utils_request__rspack_import_0["default"])({
    url: '/api/user/list',
    method: 'get',
    params: data
  });
}
function doEdit(data) {
  const {
    id,
    ...rest
  } = data;
  if (id) {
    return (0,_utils_request__rspack_import_0["default"])({
      url: `/api/user/${id}`,
      method: 'put',
      data: rest
    });
  } else {
    return (0,_utils_request__rspack_import_0["default"])({
      url: '/api/user/create',
      method: 'post',
      data
    });
  }
}
function doDelete(data) {
  return (0,_utils_request__rspack_import_0["default"])({
    url: `/api/user/${data.id}`,
    method: 'delete'
  });
}

}),

}]);