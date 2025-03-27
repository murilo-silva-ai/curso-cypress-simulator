describe('Cypress simulator outputs', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('./src/index.html?skipCaptcha=true', {
      onBeforeLoad(win) {
        win.localStorage.setItem('cookieConsent', 'accepted')
      }
    })
  })

  context('it emulates cypress commands', () => {
    it('verify run button clickability', () => {
      cy.get('#codeInput').type('A')

      cy.get('#runButton').should('be.enabled')

      cy.get('#codeInput').clear()

      cy.get('#runButton').should('not.be.enabled')
    })

    it('Reset text area and code output on logout and login', () => {
      cy.run("cy.log(message)")
      cy.get('#outputArea', { timeout: 6000 })
        .should('contain.text', 'Success:')
        .and('contain.text', 'cy.log(message) // Logged message message')
      cy.get('#sandwich-menu').click()
      cy.get('#logoutButton').click()
      cy.contains('button', 'Login').click()

      cy.get('#codeInput').should('be.empty')
      cy.get('#outputArea').should('be.empty')
    })

    it('Disable run button on logout and login', () => {
      cy.get('#codeInput').type("cy.log(message)")
      cy.contains('button', 'Run').should('be.enabled')
      cy.get('#sandwich-menu').click()
      cy.get('#logoutButton').click()
      cy.contains('button', 'Login').click()

      cy.contains('button', 'Run').should('be.disabled')
    })

    it('No cookie banner on login page', () => {
      cy.clearAllLocalStorage()
      cy.reload()

      cy.contains('button', 'Login').should('be.visible')
      cy.get('#cookieConsent').should('not.be.visible')
    })
  })
})

describe('Cypress simulator - Cookies Consent', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('./src/index.html?skipCaptcha=true')
  })

  it('Decline cookies', () => {
    cy.get('#cookieConsent')
      .as('cookieConsentBanner')
      .find("button:contains('Decline')")
      .click()

    cy.get('@cookieConsentBanner').should('not.be.visible')
    cy.window()
      .its('localStorage.cookieConsent')
      .should('be.equal', 'declined')
  })
})