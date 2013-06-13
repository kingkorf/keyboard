/*
 * Javascript Keyboard
 *
 * Authors:
 *  Albert Bakker (hallo[at]abbert[dot]nl)
 *
 * Company:
 *  Skrepr (http://skrepr.com)
 * 
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * http://keyboard.abbert.nl
 *
 * 
 * Depends:
 *  jquery
 *
 * Optional:
 * 
 * Todo:
 *  improve tab ability
 *  icons in sprite
 *  cleanup css
 */

!(function(window, $) {
    "use strict"

    var Keyboard = function(id) {
        this.$wrapper = $('<div id="' + id + '"></div>').appendTo('body');
        this.$keyboard = $('<div class="keyboard"></div>').appendTo(this.$wrapper);

        this.$currentElement = null;

        this.init();
        this.listen();
    }

    Keyboard.prototype = {
        constructor: Keyboard

        , init: function() {
            var template = ['.','1','2','3','4','5','6','7','8','9','0','-','+','backspace last','tab','q','w','e','r','t','y','u','i','o','p','[',']','dummy15 last','caps','a','s','d','f','g','h','j','k','l',':','"','enter last','shift','z','x','c','v','b','n','m',',','.','/','shift last','space','close last'],
                len = template.length,
                new_row = false;

            for(var i = 0; i<len; ++i) {
                var $el;
                if(i in template) {
                    if(template[i].substr(-4) == 'last') {
                        template[i] = template[i].replace(template[i].substr(-5), '');
                        new_row = true;
                    }

                    if(template[i] == 'dummy') {
                        $el = $('<div class="dummy"></div>');
                    }else if(template[i] == 'dummy15') {
                        $el = $('<div class="dummy dummy15"></div>');
                    }else if(template[i] == 'space') {
                        $el = $('<a href="#" class="key letter spacebar" data-letter=" ">space</a>');
                    }else if(template[i] == 'backspace') {
                        $el = $('<a href="#" class="key backspace">&lt;</a>');
                    }else if(template[i] == 'clear') {
                        $el = $('<div style="clear: both"></div>');
                    }else if(template[i] == 'enter') {
                        $el = $('<a href="#" class="key letter enter" data-letter="\n">Enter</a>');
                    }else if(template[i] == 'new_row') {
                        $el = $('<br style="clear: both">');
                    }else if(template[i] == 'tab') {
                        $el = $('<a href="#" class="key tab">tab</a>');
                    }else if(template[i] == 'shift') {
                        $el = $('<a href="#" class="key shift">Shift</a>');
                    }else if(template[i] == 'caps') {
                        $el = $('<a href="#" class="key caps">Shift</a>');
                    }else if(template[i] == 'oke') {
                        $el = $('<a href="#" class="key oke">OKE</a>');
                    }else if(template[i] == 'close') {
                        $el = $('<a href="#" class="key close">X</a>');
                    }else{
                        $el = $('<a href="#" class="key letter" data-letter="'+template[i]+'">'+template[i]+'</a>');
                    }

                    $el.appendTo(this.$keyboard);

                    if (new_row) {
                        $el.addClass('last');
                        $('<br style="clear: both">').appendTo(this.$keyboard);
                        new_row = false;
                    }
                }
            }

            this.$keyboard.hide();
        }

        , 'addField': function(field) {
            var that = this;
            $(document).on('focus', field, function() {
                that.$currentElement = $(this);
                that.show();
            });
        }

        , select: function() {
            var letter = this.$keyboard.find('.active').data('letter')
                , nieuw = this.$currentElement.val() + letter;
            this.$currentElement.val('').focus().val(nieuw);
            this.$keyboard.trigger('change');
            this.$currentElement.trigger('keyup');
        }

        , listen: function() {
            this.$keyboard
                // mouseenter
                .on('mouseenter', '.key', $.proxy(this.mouseenter, this))
                // letter
                .on('mousedown', '.letter', $.proxy(this.click, this))
                // tab
                .on('mousedown', '.key.tab', $.proxy(this.tab, this))
                // backspace key
                .on('mousedown', '.backspace', $.proxy(this.backspace, this))
                // capslock
                .on('mousedown', '.caps', $.proxy(this.caps, this))
                // shift key
                .on('mousedown', '.shift', $.proxy(this.caps, this))
                // unshift key
                .on('mousedown', '.unshift', $.proxy(this.unshift, this))
                // focus
                .on('mousedown', $.proxy(this.focus, this))
                // close
                .on('mousedown', '.key.close', $.proxy(this.hide, this))
                // enter
                .on('click', '.key.enter', $.proxy(this.enter, this))
                // click - preventdefault
                .on('click', '.key', function(e) {e.preventDefault()});
        }

        , click: function(e) {
            e.stopPropagation();
            e.preventDefault();
            this.select();
        }

        , mouseenter: function(e) {
            this.$keyboard.find('.active').removeClass('active');
            this.$keyboard.find('.backspace').removeClass('active');
            $(e.currentTarget).addClass('active');
        }

        , backspace: function(e) {
            e.stopPropagation();
            e.preventDefault();
            var val = this.$currentElement.val()
                , nieuw = val.substr(0, val.length - 1)

            this.$currentElement.val('').focus().val(nieuw);
            this.$keyboard.trigger('change');
        }

        , unshift: function() {
            this.$keyboard.find('.letter').removeClass('unshift').removeClass('uppercase').each(function() {
                $(this).data('letter', $(this).data('letter').toString().toLowerCase());
            })
            this.$keyboard.find('.shift.bg').removeClass('bg');
        }

        , enter: function() {
            this.$keyboard.trigger('enter');
        }

        , caps: function(e) {
            var $this = this.$keyboard.find('.active');

            // caps aan en shift indrukken? dan niks doen
            if ($this.hasClass('shift') && this.$keyboard.find('.caps.bg').length) {
                return false;
            } else if($this.hasClass('caps') && this.$keyboard.find('.shift.bg').length) {
                return false;
            }

            if ($this.hasClass('bg')) {
                $this.removeClass('bg');
                this.$keyboard.find('.letter').removeClass('uppercase');
                this.$keyboard.find('.letter').each(function() {
                    var letter = $(this).data('letter');
                    $(this).data('letter', letter.toString().toLowerCase());
                })
            } else {
                $this.addClass('bg');
                this.$keyboard.find('.letter').addClass('uppercase').each(function() {
                    var letter = $(this).data('letter');
                    $(this).data('letter', letter.toString().toUpperCase());
                })
            }

            if ($this.hasClass('shift')) {
                this.$keyboard.find('.letter').addClass('unshift');
            }
        }

        , tab: function(e) {
            e.stopPropagation();
            e.preventDefault();

            var currentTabindex = this.$currentElement.data('tabindex') ? this.$currentElement.data('tabindex') : 0;
            var $nextInput = $('input[data-tabindex="' + (currentTabindex+1) + '"]');
            if ($nextInput.length) {
                this.$currentElement = $nextInput;
            }
            this.$currentElement.focus();
        }

        , show: function() {
            this.$keyboard.fadeIn().data('state', 'open');
            $('.show-keyboard').addClass('active');
            $('body').addClass('haskeyboard');
        }

        , hide: function() {
            this.$keyboard.fadeOut().data('state', 'closed');
            $('.show-keyboard').removeClass('active');
            $('body').addClass('haskeyboard');
        }

        , focus: function() {
            this.$currentElement.focus()
        }

        , toggle: function() {
            if (this.$keyboard.data('state') == 'open') {
                this.hide();
            } else {
                this.show();
            }
        }
    }

    window.Keyboard = Keyboard;
})(window, window.jQuery);
