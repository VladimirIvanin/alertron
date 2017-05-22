/**
 * Панель уведомления
 *
 *
 * Зависимости:
 * jQuery
 * https://github.com/carhartl/jquery-cookie
 *
 * Параметры:
 * debug - выводит уведомления о процессах
 *
   Пример вызова:
   var myAlert = new Alertron({
     expires: 2,
     debug: true
  })
 *
*/
var Alertron = function (options) {
  var self = this;

  self.state = {
    status: 'close',
    cookie: null
  }

  var DEFAULT_OPTIONS = {
    debug: false,
    selectors: {
      panel: '[data-alertron]', // селектор панели
      close: '[data-alertron-close]', // селектор кнопки закрытия (должен быть внутри панели)
    },
    stateClasses: {
      open: 'is-open',
      close: 'is-close'
    },
    cookieName: 'alertron', // имя cookie
    useJqueySlide: true, // использовать slideUp/slideDown?
    expires: 2, // кол-во дней
    onOpened: function () {}, // колбек открытия
    onClosed: function () {}, // колбек закрытия
  }

  self.option = $.extend(DEFAULT_OPTIONS, options);

  self.setLog('Настройки плагина', self.option);

  self.init();
}

/**
 * Инициализация
 */
Alertron.prototype.init = function () {
  var self = this;

  if (typeof $.cookie == "undefined") {
    console.warn('Не подключен плагин $.cookie!');
  }else{
    // получить куки
    self.state.cookie = self.getCookie();

    if (self.state.cookie) {
      self.onClosing(function () {
        self.setLog('Закрыто');
        self.option.onClosed();
        self.setCoockie();
      });
    }else{
      self.onOpening(function () {
        self.setLog('Открыто');
        self.option.onOpened();
      })
    }

    self.binding()
  }
};

// биндинг
Alertron.prototype.binding = function () {
  var self = this;

  self.setLog('binding');

  $(document).on('click', self.option.selectors.close, function(event) {
    event.preventDefault();
    self.onClosing(function () {
      self.setLog('Закрыто');
      self.setCoockie();
      self.option.onClosed();
    });
  });
}

// Закрыть
Alertron.prototype.onClosing = function (onClosed) {
  var self = this;

  var $panel = $(self.option.selectors.panel);

  $panel.addClass( self.option.stateClasses.close )

  if (self.option.useJqueySlide) {
    $panel.slideUp()
  }

  onClosed()
}

// Открыть
Alertron.prototype.onOpening = function (onOpened) {
  var self = this;
  var $panel = $(self.option.selectors.panel);

  $panel.addClass( self.option.stateClasses.open )

  if (self.option.useJqueySlide) {
    $panel.slideDown()
  }

  onOpened()
}

// получить куки
Alertron.prototype.getCookie = function () {
  var self = this;
  var cookieValue = $.cookie( self.option.cookieName );

  self.setLog('Куки: ', cookieValue);
  return cookieValue;
}

// Установить куку
Alertron.prototype.setCoockie = function () {
  var self = this;
  $.cookie( self.option.cookieName, true, {
    path: '/',
    expires: self.option.expires
  });
  self.state.cookie = true;
  self.setLog('Установлены куки: ', self.option.cookieName);
};

// Дебагер
Alertron.prototype.setLog = function (_name, _variable) {
  var self = this;
  if (self.option.debug) {
    console.info('==Alertron==');
    console.log(_name);
    if (_variable) {
      console.log(_variable);
    }
    console.log('/////////////////');
    console.log('///Alertron/////');
    console.log('///////////////');
  }
};
