# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Документация к проекту

## Описание проекта

Проект является интернет-магазином и представляет собой веб-приложение, которое позволяет пользователям просматривать
каталог товаров, добавлять их в корзину, оформлять заказы и просматривать дополнительную информацию о товарах.

Приложение разработанно с использованием паттерна проектирования MVP (Model-View-Presenter)
Каждый слой определен входящими в него классами, которые описаны ниже. Слой презентера, в котором взаимодействие между
слоями происходит через событийную модель и прямые вызовы методов, позволяя каждому классу эффективно выполнять свою
функцию и реагировать на изменения в приложении, не выделен в отдельный класс и описан в основном скрипте приложения
index.ts

## Базовый код

### class Api

Базовый класс для работы с сервером

#### Конструктор

* `baseUrl: string` - url для запроса на сервер
* `options: RequestInit` - опции для настройки запроса на сервер

#### Методы

* `handleResponse(response: Response): Promise<object>` - обработка ответа сервера
* `get(uri: string)` - получение данных с сервера
* `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - отправка данных на сервер

### class EventEmitter

Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков
о наступлении события.

Класс имеет методы `on` ,  `off` ,  `emit`  — для подписки на событие, отписки от события и уведомления
подписчиков о наступлении события соответственно.
Дополнительно реализованы методы  `onAll` и  `offAll`  — для подписки на все события и сброса всех
подписчиков.

Метод  `trigger` , генерирует заданное событие с заданными
аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти
классы будут генерировать события, не будучи при этом напрямую зависимыми от
класса  `EventEmitter` .

### class Model

Абстрактный базовый класс, предназначенный для создания моделей данных. Модели используются для представления и
управления данными в приложении.

#### Конструктор класса:

* `data: Partial<T>` - данные модели
* `events: IEvents` - события

#### Метод класса:

* `emitChanges(event: string, payload?: object)` - сообщает всем, что модель изменилась

### class Component

Абстрактный базовый класс, являющий основной для создания пользовательского интерфейса.

#### Конструктор класса

* `container: HTMLElement` - DOM элемент для расположения дочерних элементов

#### Методы класса

* `toggleClass(element: HTMLElement, className: string, force?: boolean)` - добавить/удалить переданный класс
* `setText(element: HTMLElement, value: unknown)` - установить текст
* `setDisabled(element: HTMLElement, state: boolean)` - добавление/удаление класса 'disabled'
* `setHidden(element: HTMLElement)` - устанавливает св-во display: none;
* `setVisible(element: HTMLElement)` - удаляет св-во display
* `setImage(element: HTMLImageElement, src: string, alt?: string)` - уставливает изображение
* `render(data?: Partial<T>): HTMLElement` - возвращает корневой DOM-элемент

## Вспомогательные классы

### class LarekApi

Класс, расширяющий базовый класс Api, предназначенный для более удобного взаимодействия с действующий сервером.

#### Методы класса

* `getProductById(id: string): ProductItem` - получение одного продукта по Id
* `getAllProducts(): ProductItem[]` - получение всех продуктов
* `createOrder(order: IOrder): IOrder` - оформление заказа

## Компоненты модели данных

### class AppState

Класс, расширяющий базовый класс Model, храняющий в себе информацию о приложении и его состояния. Хранит в себе
значениях
всех основных элементов страницы (Корзины, галлереи, заказа), а также позволяет изменять их.

#### Поля класа

* `basket: ProductItem[]` - товары в корзине
* `catalog: ProductItem[]` - все товары
* `order: IOrder = {
  paymentMethod: TPaymentMethod,
  address: '',
  email: '',
  phone: '',
  items: []
  }` - состояние и значения заказа
* `total: number` - общая стоимость товаров
* `formErrors: FormErrors = {}` - ошибки при заполнении формы

#### Методы класса

* `setCatalog(items: ProductItem[])` - установка каталога продуктов
* `clearBasket` - очистка корзины
* `getTotalBasketPrice` - получение общей стоимости продуктов в корзине
* `getBasketItemsCount` - получение общего количества продуктов в корзине
* `setOrderFields(field: keyof IOrder, value: string)` - установка значений в поле формы заказа
* `validateOrderAddress` - проверяет внесены ли данные в форме с адрессом
* `validateOrderContacts` - проверяет внесены ли данные в форме с контактными данными
* `resetOrder` - очистка всей формы заказа
* `addToBasket(id: string)` - добавление продукта в корзину
* `removeFromBasket(id: string)` - удаление продукта из корзины

## Компоненты представления

Все представленные классы являются наследниками базового класса `Component<T>`, если не сказано обратного

### class Page

Компонент для отображения и изменения контента страницы.

#### Поля класа

* `counter: HTMLElement` - элемент со счетчиком продуктов в корзине
* `catalog: HTMLElement` - элемент католога товаров
* `wrapper: HTMLElement` - элемент контента главной страницы
* `basket: HTMLElement` - элемент значка корзины

#### Конструктор класса

* `container: HTMLElement` - элемент контента главной страницы
* `events: IEvents` - ссылка на менеджер событий

#### Методы класса

* `set сounter(value: number)` - установление значений счетчика продуктов в корзине
* `set catalog(items: HTMLElement[])` - установление каталога продуктов
* `set locked(value: boolean)` - блокировка\разблокировка страницы

### class Modal

Класс отвечает за работу с модальными окнами.

#### Поля класа

* `closeButton: HTMLButtonElement` - элемент с кнопкой закрытия модального окна
* `content: HTMLElement` - элемент с контентом модального окна

#### Конструктор класса

* `container: HTMLElement` - элемент контента главной страницы
* `events: IEvents` - ссылка на менеджер событий

#### Методы класса

* `open` - открытие модального окна
* `close` - закрытие модального окна
* `set content` - установка контента модального окна
* `render` - отображение модального окна

### class Form

Компонент формы

#### Поля класа

* `submit: HTMLButtonElement` - элемент кнопки для отправки\продолжения формы
* `errors: HTMLElement` - элемент для отображения ошибок валидации формы

#### Конструктор класса

* `container: HTMLFormElement` - элемент компонента формы
* `events: IEvents` - ссылка на менеджер событий

#### Методы класса

* `onInputChange` - отслеживание изменений полей формы
* `valid` - установка валидности формы
* `errors` - сообщает об ошибках
* `render` - отображение актуальной формы

### class OrderFormAddress

Класс, расширяющий стандартный компонент формы. Содержит состояния первой страницы оформления заказа

#### Поля класа

* `_buttons: HTMLButtonElement[]` - элемент кнопки оплаты картой


#### Конструктор класса

* `container: HTMLFormElement` - элемент компонента формы
* `events: IEvents` - ссылка на менеджер событий

### Методы класса 

*`setPayment(name: string)` - изменение способа оплаты

### class OrderFormContacts

Класс, расширяющий стандартный компонент формы, реализуя интерфейс `IOrderContacts`. Содержит состояния второй страницы оформления заказа

#### Конструктор класса

* `container: HTMLFormElement` - элемент компонента формы
* `events: IEvents` - ссылка на менеджер событий

### class ProductCard

Класс описывает компонент карточки товара, наследуется от базового класса Component.
Данный класс служит для отображения карточки и информации по ней в галлерии, модальномо окне, корзине

#### Поля класа

* `title: HTMLElement;` - элемент названия продукта
* `price: HTMLElement` - элемент блока с ценой продукта
* `description?: HTMLElement;` - элемент описания продукта
* `category?: HTMLElement` - элемент блока с категорией продукта
* `image?: HTMLImageElement;` - элемент изображения продукта
* `button?: HTMLButtonElement` - элемент кнопки, если он есть в разметке
* `basketIndex?: HTMLElement` - элемент индекса товара в корзине

 
#### Конструктор класса

* `blockName: string` - Название родительского селектора, для доступа к элементам (Пример: blockName = catalog =>
  catalog-button = {blockName}-button
* `container: HTMLElement` - контейнер для элемента
* `actions?: ICardActions` - Передача в класс необходимых коллбэков для обработки событий в карточке товара

### class Basket

Класс за работу с корзиной и отражает информацию по товарам в корзине.

#### Поля класа

* `productList: HTMLElement;` - элемент контейнера товаров в корзине
* `total: HTMLElement` - элемент общей стоимости заказа
* `submit: HTMLButtonElement` - элемент кнопки для подтверждения заказа

#### Конструктор класса

* `blockName: string` - Название родительского селектора, для доступа к элементам (Пример: blockName = catalog =>
  catalog-button = {blockName}-button
* `container: HTMLElement` - контейнер для элемента
* `actions?: IBasketActions` - Передача в класс необходимых коллбэков для обработки событий в корзине товаров

#### Методы класса

* `setItems(items: HTMLElemnt)` - установаление товаров в корзине
* `setTotal()` - установление общей стоимости корзины
* `toggleButton()` - установление доступности кнопки в корзине

## Основные типы данных и интерфейсы

``
interface ICardActions {
onClick: (event: MouseEvent) => void;
}
`` - интерфейс для коллбэков в карточке товара

``
interface IBasketActions {
onClick: (event: MouseEvent) => void;
}
`` - интрефейс для коллбэков в корзине

``interface IProductItem {
id: string;
description: string;
image: string;
title: string;
category: string;
price: number;
}`` - интерфейс для товаров. Требуется для отображения корректной информации с API

``type PaymentMethod = 'online' | 'offline'`` - Методы оплаты товара online - онлайн\ offline - при получении

``interface IOrderForm {
paymentMethod: PaymentMethod;
address: string;
mail: string;
phone: string;
}`` - интерфейс для хранения полной информации с формы заказа

``interface IOrder extends IOrderForm {
items: IProductItem[];
}`` - интрефейс, расширяющий IOrderForm, содержающий также массив товаро из корзины

``interface IOrderResult {
result: { id: string, total: number } | { error: string };
}`` - интерфейс для ответа сервера о совершении заказа

``type FormErrors = Partial<Record<keyof IOrder, string>>;`` - интерфейс для ошибок в форме

``interface IAppState {
catalog: IProductItem[];
basket: IProductItem[];
order: IOrder | null;
formErrors: FormErrors;
}`` - интрефейся для хранения всех основных элементов страницы