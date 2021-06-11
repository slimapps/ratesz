/**
 * version: 0.0.1
 * bob.d4niel@yahoo.com
 * https://scriptsez.com
 */
;
(function(){
    $.fn.rateszDefaults = {
        version: '0.0.1', 
        type: 0, 
        length: 5,
        value: 3.5,
        half: true, 
        decimal: true,
        readonly: true,
        hover: false,
        text: true,
        textList: ['Bad', 'Not Bad', 'Medium', 'Good', 'Excellent'],
        theme: '#FFB800',
        size: '20px',
        gutter: '3px',
        selectClass: 'ratesz_select',
        incompleteClass: '',
        customClass: '',
        validate: function(){
            var _this = this;
            if(_this.value * 1 > _this.length * 1){
                alert('value must less than length');
            }
            if(_this.textList.length > _this.length * 1){
                alert('textList.length must less than length');
            }
        },
        getPath: function(){ 
            var jsPath = document.currentScript ? document.currentScript.src : function(){
                var js = document.scripts,
                    last = js.length - 1,
                    src;
                for(var i = last; i > 0; i--){
                    if(js[i].readyState === 'interactive'){
                        src = js[i].src;
                        break;
                    }
                }
                return src || js[last].src;
            }();
            return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
        }(),
        link: function(href, cssname){ 
            if(!this.getPath) return;
            var head = document.getElementsByTagName("head")[0], link = document.createElement('link');
            var id = cssname;

            link.rel = 'stylesheet';
            link.href = this.getPath + href;
            link.id = id;

            if(!document.getElementById(id)){
                head.appendChild(link);
            }
        },
        script: function(src, jsname){ 
            if(!this.getPath) return;
            var head = document.getElementsByTagName("head")[0], script = document.createElement('script');
            var id = jsname;

            script.src = this.getPath + src;
            script.id = id;

            if(!document.getElementById(id)){
                head.appendChild(script);
            }
        },
        addEventClick: function (renderBox, type) {
            var _this = this;
            $(renderBox).find(".ratesz_box").on("click", '.ratesz_item', function(){
                var $this = $(this);
                if(_this.value == $this.index() + 1){
                    return false;
                }
                _this.value = $this.index() + 1;
                _this.render(renderBox, type);
                var object = {
                    dom: $(renderBox)[0],
                    index: $this.index()
                }
                _this.callback(object);
            });
        },
        countValue: function(){
            var _this = this;
            var returnValue;
            if(_this.value == parseInt(_this.value)){
                returnValue = {
                    int: _this.value,
                    float: ''
                }
            }else{
                returnValue = {
                    int: parseInt(_this.value),
                    float: (parseFloat(_this.value) * 1000 - parseInt(_this.value) * 1000) / 1000
                }
            }
            return returnValue;
        },
        countText: function(){
            var _this = this,
                curFloat = _this.value * _this.textList.length / _this.length,
                curRound = Math.round(curFloat),
                curIndex = 0;
            curIndex = curRound > 0 ? curRound - 1 : curRound;
            if(_this.decimal || _this.half){
                _this.value > parseInt(_this.value) && (_this.value > (curRound ? curRound * _this.length / _this.textList.length : _this.length / _this.textList.length)) && curIndex++;
            }
            return _this.textList[curIndex];
        },
        getIconName: function(index, type){
            var rateszItemIconUnicode = ['&#xe610;', '&#xe604;', '&#xe608;', '&#xe605;', '&#xe606;', '&#xe607;', '&#xe60b;', '&#xe60a;', '&#xe60c;', '&#xe60d;', '&#xe609;'];
            return type * 1 === 2 ? rateszItemIconUnicode[index] : ('icon-stars-' + index);
        },
        render: function(renderBox, type){
            var _this = this,
                rateszBoxHtml = '',
                rateszHtml = '',
                rateszHtmlTpl = '<div class="ratesz_wrapper ' + _this.customClass + (_this.hover ? "\" title=\"" + _this.value + "\"" : '"') + '><div class="ratesz_box clearfix">{{rateszHtmlTpl}}</div>{{textTpl}}</div>',
                rateszItemIcon = '';
            var rateszItemStyle = (_this.theme ? 'color:' + _this.theme : '') + ';' + (_this.gutter ? 'margin: 0 ' + _this.gutter : '') + ';';
            var rateszItemIconStyle = (_this.size ? 'font-size:' + _this.size : '') + ';';

            if(type * 1 === 0){
                rateszItemIcon = '<svg class="icon" style="' + rateszItemIconStyle + '" aria-hidden="true"><use xlink:href="#{{iconname}}"></use></svg>';
            }else if(type * 1 === 1){
                rateszItemIcon = '<i class="iconfont {{iconname}}" style="' + rateszItemIconStyle + '"></i>';
            }else if(type * 1 === 2){
                rateszItemIcon = '<i class="iconfont icon-ratesz-item" style="' + rateszItemIconStyle + '">{{iconname}}</i>';
            }

            var rateszItemTpl = '<div class="ratesz_item {{selectClass}}" style="' + rateszItemStyle + '">' + rateszItemIcon + '</div>';
            var valueObj = _this.countValue();
            for(var i = 0; i < _this.length; i++){
                if(_this.decimal || _this.half){
                    if(i < valueObj.int){
                        rateszHtml = rateszHtml + rateszItemTpl.replace('{{selectClass}}', _this.selectClass).replace('{{iconname}}', _this.getIconName(10, type));
                    }else if(i == valueObj.int){
                        var index = 0;
                        if(_this.decimal){
                            index = valueObj.float * 10;
                        }else if(_this.half){
                            if(valueObj.float < 0.33){
                                index = 0;
                            }else if(valueObj.float > 0.66){
                                index = 10;
                            }else{
                                index = 5;
                            }
                        }
                        rateszHtml = rateszHtml + rateszItemTpl.replace('{{selectClass}}', _this.incompleteClass).replace('{{iconname}}', _this.getIconName(index, type));
                    }else{
                        rateszHtml = rateszHtml + rateszItemTpl.replace('{{selectClass}}', '').replace('{{iconname}}', _this.getIconName(0, type));
                    }
                }else{
                    if(i < valueObj.int){
                        rateszHtml = rateszHtml + rateszItemTpl.replace('{{selectClass}}', _this.selectClass).replace('{{iconname}}', _this.getIconName(10, type));
                    }else{
                        rateszHtml = rateszHtml + rateszItemTpl.replace('{{selectClass}}', '').replace('{{iconname}}', _this.getIconName(0, type));
                    }
                }
            }
            rateszBoxHtml = rateszHtmlTpl.replace('{{rateszHtmlTpl}}', rateszHtml);

            var textStyle = (_this.theme ? 'color:' + _this.theme : '') + ';' + (_this.size ? 'font-size:' + _this.size : '') + ';';
            rateszBoxHtml = _this.text
                ? (_this.value > 0
                    ? rateszBoxHtml.replace('{{textTpl}}', '<div class="ratesz_text" style="' + textStyle + '">' + _this.countText() + '</div>')
                    : rateszBoxHtml.replace('{{textTpl}}', ''))
                : rateszBoxHtml.replace('{{textTpl}}', '');

            $(renderBox).html(rateszBoxHtml);

            if(!_this.readonly){
                _this.addEventClick(renderBox, type);
            }
        },
        callback: function(object){}
    };

    $.fn.ratesz = function(option){
        var options = $.extend({}, $.fn.rateszDefaults, option);
        options.link('../css/ratesz.css', 'rateszLink');
        if(options.type * 1 === 0){
            options.script('../files/iconfont/iconfont.js', 'rateszIconfontSvg');
        }else{
            options.link('../files/iconfont/iconfont.css', 'rateszIconfontCss');
        }
        this.each(function(index, element) {
            options.validate();
            options.render(element, options.type);
        });
        return this;
    };
})(jQuery);
