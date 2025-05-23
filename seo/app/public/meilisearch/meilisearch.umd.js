(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('cross-fetch/polyfill')) :
    typeof define === 'function' && define.amd ? define(['exports', 'cross-fetch/polyfill'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.window = global.window || {}));
})(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var MeiliSearchCommunicationError =
    /** @class */
    function (_super) {
      __extends(MeiliSearchCommunicationError, _super);

      function MeiliSearchCommunicationError(message, body, url, stack) {
        var _this = this;

        var _a, _b, _c;

        _this = _super.call(this, message) || this;
        _this.name = 'MeiliSearchCommunicationError';
        _this.type = 'MeiliSearchCommunicationError';

        if (body instanceof Response) {
          _this.message = body.statusText;
          _this.statusCode = body.status;
        }

        if (body instanceof Error) {
          _this.errno = body.errno;
          _this.code = body.code;
        }

        if (stack) {
          _this.stack = stack;
          _this.stack = (_a = _this.stack) === null || _a === void 0 ? void 0 : _a.replace(/(TypeError|FetchError)/, _this.name);
          _this.stack = (_b = _this.stack) === null || _b === void 0 ? void 0 : _b.replace('Failed to fetch', "request to ".concat(url, " failed, reason: connect ECONNREFUSED"));
          _this.stack = (_c = _this.stack) === null || _c === void 0 ? void 0 : _c.replace('Not Found', "Not Found: ".concat(url));
        } else {
          if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, MeiliSearchCommunicationError);
          }
        }

        return _this;
      }

      return MeiliSearchCommunicationError;
    }(Error);

    var MeiliSearchApiError =
    /** @class */
    function (_super) {
      __extends(class_1, _super);

      function class_1(error, status) {
        var _this = _super.call(this, error.message) || this;

        _this.name = 'MeiliSearchApiError';
        _this.code = error.code;
        _this.type = error.type;
        _this.link = error.link;
        _this.message = error.message;
        _this.httpStatus = status; // Make errors comparison possible. ex: error instanceof MeiliSearchApiError.

        Object.setPrototypeOf(_this, MeiliSearchApiError.prototype);

        if (Error.captureStackTrace) {
          Error.captureStackTrace(_this, MeiliSearchApiError);
        }

        return _this;
      }

      return class_1;
    }(Error);

    function httpResponseErrorHandler(response) {
      return __awaiter(this, void 0, void 0, function () {
        var err;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              if (!!response.ok) return [3
              /*break*/
              , 5];
              err = void 0;
              _a.label = 1;

            case 1:
              _a.trys.push([1, 3,, 4]);

              return [4
              /*yield*/
              , response.json()];

            case 2:
              err = _a.sent();
              return [3
              /*break*/
              , 4];

            case 3:
              _a.sent();
              throw new MeiliSearchCommunicationError(response.statusText, response, response.url);

            case 4:
              throw new MeiliSearchApiError(err, response.status);

            case 5:
              return [2
              /*return*/
              , response];
          }
        });
      });
    }

    function httpErrorHandler(response, stack, url) {
      if (response.type !== 'MeiliSearchApiError') {
        throw new MeiliSearchCommunicationError(response.message, response, url, stack);
      }

      throw response;
    }

    var MeiliSearchError =
    /** @class */
    function (_super) {
      __extends(MeiliSearchError, _super);

      function MeiliSearchError(message) {
        var _this = _super.call(this, message) || this;

        _this.name = 'MeiliSearchError';
        _this.type = 'MeiliSearchError';

        if (Error.captureStackTrace) {
          Error.captureStackTrace(_this, MeiliSearchError);
        }

        return _this;
      }

      return MeiliSearchError;
    }(Error);

    var MeiliSearchTimeOutError =
    /** @class */
    function (_super) {
      __extends(MeiliSearchTimeOutError, _super);

      function MeiliSearchTimeOutError(message) {
        var _this = _super.call(this, message) || this;

        _this.name = 'MeiliSearchTimeOutError';
        _this.type = _this.constructor.name;

        if (Error.captureStackTrace) {
          Error.captureStackTrace(_this, MeiliSearchTimeOutError);
        }

        return _this;
      }

      return MeiliSearchTimeOutError;
    }(Error);

    /**
     * Removes undefined entries from object
     */

    function removeUndefinedFromObject(obj) {
      return Object.entries(obj).reduce(function (acc, curEntry) {
        var key = curEntry[0],
            val = curEntry[1];
        if (val !== undefined) acc[key] = val;
        return acc;
      }, {});
    }

    function sleep(ms) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4
              /*yield*/
              , new Promise(function (resolve) {
                return setTimeout(resolve, ms);
              })];

            case 1:
              return [2
              /*return*/
              , _a.sent()];
          }
        });
      });
    }

    function addProtocolIfNotPresent(host) {
      if (!(host.startsWith('https://') || host.startsWith('http://'))) {
        return "http://".concat(host);
      }

      return host;
    }

    function addTrailingSlash(url) {
      if (!url.endsWith('/')) {
        url += '/';
      }

      return url;
    }

    function constructHostURL(host) {
      try {
        host = addProtocolIfNotPresent(host);
        host = addTrailingSlash(host);
        return host;
      } catch (e) {
        throw new MeiliSearchError('The provided host is not valid.');
      }
    }

    var HttpRequests =
    /** @class */
    function () {
      function HttpRequests(config) {
        this.headers = Object.assign({}, config.headers || {}); // assign to avoid referencing

        this.headers['Content-Type'] = 'application/json';

        if (config.apiKey) {
          this.headers['Authorization'] = "Bearer ".concat(config.apiKey);
        }

        try {
          var host = constructHostURL(config.host);
          this.url = new URL(host);
        } catch (e) {
          throw new MeiliSearchError('The provided host is not valid.');
        }
      }

      HttpRequests.prototype.request = function (_a) {
        var method = _a.method,
            url = _a.url,
            params = _a.params,
            body = _a.body,
            config = _a.config;
        return __awaiter(this, void 0, void 0, function () {
          var constructURL, queryParams_1, response, parsedBody, parsedJson, e_1, stack;
          return __generator(this, function (_b) {
            switch (_b.label) {
              case 0:
                constructURL = new URL(url, this.url);

                if (params) {
                  queryParams_1 = new URLSearchParams();
                  Object.keys(params).filter(function (x) {
                    return params[x] !== null;
                  }).map(function (x) {
                    return queryParams_1.set(x, params[x]);
                  });
                  constructURL.search = queryParams_1.toString();
                }

                _b.label = 1;

              case 1:
                _b.trys.push([1, 4,, 5]);

                return [4
                /*yield*/
                , fetch(constructURL.toString(), __assign(__assign({}, config), {
                  method: method,
                  body: JSON.stringify(body),
                  headers: this.headers
                })).then(function (res) {
                  return httpResponseErrorHandler(res);
                })];

              case 2:
                response = _b.sent();
                return [4
                /*yield*/
                , response.text()];

              case 3:
                parsedBody = _b.sent();

                try {
                  parsedJson = JSON.parse(parsedBody);
                  return [2
                  /*return*/
                  , parsedJson];
                } catch (_) {
                  return [2
                  /*return*/
                  ];
                }

                return [3
                /*break*/
                , 5];

              case 4:
                e_1 = _b.sent();
                stack = e_1.stack;
                httpErrorHandler(e_1, stack, constructURL.toString());
                return [3
                /*break*/
                , 5];

              case 5:
                return [2
                /*return*/
                ];
            }
          });
        });
      };

      HttpRequests.prototype.get = function (url, params, config) {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4
                /*yield*/
                , this.request({
                  method: 'GET',
                  url: url,
                  params: params,
                  config: config
                })];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };

      HttpRequests.prototype.post = function (url, data, params, config) {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4
                /*yield*/
                , this.request({
                  method: 'POST',
                  url: url,
                  body: data,
                  params: params,
                  config: config
                })];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };

      HttpRequests.prototype.put = function (url, data, params, config) {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4
                /*yield*/
                , this.request({
                  method: 'PUT',
                  url: url,
                  body: data,
                  params: params,
                  config: config
                })];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };

      HttpRequests.prototype.patch = function (url, data, params, config) {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4
                /*yield*/
                , this.request({
                  method: 'PATCH',
                  url: url,
                  body: data,
                  params: params,
                  config: config
                })];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };

      HttpRequests.prototype["delete"] = function (url, data, params, config) {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4
                /*yield*/
                , this.request({
                  method: 'DELETE',
                  url: url,
                  body: data,
                  params: params,
                  config: config
                })];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };

      return HttpRequests;
    }();

    var TaskClient =
    /** @class */
    function () {
      function TaskClient(config) {
        this.httpRequest = new HttpRequests(config);
      }

      TaskClient.prototype.getClientTask = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "tasks/".concat(uid);
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };

      TaskClient.prototype.getClientTasks = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "tasks";
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };

      TaskClient.prototype.getIndexTask = function (indexUid, taskId) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(indexUid, "/tasks/").concat(taskId);
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };

      TaskClient.prototype.getIndexTasks = function (indexUid) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(indexUid, "/tasks");
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Wait for a task to be processed.
       *
       * @param {number} uid Task identifier
       * @param {WaitOptions} options Additional configuration options
       * @returns {Promise<Task>} Promise returning a task after it has been processed
       */


      TaskClient.prototype.waitForClientTask = function (taskId, _a) {
        var _b = _a === void 0 ? {} : _a,
            _c = _b.timeOutMs,
            timeOutMs = _c === void 0 ? 5000 : _c,
            _d = _b.intervalMs,
            intervalMs = _d === void 0 ? 50 : _d;

        return __awaiter(this, void 0, void 0, function () {
          var startingTime, response;
          return __generator(this, function (_e) {
            switch (_e.label) {
              case 0:
                startingTime = Date.now();
                _e.label = 1;

              case 1:
                if (!(Date.now() - startingTime < timeOutMs)) return [3
                /*break*/
                , 4];
                return [4
                /*yield*/
                , this.getClientTask(taskId)];

              case 2:
                response = _e.sent();
                if (!["enqueued"
                /* TASK_ENQUEUED */
                , "processing"
                /* TASK_PROCESSING */
                ].includes(response.status)) return [2
                /*return*/
                , response];
                return [4
                /*yield*/
                , sleep(intervalMs)];

              case 3:
                _e.sent();

                return [3
                /*break*/
                , 1];

              case 4:
                throw new MeiliSearchTimeOutError("timeout of ".concat(timeOutMs, "ms has exceeded on process ").concat(taskId, " when waiting a task to be resolved."));
            }
          });
        });
      };
      /**
       * Waits for multiple tasks to be processed
       *
       * @param {number} taskIds Tasks identifier list
       * @param {WaitOptions} options Wait options
       * @returns {Promise<Result<Task[]>>} Promise returning a list of tasks after they have been processed
       */


      TaskClient.prototype.waitForClientTasks = function (taskIds, _a) {
        var _b = _a === void 0 ? {} : _a,
            _c = _b.timeOutMs,
            timeOutMs = _c === void 0 ? 5000 : _c,
            _d = _b.intervalMs,
            intervalMs = _d === void 0 ? 50 : _d;

        return __awaiter(this, void 0, void 0, function () {
          var tasks, _i, taskIds_1, taskId, task;

          return __generator(this, function (_e) {
            switch (_e.label) {
              case 0:
                tasks = [];
                _i = 0, taskIds_1 = taskIds;
                _e.label = 1;

              case 1:
                if (!(_i < taskIds_1.length)) return [3
                /*break*/
                , 4];
                taskId = taskIds_1[_i];
                return [4
                /*yield*/
                , this.waitForClientTask(taskId, {
                  timeOutMs: timeOutMs,
                  intervalMs: intervalMs
                })];

              case 2:
                task = _e.sent();
                tasks.push(task);
                _e.label = 3;

              case 3:
                _i++;
                return [3
                /*break*/
                , 1];

              case 4:
                return [2
                /*return*/
                , {
                  results: tasks
                }];
            }
          });
        });
      };
      /**
       * Waits for a task to be processed
       *
       * @param {number} taskId Task identifier
       * @param {WaitOptions} options Wait options
       * @returns {Promise<Task>} Promise returning a task after it has been processed
       */


      TaskClient.prototype.waitForIndexTask = function (indexUid, taskId, _a) {
        var _b = _a === void 0 ? {} : _a,
            _c = _b.timeOutMs,
            timeOutMs = _c === void 0 ? 5000 : _c,
            _d = _b.intervalMs,
            intervalMs = _d === void 0 ? 50 : _d;

        return __awaiter(this, void 0, void 0, function () {
          var startingTime, response;
          return __generator(this, function (_e) {
            switch (_e.label) {
              case 0:
                startingTime = Date.now();
                _e.label = 1;

              case 1:
                if (!(Date.now() - startingTime < timeOutMs)) return [3
                /*break*/
                , 4];
                return [4
                /*yield*/
                , this.getIndexTask(indexUid, taskId)];

              case 2:
                response = _e.sent();
                if (!["enqueued"
                /* TASK_ENQUEUED */
                , "processing"
                /* TASK_PROCESSING */
                ].includes(response.status)) return [2
                /*return*/
                , response];
                return [4
                /*yield*/
                , sleep(intervalMs)];

              case 3:
                _e.sent();

                return [3
                /*break*/
                , 1];

              case 4:
                throw new MeiliSearchTimeOutError("timeout of ".concat(timeOutMs, "ms has exceeded on process ").concat(taskId, " when waiting for pending update to resolve."));
            }
          });
        });
      };

      return TaskClient;
    }();

    /*
     * Bundle: MeiliSearch / Indexes
     * Project: MeiliSearch - Javascript API
     * Author: Quentin de Quelen <quentin@meilisearch.com>
     * Copyright: 2019, MeiliSearch
     */

    var Index =
    /** @class */
    function () {
      /**
       * @param {Config} config Request configuration options
       * @param {string} uid UID of the index
       * @param {string} primaryKey? Primary Key of the index
       */
      function Index(config, uid, primaryKey) {
        this.uid = uid;
        this.primaryKey = primaryKey;
        this.httpRequest = new HttpRequests(config);
        this.tasks = new TaskClient(config);
      } ///
      /// SEARCH
      ///

      /**
       * Search for documents into an index
       * @memberof Index
       * @method search
       * @template T
       * @param {string | null} query? Query string
       * @param {SearchParams} options? Search options
       * @param {Partial<Request>} config? Additional request configuration options
       * @returns {Promise<SearchResponse<T>>} Promise containing the search response
       */


      Index.prototype.search = function (query, options, config) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/search");
                return [4
                /*yield*/
                , this.httpRequest.post(url, removeUndefinedFromObject(__assign(__assign({}, options), {
                  q: query
                })), undefined, config)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Search for documents into an index using the GET method
       * @memberof Index
       * @method search
       * @template T
       * @param {string | null} query? Query string
       * @param {SearchParams} options? Search options
       * @param {Partial<Request>} config? Additional request configuration options
       * @returns {Promise<SearchResponse<T>>} Promise containing the search response
       */


      Index.prototype.searchGet = function (query, options, config) {
        var _a, _b, _c, _d, _e;

        return __awaiter(this, void 0, void 0, function () {
          var url, parseFilter, getParams;
          return __generator(this, function (_f) {
            switch (_f.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/search");

                parseFilter = function parseFilter(filter) {
                  if (typeof filter === 'string') return filter;else if (Array.isArray(filter)) throw new MeiliSearchError('The filter query parameter should be in string format when using searchGet');else return undefined;
                };

                getParams = __assign(__assign({
                  q: query
                }, options), {
                  filter: parseFilter(options === null || options === void 0 ? void 0 : options.filter),
                  sort: (_a = options === null || options === void 0 ? void 0 : options.sort) === null || _a === void 0 ? void 0 : _a.join(','),
                  facetsDistribution: (_b = options === null || options === void 0 ? void 0 : options.facetsDistribution) === null || _b === void 0 ? void 0 : _b.join(','),
                  attributesToRetrieve: (_c = options === null || options === void 0 ? void 0 : options.attributesToRetrieve) === null || _c === void 0 ? void 0 : _c.join(','),
                  attributesToCrop: (_d = options === null || options === void 0 ? void 0 : options.attributesToCrop) === null || _d === void 0 ? void 0 : _d.join(','),
                  attributesToHighlight: (_e = options === null || options === void 0 ? void 0 : options.attributesToHighlight) === null || _e === void 0 ? void 0 : _e.join(',')
                });
                return [4
                /*yield*/
                , this.httpRequest.get(url, removeUndefinedFromObject(getParams), config)];

              case 1:
                return [2
                /*return*/
                , _f.sent()];
            }
          });
        });
      }; ///
      /// INDEX
      ///

      /**
       * Get index information.
       * @memberof Index
       * @method getRawInfo
       * @returns {Promise<IndexResponse>} Promise containing index information
       */


      Index.prototype.getRawInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url, res;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid);
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                res = _a.sent();
                this.primaryKey = res.primaryKey;
                return [2
                /*return*/
                , res];
            }
          });
        });
      };
      /**
       * Fetch and update Index information.
       * @memberof Index
       * @method fetchInfo
       * @returns {Promise<this>} Promise to the current Index object with updated information
       */


      Index.prototype.fetchInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4
                /*yield*/
                , this.getRawInfo()];

              case 1:
                _a.sent();

                return [2
                /*return*/
                , this];
            }
          });
        });
      };
      /**
       * Get Primary Key.
       * @memberof Index
       * @method fetchPrimaryKey
       * @returns {Promise<string | undefined>} Promise containing the Primary Key of the index
       */


      Index.prototype.fetchPrimaryKey = function () {
        return __awaiter(this, void 0, void 0, function () {
          var _a;

          return __generator(this, function (_b) {
            switch (_b.label) {
              case 0:
                _a = this;
                return [4
                /*yield*/
                , this.getRawInfo()];

              case 1:
                _a.primaryKey = _b.sent().primaryKey;
                return [2
                /*return*/
                , this.primaryKey];
            }
          });
        });
      };
      /**
       * Create an index.
       * @memberof Index
       * @method create
       * @template T
       * @param {string} uid Unique identifier of the Index
       * @param {IndexOptions} options Index options
       * @param {Config} config Request configuration options
       * @returns {Promise<Index<T>>} Newly created Index object
       */


      Index.create = function (uid, options, config) {
        if (options === void 0) {
          options = {};
        }

        return __awaiter(this, void 0, void 0, function () {
          var url, req;
          return __generator(this, function (_a) {
            url = "indexes";
            req = new HttpRequests(config);
            return [2
            /*return*/
            , req.post(url, __assign(__assign({}, options), {
              uid: uid
            }))];
          });
        });
      };
      /**
       * Update an index.
       * @memberof Index
       * @method update
       * @param {IndexOptions} data Data to update
       * @returns {Promise<this>} Promise to the current Index object with updated information
       */


      Index.prototype.update = function (data) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid);
                return [4
                /*yield*/
                , this.httpRequest.put(url, data)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Delete an index.
       * @memberof Index
       * @method delete
       * @returns {Promise<void>} Promise which resolves when index is deleted successfully
       */


      Index.prototype["delete"] = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid);
                return [4
                /*yield*/
                , this.httpRequest["delete"](url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      }; ///
      /// TASKS
      ///

      /**
       * Get the list of all the index tasks.
       *
       * @memberof Indexes
       * @method getTasks
       *
       * @returns {Promise<Result<Task[]>>} - Promise containing all tasks
       */


      Index.prototype.getTasks = function () {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4
                /*yield*/
                , this.tasks.getIndexTasks(this.uid)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Get one task of the index.
       *
       * @memberof Indexes
       * @method getTask
       * @param {number} taskId - Task identifier
       *
       * @returns {Promise<Task>} - Promise containing a task
       */


      Index.prototype.getTask = function (taskId) {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4
                /*yield*/
                , this.tasks.getIndexTask(this.uid, taskId)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Wait for a batch of an index tasks to be processed.
       *
       * @memberof Indexes
       * @method waitForTasks
       * @param {number[]} taskIds - Tasks identifier
       * @param {WaitOptions} waitOptions - Options on timeout and interval
       *
       * @returns {Promise<Result<Task[]>>} - Promise containing an array of tasks
       */


      Index.prototype.waitForTasks = function (taskIds, _a) {
        var _b = _a === void 0 ? {} : _a,
            _c = _b.timeOutMs,
            timeOutMs = _c === void 0 ? 5000 : _c,
            _d = _b.intervalMs,
            intervalMs = _d === void 0 ? 50 : _d;

        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_e) {
            switch (_e.label) {
              case 0:
                return [4
                /*yield*/
                , this.tasks.waitForClientTasks(taskIds, {
                  timeOutMs: timeOutMs,
                  intervalMs: intervalMs
                })];

              case 1:
                return [2
                /*return*/
                , _e.sent()];
            }
          });
        });
      };
      /**
       * Wait for an index task to be processed.
       *
       * @memberof Indexes
       * @method waitForTask
       * @param {number} taskId - Task identifier
       * @param {WaitOptions} waitOptions - Options on timeout and interval
       *
       * @returns {Promise<Task>} - Promise containing an array of tasks
       */


      Index.prototype.waitForTask = function (taskId, _a) {
        var _b = _a === void 0 ? {} : _a,
            _c = _b.timeOutMs,
            timeOutMs = _c === void 0 ? 5000 : _c,
            _d = _b.intervalMs,
            intervalMs = _d === void 0 ? 50 : _d;

        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_e) {
            switch (_e.label) {
              case 0:
                return [4
                /*yield*/
                , this.tasks.waitForClientTask(taskId, {
                  timeOutMs: timeOutMs,
                  intervalMs: intervalMs
                })];

              case 1:
                return [2
                /*return*/
                , _e.sent()];
            }
          });
        });
      }; ///
      /// STATS
      ///

      /**
       * get stats of an index
       * @memberof Index
       * @method getStats
       * @returns {Promise<IndexStats>} Promise containing object with stats of the index
       */


      Index.prototype.getStats = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/stats");
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      }; ///
      /// DOCUMENTS
      ///

      /**
       * get documents of an index
       * @memberof Index
       * @method getDocuments
       * @template T
       * @param {GetDocumentsParams<T>} options? Options to browse the documents
       * @returns {Promise<GetDocumentsResponse<T>>} Promise containing Document responses
       */


      Index.prototype.getDocuments = function (options) {
        return __awaiter(this, void 0, void 0, function () {
          var url, attr;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/documents");

                if (options !== undefined && Array.isArray(options.attributesToRetrieve)) {
                  attr = options.attributesToRetrieve.join(',');
                }

                return [4
                /*yield*/
                , this.httpRequest.get(url, __assign(__assign({}, options), attr !== undefined ? {
                  attributesToRetrieve: attr
                } : {}))];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Get one document
       * @memberof Index
       * @method getDocument
       * @template T
       * @param {string | number} documentId Document ID
       * @returns {Promise<Document<T>>} Promise containing Document response
       */


      Index.prototype.getDocument = function (documentId) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/documents/").concat(documentId);
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Add or replace multiples documents to an index
       * @memberof Index
       * @method addDocuments
       * @template T
       * @param {Array<Document<T>>} documents Array of Document objects to add/replace
       * @param {AddDocumentParams} options? Query parameters
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued update
       */


      Index.prototype.addDocuments = function (documents, options) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/documents");
                return [4
                /*yield*/
                , this.httpRequest.post(url, documents, options)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Add or replace multiples documents to an index in batches
       * @memberof Index
       * @method addDocumentsInBatches
       * @template T
       * @param {Array<Document<T>>} documents Array of Document objects to add/replace
       * @param {number} batchSize Size of the batch
       * @param {AddDocumentParams} options? Query parameters
       * @returns {Promise<EnqueuedTasks>} Promise containing array of enqueued update objects for each batch
       */


      Index.prototype.addDocumentsInBatches = function (documents, batchSize, options) {
        if (batchSize === void 0) {
          batchSize = 1000;
        }

        return __awaiter(this, void 0, void 0, function () {
          var updates, i, _a, _b;

          return __generator(this, function (_c) {
            switch (_c.label) {
              case 0:
                updates = [];
                i = 0;
                _c.label = 1;

              case 1:
                if (!(i < documents.length)) return [3
                /*break*/
                , 4];
                _b = (_a = updates).push;
                return [4
                /*yield*/
                , this.addDocuments(documents.slice(i, i + batchSize), options)];

              case 2:
                _b.apply(_a, [_c.sent()]);

                _c.label = 3;

              case 3:
                i += batchSize;
                return [3
                /*break*/
                , 1];

              case 4:
                return [2
                /*return*/
                , updates];
            }
          });
        });
      };
      /**
       * Add or update multiples documents to an index
       * @memberof Index
       * @method updateDocuments
       * @param {Array<Document<Partial<T>>>} documents Array of Document objects to add/update
       * @param {AddDocumentParams} options? Query parameters
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued update
       */


      Index.prototype.updateDocuments = function (documents, options) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/documents");
                return [4
                /*yield*/
                , this.httpRequest.put(url, documents, options)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Add or update multiples documents to an index in batches
       * @memberof Index
       * @method updateDocuments
       * @template T
       * @param {Array<Document<T>>} documents Array of Document objects to add/update
       * @param {number} batchSize Size of the batch
       * @param {AddDocumentParams} options? Query parameters
       * @returns {Promise<EnqueuedTasks>} Promise containing array of enqueued update objects for each batch
       */


      Index.prototype.updateDocumentsInBatches = function (documents, batchSize, options) {
        if (batchSize === void 0) {
          batchSize = 1000;
        }

        return __awaiter(this, void 0, void 0, function () {
          var updates, i, _a, _b;

          return __generator(this, function (_c) {
            switch (_c.label) {
              case 0:
                updates = [];
                i = 0;
                _c.label = 1;

              case 1:
                if (!(i < documents.length)) return [3
                /*break*/
                , 4];
                _b = (_a = updates).push;
                return [4
                /*yield*/
                , this.updateDocuments(documents.slice(i, i + batchSize), options)];

              case 2:
                _b.apply(_a, [_c.sent()]);

                _c.label = 3;

              case 3:
                i += batchSize;
                return [3
                /*break*/
                , 1];

              case 4:
                return [2
                /*return*/
                , updates];
            }
          });
        });
      };
      /**
       * Delete one document
       * @memberof Index
       * @method deleteDocument
       * @param {string | number} documentId Id of Document to delete
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued task
       */


      Index.prototype.deleteDocument = function (documentId) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/documents/").concat(documentId);
                return [4
                /*yield*/
                , this.httpRequest["delete"](url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Delete multiples documents of an index
       * @memberof Index
       * @method deleteDocuments
       * @param {string[] | number[]} documentsIds Array of Document Ids to delete
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued task
       */


      Index.prototype.deleteDocuments = function (documentsIds) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/documents/delete-batch");
                return [4
                /*yield*/
                , this.httpRequest.post(url, documentsIds)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Delete all documents of an index
       * @memberof Index
       * @method deleteAllDocuments
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued task
       */


      Index.prototype.deleteAllDocuments = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/documents");
                return [4
                /*yield*/
                , this.httpRequest["delete"](url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      }; ///
      /// SETTINGS
      ///

      /**
       * Retrieve all settings
       * @memberof Index
       * @method getSettings
       * @returns {Promise<Settings>} Promise containing Settings object
       */


      Index.prototype.getSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings");
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Update all settings
       * Any parameters not provided will be left unchanged.
       * @memberof Index
       * @method updateSettings
       * @param {Settings} settings Object containing parameters with their updated values
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued task
       */


      Index.prototype.updateSettings = function (settings) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings");
                return [4
                /*yield*/
                , this.httpRequest.post(url, settings)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Reset settings.
       * @memberof Index
       * @method resetSettings
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued task
       */


      Index.prototype.resetSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings");
                return [4
                /*yield*/
                , this.httpRequest["delete"](url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      }; ///
      /// SYNONYMS
      ///

      /**
       * Get the list of all synonyms
       * @memberof Index
       * @method getSynonyms
       * @returns {Promise<object>} Promise containing object of synonym mappings
       */


      Index.prototype.getSynonyms = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/synonyms");
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Update the list of synonyms. Overwrite the old list.
       * @memberof Index
       * @method updateSynonyms
       * @param {Synonyms} synonyms Mapping of synonyms with their associated words
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued task
       */


      Index.prototype.updateSynonyms = function (synonyms) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/synonyms");
                return [4
                /*yield*/
                , this.httpRequest.post(url, synonyms)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Reset the synonym list to be empty again
       * @memberof Index
       * @method resetSynonyms
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued task
       */


      Index.prototype.resetSynonyms = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/synonyms");
                return [4
                /*yield*/
                , this.httpRequest["delete"](url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      }; ///
      /// STOP WORDS
      ///

      /**
       * Get the list of all stop-words
       * @memberof Index
       * @method getStopWords
       * @returns {Promise<string[]>} Promise containing array of stop-words
       */


      Index.prototype.getStopWords = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/stop-words");
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Update the list of stop-words. Overwrite the old list.
       * @memberof Index
       * @method updateStopWords
       * @param {StopWords} stopWords Array of strings that contains the stop-words.
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued update
       */


      Index.prototype.updateStopWords = function (stopWords) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/stop-words");
                return [4
                /*yield*/
                , this.httpRequest.post(url, stopWords)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Reset the stop-words list to be empty again
       * @memberof Index
       * @method resetStopWords
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued update
       */


      Index.prototype.resetStopWords = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/stop-words");
                return [4
                /*yield*/
                , this.httpRequest["delete"](url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      }; ///
      /// RANKING RULES
      ///

      /**
       * Get the list of all ranking-rules
       * @memberof Index
       * @method getRankingRules
       * @returns {Promise<string[]} Promise containing array of ranking-rules
       */


      Index.prototype.getRankingRules = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/ranking-rules");
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Update the list of ranking-rules. Overwrite the old list.
       * @memberof Index
       * @method updateRankingRules
       * @param {RankingRules} rankingRules Array that contain ranking rules sorted by order of importance.
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued update
       */


      Index.prototype.updateRankingRules = function (rankingRules) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/ranking-rules");
                return [4
                /*yield*/
                , this.httpRequest.post(url, rankingRules)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Reset the ranking rules list to its default value
       * @memberof Index
       * @method resetRankingRules
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued update
       */


      Index.prototype.resetRankingRules = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/ranking-rules");
                return [4
                /*yield*/
                , this.httpRequest["delete"](url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      }; ///
      /// DISTINCT ATTRIBUTE
      ///

      /**
       * Get the distinct-attribute
       * @memberof Index
       * @method getDistinctAttribute
       * @returns {Promise<string | null>} Promise containing the distinct-attribute of the index
       */


      Index.prototype.getDistinctAttribute = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/distinct-attribute");
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Update the distinct-attribute.
       * @memberof Index
       * @method updateDistinctAttribute
       * @param {DistinctAttribute} distinctAttribute Field name of the distinct-attribute
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued update
       */


      Index.prototype.updateDistinctAttribute = function (distinctAttribute) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/distinct-attribute");
                return [4
                /*yield*/
                , this.httpRequest.post(url, distinctAttribute)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Reset the distinct-attribute.
       * @memberof Index
       * @method resetDistinctAttribute
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued update
       */


      Index.prototype.resetDistinctAttribute = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/distinct-attribute");
                return [4
                /*yield*/
                , this.httpRequest["delete"](url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      }; ///
      /// FILTERABLE ATTRIBUTES
      ///

      /**
       * Get the filterable-attributes
       * @memberof Index
       * @method getFilterableAttributes
       * @returns {Promise<string[]>} Promise containing an array of filterable-attributes
       */


      Index.prototype.getFilterableAttributes = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/filterable-attributes");
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Update the filterable-attributes.
       * @memberof Index
       * @method updateFilterableAttributes
       * @param {FilterableAttributes} filterableAttributes Array of strings containing the attributes that can be used as filters at query time
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued update
       */


      Index.prototype.updateFilterableAttributes = function (filterableAttributes) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/filterable-attributes");
                return [4
                /*yield*/
                , this.httpRequest.post(url, filterableAttributes)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Reset the filterable-attributes.
       * @memberof Index
       * @method resetFilterableAttributes
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued update
       */


      Index.prototype.resetFilterableAttributes = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/filterable-attributes");
                return [4
                /*yield*/
                , this.httpRequest["delete"](url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      }; ///
      /// SORTABLE ATTRIBUTES
      ///

      /**
       * Get the sortable-attributes
       * @memberof Index
       * @method getSortableAttributes
       * @returns {Promise<string[]>} Promise containing array of sortable-attributes
       */


      Index.prototype.getSortableAttributes = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/sortable-attributes");
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Update the sortable-attributes.
       * @memberof Index
       * @method updateSortableAttributes
       * @param {SortableAttributes} sortableAttributes Array of strings containing the attributes that can be used to sort search results at query time
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued task
       */


      Index.prototype.updateSortableAttributes = function (sortableAttributes) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/sortable-attributes");
                return [4
                /*yield*/
                , this.httpRequest.post(url, sortableAttributes)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Reset the sortable-attributes.
       * @memberof Index
       * @method resetSortableAttributes
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued task
       */


      Index.prototype.resetSortableAttributes = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/sortable-attributes");
                return [4
                /*yield*/
                , this.httpRequest["delete"](url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      }; ///
      /// SEARCHABLE ATTRIBUTE
      ///

      /**
       * Get the searchable-attributes
       * @memberof Index
       * @method getSearchableAttributes
       * @returns {Promise<string[]>} Promise containing array of searchable-attributes
       */


      Index.prototype.getSearchableAttributes = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/searchable-attributes");
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Update the searchable-attributes.
       * @memberof Index
       * @method updateSearchableAttributes
       * @param {SearchableAttributes} searchableAttributes Array of strings that contains searchable attributes sorted by order of importance(most to least important)
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued task
       */


      Index.prototype.updateSearchableAttributes = function (searchableAttributes) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/searchable-attributes");
                return [4
                /*yield*/
                , this.httpRequest.post(url, searchableAttributes)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Reset the searchable-attributes.
       * @memberof Index
       * @method resetSearchableAttributes
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued task
       */


      Index.prototype.resetSearchableAttributes = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/searchable-attributes");
                return [4
                /*yield*/
                , this.httpRequest["delete"](url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      }; ///
      /// DISPLAYED ATTRIBUTE
      ///

      /**
       * Get the displayed-attributes
       * @memberof Index
       * @method getDisplayedAttributes
       * @returns {Promise<string[]>} Promise containing array of displayed-attributes
       */


      Index.prototype.getDisplayedAttributes = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/displayed-attributes");
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Update the displayed-attributes.
       * @memberof Index
       * @method updateDisplayedAttributes
       * @param {DisplayedAttributes} displayedAttributes Array of strings that contains attributes of an index to display
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued update
       */


      Index.prototype.updateDisplayedAttributes = function (displayedAttributes) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/displayed-attributes");
                return [4
                /*yield*/
                , this.httpRequest.post(url, displayedAttributes)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Reset the displayed-attributes.
       * @memberof Index
       * @method resetDisplayedAttributes
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued update
       */


      Index.prototype.resetDisplayedAttributes = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/displayed-attributes");
                return [4
                /*yield*/
                , this.httpRequest["delete"](url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      }; ///
      /// TYPO TOLERANCE
      ///

      /**
       * Get the typo tolerance settings.
       * @memberof Index
       * @method getTypoTolerance
       * @returns {Promise<string[]>} Promise containing the typo tolerance settings.
       */


      Index.prototype.getTypoTolerance = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/typo-tolerance");
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Update the typo tolerance settings.
       * @memberof Index
       * @method updateTypoTolerance
       * @param {TypoTolerance} typoTolerance Object containing the custom typo tolerance settings.
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued update
       */


      Index.prototype.updateTypoTolerance = function (typoTolerance) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/typo-tolerance");
                return [4
                /*yield*/
                , this.httpRequest.post(url, typoTolerance)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Reset the typo tolerance settings.
       * @memberof Index
       * @method resetTypoTolerance
       * @returns {Promise<EnqueuedTask>} Promise containing object of the enqueued update
       */


      Index.prototype.resetTypoTolerance = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes/".concat(this.uid, "/settings/typo-tolerance");
                return [4
                /*yield*/
                , this.httpRequest["delete"](url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };

      return Index;
    }();

    /*
     * Bundle: MeiliSearch
     * Project: MeiliSearch - Javascript API
     * Author: Quentin de Quelen <quentin@meilisearch.com>
     * Copyright: 2019, MeiliSearch
     */

    var Client =
    /** @class */
    function () {
      /**
       * Creates new MeiliSearch instance
       * @param {Config} config Configuration object
       */
      function Client(config) {
        this.config = config;
        this.httpRequest = new HttpRequests(config);
        this.tasks = new TaskClient(config);
      }
      /**
       * Return an Index instance
       * @memberof MeiliSearch
       * @method index
       * @template T
       * @param {string} indexUid The index UID
       * @returns {Index<T>} Instance of Index
       */


      Client.prototype.index = function (indexUid) {
        return new Index(this.config, indexUid);
      };
      /**
       * Gather information about an index by calling MeiliSearch and
       * return an Index instance with the gathered information
       * @memberof MeiliSearch
       * @method getIndex
       * @template T
       * @param {string} indexUid The index UID
       * @returns {Promise<Index<T>>} Promise returning Index instance
       */


      Client.prototype.getIndex = function (indexUid) {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            return [2
            /*return*/
            , new Index(this.config, indexUid).fetchInfo()];
          });
        });
      };
      /**
       * Gather information about an index by calling MeiliSearch and
       * return the raw JSON response
       * @memberof MeiliSearch
       * @method getRawIndex
       * @param {string} indexUid The index UID
       * @returns {Promise<IndexResponse>} Promise returning index information
       */


      Client.prototype.getRawIndex = function (indexUid) {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            return [2
            /*return*/
            , new Index(this.config, indexUid).getRawInfo()];
          });
        });
      };
      /**
       * Get all the indexes as Index instances.
       * @memberof MeiliSearch
       * @method getIndexes
       * @returns {Promise<Index[]>} Promise returning array of raw index information
       */


      Client.prototype.getIndexes = function () {
        return __awaiter(this, void 0, void 0, function () {
          var response, indexes;

          var _this = this;

          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4
                /*yield*/
                , this.getRawIndexes()];

              case 1:
                response = _a.sent();
                indexes = response.map(function (index) {
                  return new Index(_this.config, index.uid, index.primaryKey);
                });
                return [2
                /*return*/
                , indexes];
            }
          });
        });
      };
      /**
       * Get all the indexes in their raw value (no Index instances).
       * @memberof MeiliSearch
       * @method getRawIndexes
       * @returns {Promise<IndexResponse[]>} Promise returning array of raw index information
       */


      Client.prototype.getRawIndexes = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "indexes";
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Create a new index
       * @memberof MeiliSearch
       * @method createIndex
       * @template T
       * @param {string} uid The index UID
       * @param {IndexOptions} options Index options
       * @returns {Promise<Index<T>>} Promise returning Index instance
       */


      Client.prototype.createIndex = function (uid, options) {
        if (options === void 0) {
          options = {};
        }

        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4
                /*yield*/
                , Index.create(uid, options, this.config)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Update an index
       * @memberof MeiliSearch
       * @method updateIndex
       * @template T
       * @param {string} uid The index UID
       * @param {IndexOptions} options Index options to update
       * @returns {Promise<Index<T>>} Promise returning Index instance after updating
       */


      Client.prototype.updateIndex = function (uid, options) {
        if (options === void 0) {
          options = {};
        }

        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4
                /*yield*/
                , new Index(this.config, uid).update(options)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Delete an index
       * @memberof MeiliSearch
       * @method deleteIndex
       * @param {string} uid The index UID
       * @returns {Promise<void>} Promise which resolves when index is deleted successfully
       */


      Client.prototype.deleteIndex = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4
                /*yield*/
                , new Index(this.config, uid)["delete"]()];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Deletes an index if it already exists.
       * @memberof MeiliSearch
       * @method deleteIndexIfExists
       * @param {string} uid The index UID
       * @returns {Promise<boolean>} Promise which resolves to true when index exists and is deleted successfully, otherwise false if it does not exist
       */


      Client.prototype.deleteIndexIfExists = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
          var e_1;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                _a.trys.push([0, 2,, 3]);

                return [4
                /*yield*/
                , this.deleteIndex(uid)];

              case 1:
                _a.sent();

                return [2
                /*return*/
                , true];

              case 2:
                e_1 = _a.sent();

                if (e_1.code === "index_not_found"
                /* INDEX_NOT_FOUND */
                ) {
                    return [2
                    /*return*/
                    , false];
                  }

                throw e_1;

              case 3:
                return [2
                /*return*/
                ];
            }
          });
        });
      }; ///
      /// TASKS
      ///

      /**
       * Get the list of all client tasks
       * @memberof MeiliSearch
       * @method getTasks
       * @returns {Promise<Result<Task[]>>} - Promise returning all tasks
       */


      Client.prototype.getTasks = function () {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4
                /*yield*/
                , this.tasks.getClientTasks()];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Get one task on the client scope
       * @memberof MeiliSearch
       * @method getTask
       * @param {number} taskId - Task identifier
       * @returns {Promise<Task>} - Promise returning a task
       */


      Client.prototype.getTask = function (taskId) {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4
                /*yield*/
                , this.tasks.getClientTask(taskId)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Wait for a batch of tasks to be processed.
       * @memberof MeiliSearch
       * @method waitForTasks
       * @param {number[]} taskIds - Tasks identifier
       * @param {WaitOptions} waitOptions - Options on timeout and interval
       *
       * @returns {Promise<Result<Task[]>>} - Promise returning an array of tasks
       */


      Client.prototype.waitForTasks = function (taskIds, _a) {
        var _b = _a === void 0 ? {} : _a,
            _c = _b.timeOutMs,
            timeOutMs = _c === void 0 ? 5000 : _c,
            _d = _b.intervalMs,
            intervalMs = _d === void 0 ? 50 : _d;

        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_e) {
            switch (_e.label) {
              case 0:
                return [4
                /*yield*/
                , this.tasks.waitForClientTasks(taskIds, {
                  timeOutMs: timeOutMs,
                  intervalMs: intervalMs
                })];

              case 1:
                return [2
                /*return*/
                , _e.sent()];
            }
          });
        });
      };
      /**
       * Wait for a task to be processed.
       *
       * @memberof MeiliSearch
       * @method waitForTask
       * @param {number} taskId - Task identifier
       * @param {WaitOptions} waitOptions - Options on timeout and interval
       *
       * @returns {Promise<Task>} - Promise returning an array of tasks
       */


      Client.prototype.waitForTask = function (taskId, _a) {
        var _b = _a === void 0 ? {} : _a,
            _c = _b.timeOutMs,
            timeOutMs = _c === void 0 ? 5000 : _c,
            _d = _b.intervalMs,
            intervalMs = _d === void 0 ? 50 : _d;

        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_e) {
            switch (_e.label) {
              case 0:
                return [4
                /*yield*/
                , this.tasks.waitForClientTask(taskId, {
                  timeOutMs: timeOutMs,
                  intervalMs: intervalMs
                })];

              case 1:
                return [2
                /*return*/
                , _e.sent()];
            }
          });
        });
      }; ///
      /// KEYS
      ///

      /**
       * Get all API keys
       * @memberof MeiliSearch
       * @method getKeys
       * @returns {Promise<Keys>} Promise returning an object with keys
       */


      Client.prototype.getKeys = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "keys";
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Get one API key
       * @memberof MeiliSearch
       * @method getKey
       *
       * @param {string} key - Key
       * @returns {Promise<Keys>} Promise returning a key
       */


      Client.prototype.getKey = function (key) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "keys/".concat(key);
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Create one API key
       * @memberof MeiliSearch
       * @method createKey
       *
       * @param {KeyPayload} options - Key options
       * @returns {Promise<Key>} Promise returning an object with keys
       */


      Client.prototype.createKey = function (options) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "keys";
                return [4
                /*yield*/
                , this.httpRequest.post(url, options)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Update one API key
       * @memberof MeiliSearch
       * @method updateKey
       *
       * @param {string} key - Key
       * @param {KeyPayload} options - Key options
       * @returns {Promise<Key>} Promise returning an object with keys
       */


      Client.prototype.updateKey = function (key, options) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "keys/".concat(key);
                return [4
                /*yield*/
                , this.httpRequest.patch(url, options)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Delete one API key
       * @memberof MeiliSearch
       * @method deleteKey
       *
       * @param {string} key - Key
       * @returns {Promise<Void>}
       */


      Client.prototype.deleteKey = function (key) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "keys/".concat(key);
                return [4
                /*yield*/
                , this.httpRequest["delete"](url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      }; ///
      /// HEALTH
      ///

      /**
       * Checks if the server is healthy, otherwise an error will be thrown.
       * @memberof MeiliSearch
       * @method health
       * @returns {Promise<Health>} Promise returning an object with health details
       */


      Client.prototype.health = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "health";
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Checks if the server is healthy, return true or false.
       * @memberof MeiliSearch
       * @method isHealthy
       * @returns {Promise<boolean>} Promise returning a boolean
       */


      Client.prototype.isHealthy = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                _a.trys.push([0, 2,, 3]);

                url = "health";
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                _a.sent();

                return [2
                /*return*/
                , true];

              case 2:
                _a.sent();
                return [2
                /*return*/
                , false];

              case 3:
                return [2
                /*return*/
                ];
            }
          });
        });
      }; ///
      /// STATS
      ///

      /**
       * Get the stats of all the database
       * @memberof MeiliSearch
       * @method getStats
       * @returns {Promise<Stats>} Promise returning object of all the stats
       */


      Client.prototype.getStats = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "stats";
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      }; ///
      /// VERSION
      ///

      /**
       * Get the version of MeiliSearch
       * @memberof MeiliSearch
       * @method getVersion
       * @returns {Promise<Version>} Promise returning object with version details
       */


      Client.prototype.getVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "version";
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      }; ///
      /// DUMPS
      ///

      /**
       * Triggers a dump creation process
       * @memberof MeiliSearch
       * @method createDump
       * @returns {Promise<EnqueuedDump>} Promise returning object of the enqueued update
       */


      Client.prototype.createDump = function () {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "dumps";
                return [4
                /*yield*/
                , this.httpRequest.post(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Get the status of a dump creation process
       * @memberof MeiliSearch
       * @method getDumpStatus
       * @param {string} dumpUid Dump UID
       * @returns {Promise<EnqueuedDump>} Promise returning object of the enqueued update
       */


      Client.prototype.getDumpStatus = function (dumpUid) {
        return __awaiter(this, void 0, void 0, function () {
          var url;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                url = "dumps/".concat(dumpUid, "/status");
                return [4
                /*yield*/
                , this.httpRequest.get(url)];

              case 1:
                return [2
                /*return*/
                , _a.sent()];
            }
          });
        });
      };
      /**
       * Generate a tenant token
       *
       * @memberof MeiliSearch
       * @method generateTenantToken
       * @param {SearchRules} searchRules Search rules that are applied to every search.
       * @param {TokenOptions} options Token options to customize some aspect of the token.
       * @returns {String} The token in JWT format.
       */


      Client.prototype.generateTenantToken = function (_searchRules, _options) {
        var error = new Error();
        throw new Error("Meilisearch: failed to generate a tenant token. Generation of a token only works in a node environment \n ".concat(error.stack, "."));
      };

      return Client;
    }();

    var MeiliSearch =
    /** @class */
    function (_super) {
      __extends(MeiliSearch, _super);

      function MeiliSearch(config) {
        return _super.call(this, config) || this;
      }

      return MeiliSearch;
    }(Client);

    exports.HttpRequests = HttpRequests;
    exports.Index = Index;
    exports.MeiliSearch = MeiliSearch;
    exports.MeiliSearchApiError = MeiliSearchApiError;
    exports.MeiliSearchCommunicationError = MeiliSearchCommunicationError;
    exports.MeiliSearchError = MeiliSearchError;
    exports.MeiliSearchTimeOutError = MeiliSearchTimeOutError;
    exports.addProtocolIfNotPresent = addProtocolIfNotPresent;
    exports.addTrailingSlash = addTrailingSlash;
    exports["default"] = MeiliSearch;
    exports.httpErrorHandler = httpErrorHandler;
    exports.httpResponseErrorHandler = httpResponseErrorHandler;
    exports.removeUndefinedFromObject = removeUndefinedFromObject;
    exports.sleep = sleep;

    Object.defineProperty(exports, '__esModule', { value: true });

}));