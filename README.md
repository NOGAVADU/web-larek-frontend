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
- src/styles/styles.scss — корневой файл стилей
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

## Документация к проекту

Ключевые типы данных:

```
export interface IItemCard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export type PaymentMethod = 'online' | 'offline'

export interface IOrderForm {
	paymentMethod: PaymentMethod;
	address: string;
	mail: string;
	phone: string;
}

export interface IOrder extends IOrderForm {
	info: string[];
	items: IItemCard[];
}

export interface IOrderResult {
	result: { id: string, total: number } | { error: string };
}

export interface IAppState {
	catalog: IItemCard[];
	basket: IItemCard[];
	order: IOrder | null;
	loading: boolean;
}
```
