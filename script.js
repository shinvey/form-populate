/**
 * @date 12/25/2015
 * @author <a href="mailto:ex-huxinwei001@pingan.com.cn">Shinvey Hu</a>
 */
$(document).ready(function () {
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
        "checkbox2": "2",
        "radio": "2",
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
        "clothes": {
            "color": [
                "red",
                "green",
                "blue"
            ]
        }
    };
    var $form = $("#test");
    $form[0].reset();
    $form.populate(data, {debug: true});

    var elements = $("#test").prop("elements");
    for(var x in elements) {
        console.log(x,elements[x]);
    }
});