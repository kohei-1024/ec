"use strict";
(() => {
var exports = {};
exports.id = 958;
exports.ids = [958];
exports.modules = {};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/
/******/ /* webpack/runtime/publicPath */
/******/ (() => {
/******/ 	__webpack_require__.p = "/_next/";
/******/ })();
/******/
/******/ 	return exports;
/******/ }
;

(() => {
	// define getter functions for harmony exports
	__webpack_require__.d = (exports, definition) => {
		for(var key in definition) {
			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
			}
		}
	};
})();

(() => {
	// define __esModule on exports
	__webpack_require__.r = (exports) => {
		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
		}
		Object.defineProperty(exports, '__esModule', { value: true });
	};
})();

(() => {
	// getDefaultExport function for compatibility with non-harmony modules
	__webpack_require__.n = (module) => {
		var getter = module && module.__esModule ?
			() => (module['default']) :
			() => (module);
		__webpack_require__.d(getter, { a: getter });
		return getter;
	};
})();

(() => {
	// define getter functions for harmony exports
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	__webpack_require__.f = {};
	__webpack_require__.e = (chunkId) => {
		return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
			__webpack_require__.f[key](chunkId, promises);
			return promises;
		}, []));
	};
})();

(() => {
	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
})();

(() => {
	var cachedModule, cachedModules = {};
	__webpack_require__.c = cachedModules;
})();

// This function allow to reference async chunks
__webpack_require__.u = function(chunkId) {
	// return url for filenames based on template
	return "static/chunks/" + chunkId + ".js";
};

// This has to be a function to be compatible with the webpack api-runtime
function __webpack_require__(moduleId) {
	// Check if module is in cache
	var cachedModule = __webpack_require__.c[moduleId];
	if (cachedModule) {
		return cachedModule.exports;
	}
	// Create a new module (and put it into the cache)
	var module = __webpack_require__.c[moduleId] = {
		// no module.id needed
		// no module.loaded needed
		exports: {}
	};
	// Execute the module function
	var threw = true;
	try {
		var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
		__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
		module = execOptions.module;
		execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
		threw = false;
	} finally {
		if(threw) delete __webpack_require__.c[moduleId];
	}
	// Return the exports of the module
	return module.exports;
}

// expose the modules object (__webpack_modules__)
__webpack_require__.m = {};

// expose the module cache
__webpack_require__.c = {};

// expose the module execution interceptor
__webpack_require__.i = [];

// no load function
})();