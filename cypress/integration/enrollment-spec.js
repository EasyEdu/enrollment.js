describe('enroll function', () => {
  beforeEach(() => {
    cy.visit('enrollment-test.html')
  })

  it('is defined in the window object', () => {
    cy.window().then((win) => {
      expect(win.easyEdu.enroll).to.exist
      expect(typeof win.easyEdu.enroll).to.eq('function')
    })
  })

  context('when does not receive authKey', () => {
    it('throws an exception', () => {
      let errorMessage = "Auth key for EasyEdu class is missing, please pass it as first argument, it must be a string."

      cy.window().then((win) => {
        expect(() => { win.easyEdu.enroll() }).to.throw(errorMessage)
        expect(() => { win.easyEdu.enroll({}) }).to.throw(errorMessage)
      })
    })
  })

  context('when does not receive params object', () => {
    it('throws an exception', () => {
      let errorMessage = "Params object is missing, please pass it as second argument, it must be an object."

      cy.window().then((win) => {
        expect(() => { win.easyEdu.enroll('a') }).to.throw(errorMessage)
        expect(() => { win.easyEdu.enroll('a', () => {}) }).to.throw(errorMessage)
      })
    })
  })

  context('when arguments are ok', () => {
    let auth_token = '12345678'
    let email = 'user@ieducativa.com.br'
    let full_name = 'Crazy User'

    let errorResponse = ['Bad request']
    let response = {
      id: 20, 
      user: { id: 2 },
      klass: { id: 2 }
    }

    const subject = (sucessCallback, errorCallback) => {
      cy.window().then((win) => {
        win.easyEdu.enroll(auth_token, { email: email, full_name: full_name }, sucessCallback, errorCallback)
      })
    }

    it ('a request is made', () => {
      cy.server()
      cy.route({
        method: 'POST',
        url: '/classes/enroll',
        status: 200,
        response: response
      }).as('enroll')

      subject()

      cy.wait('@enroll').then((xhr) => {
        expect(xhr.request.body.auth_token).to.eq(auth_token)
        expect(xhr.request.body.email).to.eq(email)
        expect(xhr.request.body.full_name).to.eq(full_name)
      })
    })

    context('when response is positive', () => {
      it('calls sucessCallback with response data', () => {
        cy.server()
        cy.route({
          method: 'POST',
          url: '/classes/enroll',
          status: 200,
          response: response
        }).as('enroll')

        const sucessCallback = cy.spy()
        const errorCallback = cy.spy()
  
        subject(sucessCallback, errorCallback)

        cy.wait('@enroll').then((xhr) => {
          expect(sucessCallback.withArgs(response)).to.be.called
          expect(errorCallback).to.not.be.called
        })
      })
    })

    context('when response is negative', () => {
      it('calls errorCallback with response data', () => {
        cy.server()
        cy.route({
          method: 'POST',
          url: '/classes/enroll',
          status: 400,
          response: errorResponse
        }).as('enroll')

        const sucessCallback = cy.spy()
        const errorCallback = cy.spy()
  
        subject(sucessCallback, errorCallback)

        cy.wait('@enroll').then((xhr) => {
          expect(sucessCallback).to.not.be.called
          expect(errorCallback).to.be.called
        })
      })
    })
  })
})