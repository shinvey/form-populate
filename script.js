/**
 * @date 12/25/2015
 * @author <a href="mailto:ex-huxinwei001@pingan.com.cn">Shinvey Hu</a>
 */
$(document).ready(function ($) {
    var data = {
        "c21InsuranList": [
            {
                "name": "shinvey",
                "c21paymentCategory": "123"
            },
            {
                "name": "jobin",
                "c21paymentCategory": "456"
            }
        ],
        "checkbox1": 1,
        "checkbox": [2],
        "radio": "2",
        "mydate": "2015-12-28",
        "fruit": [
            "apple",
            "orange",
            "grape"
        ],
        "Utensils": [
            {
                "name": "刀",
                "EnglishName": "Knife"
            },
            {
                "name": "Fork"
            },
            {
                "name": "Chopsticks"
            }
        ],
        "textarea": "A word in textarea",
        "select": "2",
        "select-multiple": [1,2],
        "clothes": {
            "color": [
                "red",
                "green",
                "blue"
            ]
        }
    };
    var $form = $("#test");
    $form.on("change", "#select", function (e) {
        console.log(e);
    });
    console.dir($form[0].elements);
    $form.populate(data, {
        resetForm: true,
        silent: false,
        debug: true
    });
    console.log("_populate", _populate);

});