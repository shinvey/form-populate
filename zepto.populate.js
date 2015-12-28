/**
 * 表单填充
 * @see http://davestewart.io/plugins/jquery/jquery-populate/
 * @param obj
 * @param options
 * @returns {$}
 */
$.fn.populate = function (obj, options) {

    function likeArr(value) {
        return typeof value.length == "number";
    }
    function isNumeric(value) {
        return value - parseFloat( value ) >= 0;
    }
    function isElement(value) {
        return !!value && value.nodeType === 1;
    }
    function isInput(el) {
        return isElement(el) && [
                "checkbox",
                "date",
                "datetime",
                "datetime-local",
                "email",
                "file",
                "hidden",
                "image",
                "month",
                "number",
                "password",
                "radio",
                "range",
                "text",
                "time",
                "url",
                "week",

                "select-multiple",
                "select-one",
                "textarea"
            ].indexOf(el.type || "") != -1;
    }
    function isUndefined(value) {
        return value === void 0;
    }

    //var elements = $("#test").prop("elements");

    // ------------------------------------------------------------------------------------------
    // JSON conversion function

    // convert
    /*function parseJSONByEl(elements) {
        var keyName,
            el,
            nodeList,
            objElements = {},
            boolIsInput,
            boolLikeArr;
        for(keyName in elements) {
            if ( !elements.hasOwnProperty(keyName) || isNumeric(keyName) ) continue;
            //console.log(typeof keyName, keyName, elements[keyName]);
            el = elements[keyName];
            boolIsInput = isInput(el);
            boolLikeArr = likeArr(el);

            if ( !boolIsInput && !boolLikeArr) continue;

            if ( boolLikeArr ) {
                nodeList = el;
                var arrValues = [];
                $.each(nodeList, function (idx, el) {
                    arrValues.push($(el).val());
                });
                objElements[keyName] = arrValues;
            } else {
                objElements[keyName] = $(el).val();
            }
        }

        return objElements;
    }*/
    /**
     * 将直接将常规JSON Object转成表单name作为键
     * @param {Object} data
     * @returns {Object}
     */
    function parseJSON(data) {
        var strParam = $.param(data||{}).replace(/\+/g, '%20');
        var arrParam = strParam.split("&"),
            obj = {};
        arrParam.forEach(function (strKeyVal) {
            var arrKeyVal = strKeyVal.split("=").map(decodeURIComponent);
            var objVal = obj[ arrKeyVal[0] ];
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


    // ------------------------------------------------------------------------------------------
    // population functions

    function debug(str) {
        if (window.console && console.log) {
            console.log(str);
        }
    }

    function getElementName(name) {
        if (!options.phpNaming) name = name.replace(/\[]$/, '');
        return name;
    }

    /*function populateElement(parentElement, name, value) {
        var selector = options.identifier == 'id' ? '#' + name : '[' + options.identifier + '="' + name + '"]';
        var element = $(selector, parentElement);
        value = value.toString();
        value = value == 'null' ? '' : value;
        element.html(value);
    }*/

    function populateFormElement(form, name, value) {
        var changedItems = [];
        // check that the named element exists in the form
        name = getElementName(name); // handle non-php naming
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
                    var boolchanged = false;
                    for (var i = 0; i < element.options.length; i++) {
                        for (j = 0; j < values.length; j++) {
                            oldVal = element.options[i].selected;
                            element.options[i].selected |= element.options[i].value == values[j];
                            oldVal != element.options[i].selected && (boolchanged = true);
                        }
                    }
                    boolchanged && changedItems.push(element);
                    break;

                default:
                    oldVal = element.value;
                    element.value = _value;
                    oldVal != element.value && changedItems.push(element);
            }

        }

        return changedItems;
    }


    // ------------------------------------------------------------------------------------------
    // options & setup

    // exit if no data object supplied
    if (obj === undefined) {
        return this;
    }

    // options
    options = $.extend
    (
        {
            phpNaming: true,
            phpIndices: false,
            resetForm: true,
            identifier: 'id',
            silent: false,
            debug: false
        },
        options
    );

    if (options.phpIndices) {
        options.phpNaming = true;
    }

    // ------------------------------------------------------------------------------------------
    // convert hierarchical JSON to flat array

    var objElements = parseJSON(obj);

    if (options.debug) {
        window._populate =
        {
            arr: objElements,
            obj: obj,
            elements: []
        }
    }

    // ------------------------------------------------------------------------------------------
    // main process function
    var changedItems = [];
    this.each
    (
        function () {

            // variables
            var tagName = this.tagName.toLowerCase();
            //var method = tagName == 'form' ? populateFormElement : populateElement;
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
        }
    );

    !options.silent && $(changedItems).trigger("change");

    return this;
};