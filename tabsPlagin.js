//для инициализации плагина можно использовать следующие настройки:
//elementTitle, elementContent для передачи классов контента и кнопок табов или страниц;
//nextButton, prevButton для передачи классов элементов навигации, если они есть;
//animation - анимация. По умолчанию без анимации;
//Виды анимации: opacityAnimation - анимация с прозрачностью, 
//slideAnimation - анимация с разворачиванием.

;(function ( $, window, document, undefined ) {

  var pluginName = 'tabsPlagin',
    defaults = {
    
      elementTitle:".tab-title",
      elementContent:".tab",
      nextButton:"undefined",
      prevButton:"undefined",
      animation:"withoutAnimation"
    
    };

  function Plugin( element, options ) {
    this.element = element;
    this.options = $.extend( {}, defaults, options) ;
    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  Plugin.prototype.init = function () {
    
    var currentAnimation = this.options.animation;
	
    var element = $(this.element);
    var content = $(this.options.elementContent);
	  var title = $(this.options.elementTitle);
    var prevButton = $(this.options.prevButton);
	  var nextButton = $(this.options.nextButton);
    var titleSiblings = title.parent().siblings().children();
    var titles = title.parent().children();

    //проверка на наличие элементов навигации (стрелок)
    if(this.options.nextButton==="undefined"
      &&this.options.prevButton==="undefined") {
      //обработчик табов или кнопок страниц без дополнительной навигации
      element.on('click', this.options.elementTitle, function() {

        $(this).addClass('active').siblings().removeClass('active');
        content.hide();
        startAnimation(content.eq($(this).index()));

      }) 

    }else {
      //обработчик табов или кнопок страниц с дополнительной навигацией
      element.on('click', this.options.elementTitle, function() {
      
  	    var elementWithoutArrows = $(this).not(prevButton).not(nextButton);
        elementWithoutArrows.addClass('active').siblings().removeClass('active');
        content.hide();
        startAnimation(content.eq($(this).index()-1));

      })
    }   
    //обработчики кнопок навигации (вперед/назад)
    element.on('click', this.options.prevButton, function() {
      
      var activeTitle = title.parent().find('.active');
      var lastTitle = title.parent().children().last().index()-1;

      if(activeTitle.index()>1){
        activeTitle.removeClass('active').prev().addClass('active');
        titleSiblings.hide();
        startAnimation(titleSiblings.eq(title.parent().find('.active').index()-1));
      }
      else{
        titles.removeClass('active').eq(lastTitle).addClass('active');
        titleSiblings.hide();
        startAnimation(titleSiblings.eq(title.parent().siblings().last().index()-1))
      }
    });
	  
    element.on('click', this.options.nextButton, function() {	

      var activeTitle = title.parent().find('.active');
      var lastTitle = title.parent().children().last().index()-1;
      var firstTitle = title.parent().children().first().index()+1;

      if(activeTitle.index()<lastTitle){
		    activeTitle.removeClass('active').next().addClass('active');
		    titleSiblings.hide();
        startAnimation(titleSiblings.eq(title.parent().find('.active').index()-1));
      }
      else{
		    titles.removeClass('active').eq(firstTitle).addClass('active');
		    titleSiblings.hide();
        startAnimation(titleSiblings.eq(title.parent().siblings().first().index()));
      }
    });
    //анимация
  	function startAnimation(element){
      if(currentAnimation==="withoutAnimation"){
        element.show();
      }
      if(currentAnimation==="opacityAnimation"){
        element.show().css({'opacity':'0'}).animate({opacity: 1}, 2000);
      }
      if(currentAnimation==="slideAnimation"){
        element.slideDown('slow');
      }
    }
  };
	
  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName,
          new Plugin( this, options ));
      }
    });
  }

})( jQuery, window, document );