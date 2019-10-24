describe('enroll function', () => {
  beforeEach(() => {
    cy.visit('enrollment-test.html');
  });

  it('is defined in the window object', () => {
    cy.window().then((win) => {
      expect(win.easyedu.enroll).to.exist;
      expect(typeof win.easyedu.enroll).to.eq('function');
    });
  });


  context('authKey param', () => {
    context('when does not receive authKey', () => {
      it('throws an exception', () => {
        cy.window().then((win) => {
          expect(() => { win.easyedu.enroll(); }).to.throw("authKey param is missing.");
        });
      });
    });

    context('when receive a not string authKey', () => {
      it('throws an exception', () => {
        cy.window().then((win) => {
          expect(() => { win.easyedu.enroll({}); }).to.throw("authKey must be a string.");
        });
      });
    });
  });

  context('params param', () => {
    context('when does not receive params', () => {
      it('throws an exception', () => {
        cy.window().then((win) => {
          expect(() => { win.easyedu.enroll('a'); }).to.throw("params param is missing.");
        });
      });
    });

    context('when receive a not string authKey', () => {
      it('throws an exception', () => {
        cy.window().then((win) => {
          expect(() => { win.easyedu.enroll('a', 1); }).to.throw("params must be a object.");
        });
      });
    });
  });

  context('when arguments are ok', () => {
    let auth_token = '12345678';
    let email = 'user@ieducativa.com.br';
    let full_name = 'Crazy User';

    let errorResponse = ['Bad request'];
    let response = {
      id: 20, 
      user: { id: 2 },
      klass: { id: 2 }
    };

    const subject = (sucessCallback, errorCallback) => {
      cy.window().then((win) => {
        win.easyedu.enroll(auth_token, { email: email, full_name: full_name }, sucessCallback, errorCallback);
      });
    };

    it ('a request is made', () => {
      cy.server();
      cy.route({
        method: 'POST',
        url: '/classes/enroll',
        status: 200,
        response: response
      }).as('enroll');

      subject();

      cy.wait('@enroll').then((xhr) => {
        expect(xhr.request.body.auth_token).to.eq(auth_token);
        expect(xhr.request.body.email).to.eq(email);
        expect(xhr.request.body.full_name).to.eq(full_name);
      });
    });

    context('when response is positive', () => {
      it('calls sucessCallback with response data', () => {
        cy.server();
        cy.route({
          method: 'POST',
          url: '/classes/enroll',
          status: 200,
          response: response
        }).as('enroll');

        const sucessCallback = cy.spy();
        const errorCallback = cy.spy();
  
        subject(sucessCallback, errorCallback);

        cy.wait('@enroll').then((xhr) => {
          expect(sucessCallback.withArgs(response)).to.be.calledWith(response);
          expect(errorCallback).to.not.be.called;
        });
      });
    });

    context('when response is negative', () => {
      it('calls errorCallback with response data', () => {
        cy.server();
        cy.route({
          method: 'POST',
          url: '/classes/enroll',
          status: 400,
          response: errorResponse
        }).as('enroll');

        const sucessCallback = cy.spy();
        const errorCallback = cy.spy();
  
        subject(sucessCallback, errorCallback);

        cy.wait('@enroll').then((xhr) => {
          expect(sucessCallback).to.not.be.called;
          expect(errorCallback).to.be.calledWith(['Bad request']);
        });
      });
    });

    context('when response is negative with no body', () => {
      it('calls errorCallback with null as response data', () => {
        cy.server();
        cy.route({
          method: 'POST',
          url: '/classes/enroll',
          status: 400,
          response: ''
        }).as('enroll');

        const sucessCallback = cy.spy();
        const errorCallback = cy.spy();

        subject(sucessCallback, errorCallback);

        cy.wait('@enroll').then((xhr) => {
          expect(sucessCallback).to.not.be.called;
          expect(errorCallback).to.be.calledWith('');
        });
      });
    });
  });
});

describe('enroll form', () => {
  let response = {
    id: 20,
    user: { id: 2 },
    klass: { id: 2 }
  };

  beforeEach(() => {
    cy.visit('enrollment-test.html');

    cy.server();
    cy.route({
      method: 'POST',
      url: '/classes/enroll',
      status: 200,
      response: response
    }).as('enroll');
  });

  context('when all inputs are filled', () => {
    it('enrolls the student', () => {
      const stub = cy.stub();

      cy.on('window:alert', stub);

      cy.get('input[name=full_name]').type('Finn Mertens');
      cy.get('input[name=email]').type('finn-the-human@ieducativa.com.br');
      cy.get('input[type=submit]').click();

      cy.wait('@enroll').then((xhr) => {
        expect(stub.getCall(0)).to.be.calledWith('Congrats! you are now enrolled on this course! Please check the access information, on your email.');
      });
    });
  });
});