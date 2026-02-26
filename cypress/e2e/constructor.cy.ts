describe('Модальное окно ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '**/auth/user', { statusCode: 401 });

    cy.visit('/');
  });

  it('Открывается модалка ингредиента и отображает данные выбранного ингредиента', () => {
    cy.contains('Краторная булка N-200i').click();

    cy.get('[data-cy="modal"]').should('exist');
    cy.get('[data-cy="modal"]').should('contain', 'Краторная булка N-200i');
  });

  it('Закрывается по клику на крестик', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.get('[data-cy="modal"]').should('exist');

    cy.get('[data-cy="modal-close"]').find('svg').click();

    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('Закрывается по клику на оверлей', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.get('[data-cy="modal"]').should('exist');

    cy.get('[data-cy="modal-overlay"]').click({ force: true });

    cy.get('[data-cy="modal"]').should('not.exist');
  });
});

describe('Добавление ингредиентов в конструктор', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '**/auth/user', { statusCode: 401 });

    cy.visit('/');
  });

  it('Добавляет булку и начинку в конструктор', () => {
    // Проверяем пустое состояние
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');

    // Добавляем булку по кнопке
    cy.contains('li', 'Краторная булка N-200i').contains('Добавить').click();

    // Проверяем, что булка появилась сверху и снизу
    cy.contains('Краторная булка N-200i (верх)').should('exist');
    cy.contains('Краторная булка N-200i (низ)').should('exist');

    // Добавляем начинку
    cy.contains('li', 'Биокотлета из марсианской Магнолии')
      .contains('Добавить')
      .click();

    // Проверяем, что начинка появилась в списке конструктора
    cy.contains('Биокотлета из марсианской Магнолии').should('exist');

    // Сообщение "Выберите начинку" должно исчезнуть
    cy.contains('Выберите начинку').should('not.exist');
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.setCookie('accessToken', 'Bearer test-access-token');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.visit('/');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
  });

  it('Оформляет заказ и очищает конструктор', () => {
    // добавляем ингредиенты
    cy.contains('li', 'Краторная булка N-200i').contains('Добавить').click();
    cy.contains('li', 'Биокотлета из марсианской Магнолии')
      .contains('Добавить')
      .click();

    // проверка, что выбранные ингредиенты отображаются в конструкторе
    cy.contains('Краторная булка N-200i (верх)').should('exist');
    cy.contains('Краторная булка N-200i (низ)').should('exist');
    cy.contains('Биокотлета из марсианской Магнолии').should('exist');

    // оформляем заказ
    cy.contains('Оформить заказ').click();

    cy.wait('@createOrder');

    // проверяем номер заказа
    cy.get('[data-cy="modal"]').should('exist');
    cy.contains('101912').should('exist');

    // закрываем модалку
    cy.get('[data-cy="modal-close"]').find('svg').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    // закрываем модалку через ESC
    cy.get('body').type('{esc}');
    cy.contains('идентификатор заказа').should('not.exist');

    // конструктор пуст
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});
