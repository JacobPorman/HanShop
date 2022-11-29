
// Constructor function: doi tuong Validator
function Validator(options) {
    // Tạo hàm getParent để lấy class cha chứa form-group
    function getParent(element, selector){
        while (element.parentElement){
            if (element.parentElement.matches(selector)){
                return element.parentElement;
            }

            element = element.parentElement;
        }
    }


    var selectorRules = {};

    // Ham thuc hien Validate
    function validate(inputElement, rule) {

        // var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);


        // var errorMessage = rule.test(inputElement.value);
        var errorMessage;

        // Lay ra cac rules cua Selector
        var rules = selectorRules[rule.selector];

        // Lap qua tung rule va kiem tra
        // Neu co loi thi dung kiem tra
        for (var i = 0; i < rules.length; ++i) {

            switch (inputElement.type) {
                case 'radio': 
                case 'checkbox':
                    errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'));
                    break;

                default:
                    errorMessage = rules[i](inputElement.value);
            }

            // errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }

        if(errorMessage){
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        }
        else{
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
         }

        return !errorMessage;

    }

    // Lay element cua form can Validate

    var formElement = document.querySelector(options.form);
    // options.forms.forEach( function(form){
    //     var formElement = document.querySelector(form.selector);
    // });

    if (formElement){

        // In ra form khi submit
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true;

            // Lap qua tung rule va validate
            options.rules.forEach(function (rule){
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);

                if (!isValid){
                    isFormValid = false;
                }
            });



            // Submit voi Javascript
            if(isFormValid){
                if (typeof options.onSubmit === 'function'){

                    var enableInputs = formElement.querySelectorAll('[name]');
                        
                    // reduce ???

                    // conver 'enableInputs' --> Array
                    var formValues = Array.from(enableInputs).reduce(function(values, input){

                        switch (input.type){
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;

                            case 'checkbox':
                                // Nếu checkbox không được check thì sẽ được bỏ qua
                                if(!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                } 

                                // Nếu checkbox không phải Array thì array bằng rỗng
                                if(!Array.isArray(values[input.name])){
                                    values[input.name] = [];
                                }

                                values[input.name].push(input.value);

                                break;

                            case 'file':
                                values[input.name] = input.files;
                                break;

                            default:
                                values[input.name] = input.value;
                                 
                        }

                        return values;
                    }, {});

                    options.onSubmit(formValues);
                }
                // Submit voi hanh vi mac dinh
                    else {
                    formElement.submit();
                }
            }

        }

        // Lap qua moi rule va xu ly (lang nghe su kien onblur, input,...)
        options.rules.forEach(function (rule){

            // Luu lai cac Rules cho moi input
            // selectorRules[rule.selector] = rule.test;

            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach(function(inputElement) {
                // Xu li truong hop blur khoi input
                inputElement.onblur = function(){
                    validate(inputElement, rule);
                }

                // Xu li khi user nhap vao input
                inputElement.oninput = function() {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                }
            });

        });
    }



}



// Dinh nghia Rules
// Nguyen tac cac Rules
// 1. Khi co loi => message loi
// 2. Khi hop le => khong tra gi (undefined)
Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : message || 'Vui long nhap truong nay!';
        }
    };
}


Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            return regex.test(value) ? undefined : message || 'Truong nay phai la email!';
        }
    };
}


Validator.minLength = function(selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Your password must be at least ${min} characters!`;
        }
    };
}


Validator.isConfirm = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Gia tri nhap lai khong dung';
        }
    };
}
