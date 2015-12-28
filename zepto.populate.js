/**
 * 表单填充
 * Thanks for the plugin jquery-populate
 * @see 基于原作{@link http://davestewart.io/plugins/jquery/jquery-populate/|jquery-populate}之上重写核心函数parseJSON，满足了更复杂填充用例
 * @param {Object} data 将要填充值表单的数据
 * @param {Object} [options]
 * @param {Boolean} [options.silent=false]  是否对只改变的元素出发change事件
 * @param {Object} [options.resetForm=true] 是否重置表单
 * @param {Object} [options.debug=false] 调试模式可以通过window._populate访问内部处理细节
 * @returns {$}
 * @example
 * $form.populate(data, {
        resetForm: true,
        silent: false,
        debug: true
    });
 */
$.fn.populate = function (data, options) {
    if (isUndefined(data)) return this;

    options = $.extend(
        {
            resetForm: true,
            silent: false,
            debug: false
        },
        options
    );

    if (options.debug) {
        window._populate = {
            elements: []
        }
    }

    function isUndefined(value) {
        return value === void 0;
    }

    function debug(str) {
        if (window.console && console.log) {
            console.log(str);
        }
    }

    /**
     * 将直接将常规JSON Object转成表单name作为键
     * @param {Object} data
     * @returns {Object}
     */
    function parseJSON(data) {
        var strParam = $.param(data||{}).replace(/\+/g, '%20'),
            arrParam = strParam.split("&"),
            obj = {};

        arrParam.forEach(function (strKeyVal) {
            var arrKeyVal = strKeyVal.split("=").map(decodeURIComponent),
                objVal = obj[ arrKeyVal[0] ];

            if ( obj.hasOwnProperty(arrKeyVal[0]) ) {
                Array.isArray(objVal)
                    ? objVal.push(arrKeyVal[1])
                    : (obj[ arrKeyVal[0] ] = [objVal, arrKeyVal[1]]);

            } else {
                obj[ arrKeyVal[0] ] = arrKeyVal[1];
            }
        });
        return obj;
    }

    function populateFormElement(form, name, value) {
        var changedItems = [];
        // check that the named element exists in the form
        var element = form.querySelectorAll("[name=\""+name+"\"]");//form[name];
        if (element == undefined) {
            debug('No such element as ' + name);
            return false;
        }

        // debug options
        if (options.debug) {
            _populate.elements.push(element);
        }

        // now, place any single elements in an array.
        // this is so that the next bit of code (a loop) can treat them the
        // same as any array-elements passed, ie radiobutton or checkox arrays,
        // and the code will just work

        var elements = element.type == undefined && element.length ? element : [element];

        // populate the element correctly
        var values,
            j,
            _value,
            type,
            oldVal;
        for (var e = 0; e < elements.length; e++) {

            element = elements[e];
            type = element.type || element.tagName;
            _value = Array.isArray(value) ? value[e] : value;
            _value = isUndefined(_value) ? "" : _value;

            switch (true) {
                case ['radio', 'checkbox'].indexOf(type) != -1:
                    // use the single value to check the radio button
                    oldVal = element.checked;
                    element.checked = (element.value != '' && _value.toString().toLowerCase() == element.value.toLowerCase());
                    oldVal != element.checked && changedItems.push(element);
                    break;

                case type == 'select-multiple':
                    values = value.constructor == Array ? value : [value];
                    var boolChanged = false;
                    for (var i = 0; i < element.options.length; i++) {
                        for (j = 0; j < values.length; j++) {
                            oldVal = element.options[i].selected;
                            element.options[i].selected |= element.options[i].value == values[j];
                            oldVal != element.options[i].selected && (boolChanged = true);
                        }
                    }
                    boolChanged && changedItems.push(element);
                    break;

                default:
                    oldVal = element.value;
                    element.value = _value;
                    oldVal != element.value && changedItems.push(element);
            }

        }

        return changedItems;
    }

    var objElements = parseJSON(data);
    var changedItems = [];
    this.each(function () {
        var tagName = this.tagName.toLowerCase();
        var method = populateFormElement;

        // reset form?
        if (tagName == 'form' && options.resetForm) {
            this.reset();
        }

        // update elements
        for (var i in objElements) {
            if ( !objElements.hasOwnProperty(i) ) continue;
            changedItems = changedItems.concat(method(this, i, objElements[i]));
        }
    });
    !options.silent && $(changedItems).trigger("change");

    if (options.debug) {
        $.extend(window._populate, {
            objElements: objElements,
            data: data
        });
    }

    return this;
};