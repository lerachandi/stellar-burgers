describe('Страница конструктора', () => {
  const baseUrl = '/';

  const endpoints = {
    ingredients: '**/ingredients',
    authUser: '**/auth/user',
    orders: '**/orders'
  };

  const selectors = {
    body: 'body',
    modal: '[data-cy="modal"]',
    modalClose: '[data-cy="modal-close"]',
    modalOverlay: '[data-cy="modal-overlay"]'
  };

  const texts = {
    bunEmpty: 'Выберите булки',
    mainEmpty: 'Выберите начинку',
    orderButton: 'Оформить заказ',
    orderIdText: 'идентификатор заказа',
    addButton: 'Добавить'
  };

  const ingredients = {
    bun: 'Краторная булка N-200i',
    main: 'Биокотлета из марсианской Магнолии'
  };

  const order = {
    number: '101912'
  };

  const openIngredientModal = (name: string) => {
    cy.contains(name).click();
    cy.get(selectors.modal).should('exist');
  };

  const closeModalByCross = () => {
    cy.get(selectors.modalClose).click();
    cy.get(selectors.modal).should('not.exist');
  };

  const closeModalByOverlay = () => {
    cy.get(selectors.modalOverlay).click({ force: true });
    cy.get(selectors.modal).should('not.exist');
  };

  const addIngredientToConstructor = (name: string) => {
    cy.contains('li', name).contains(texts.addButton).click();
  };

  describe('Модальное окно ингредиента', () => {
    beforeEach(() => {
      cy.intercept('GET', endpoints.ingredients, {
        fixture: 'ingredients.json'
      });
      cy.intercept('GET', endpoints.authUser, { statusCode: 401 });

      cy.visit(baseUrl);
    });

    it('открывается и показывает данные выбранного ингредиента', () => {
      openIngredientModal(ingredients.bun);
      cy.get(selectors.modal).should('contain', ingredients.bun);
    });

    it('закрывается по клику на крестик', () => {
      openIngredientModal(ingredients.bun);
      closeModalByCross();
    });

    it('закрывается по клику на оверлей', () => {
      openIngredientModal(ingredients.bun);
      closeModalByOverlay();
    });
  });

  describe('Добавление ингредиентов в конструктор', () => {
    beforeEach(() => {
      cy.intercept('GET', endpoints.ingredients, {
        fixture: 'ingredients.json'
      });
      cy.intercept('GET', endpoints.authUser, { statusCode: 401 });

      cy.visit(baseUrl);
    });

    it('добавляет булку и начинку в конструктор', () => {
      cy.contains(texts.bunEmpty).should('exist');
      cy.contains(texts.mainEmpty).should('exist');

      addIngredientToConstructor(ingredients.bun);

      cy.contains(`${ingredients.bun} (верх)`).should('exist');
      cy.contains(`${ingredients.bun} (низ)`).should('exist');

      addIngredientToConstructor(ingredients.main);

      cy.contains(ingredients.main).should('exist');
      cy.contains(texts.mainEmpty).should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'Bearer test-access-token');
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      });

      cy.intercept('GET', endpoints.ingredients, {
        fixture: 'ingredients.json'
      });
      cy.intercept('GET', endpoints.authUser, { fixture: 'user.json' });
      cy.intercept('POST', endpoints.orders, { fixture: 'order.json' }).as(
        'createOrder'
      );

      cy.visit(baseUrl);
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
      });
    });

    it('оформляет заказ и очищает конструктор', () => {
      addIngredientToConstructor(ingredients.bun);
      addIngredientToConstructor(ingredients.main);

      cy.contains(`${ingredients.bun} (верх)`).should('exist');
      cy.contains(`${ingredients.bun} (низ)`).should('exist');
      cy.contains(ingredients.main).should('exist');

      cy.contains(texts.orderButton).click();
      cy.wait('@createOrder');

      cy.get(selectors.modal).should('exist');
      cy.contains(order.number).should('exist');

      closeModalByCross();

      cy.contains(texts.bunEmpty).should('exist');
      cy.contains(texts.mainEmpty).should('exist');
    });

    it('закрывает модалку заказа по ESC', () => {
      addIngredientToConstructor(ingredients.bun);
      addIngredientToConstructor(ingredients.main);

      cy.contains(texts.orderButton).click();
      cy.wait('@createOrder');

      cy.get(selectors.modal).should('exist');

      cy.get(selectors.body).type('{esc}');
      cy.contains(texts.orderIdText).should('not.exist');
    });
  });
});
