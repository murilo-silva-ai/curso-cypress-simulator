describe('Cypress simulator outputs', () => {
  beforeEach(() => {
    cy.visit('./src/index.html?skipCaptcha=true', {
      onBeforeLoad(win) {
        win.localStorage.setItem('cookieConsent', 'accepted')
      }
    })
    cy.contains('button', 'Login').click()
    cy.contains('h1', 'Cypress Simulator').should('be.visible')

  })

  context('it emulates cypress commands', () => {
    it.only('passes', () => {

    })

    it('error: invalid cypress command', () => {

    })

    it('error: valid command without parentheses', () => {

    })

    it('output: warning', () => {

    })

    it('help', () => {

    })
  })

  it('maximize/minimize output session', () => {

  })

  it('logout', () => {

  })

  it('show and hide logout button', () => {

  })

  it('button run must not be clickable if no command is passed', () => {

  })

  it('button run must be clickable when command is passed', () => {

  })

  it('Running... state', () => {

  })

  it('Accept cookies', () => {

  })

  it('Decline cookies', () => {

  })

  it('Captcha button states', () => {

  })

  it('Captcha error', () => {

  })

  it('Reset text area on logout and login', () => {

  })

  it('Disable run button on logout and login', () => {

  })

  it('Clear output on logout and login', () => {

  })

  it('No cookie banner on login page', () => {

  })

})