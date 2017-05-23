Плагин для открытия/закрытия уведомлений. Запоминает на какое кол-во времени не выводить уведомление повторно.

```
<div class="alert" data-alertron>
  <div class="container">
    <div class="alert-text">
      Выгодное предложение
    </div>
    <button type="button" class="alert-close" data-alertron-close>
      Закрыть
    </button>
  </div>
</div>
```

```js
var myAlert = new Alertron({
  expires: 2
});
```
