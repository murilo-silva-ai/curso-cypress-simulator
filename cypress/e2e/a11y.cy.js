describe('Cypress simulator outputs', () => {
    beforeEach(() => {
        cy.login()
        cy.visit('./src/index.html?skipCaptcha=true', {
            onBeforeLoad(win) {
                win.localStorage.setItem('cookieConsent', 'accepted')
            }
        })
        cy.injectAxe()
    })

    context('it emulates cypress commands', () => {
        it('passes successfully', () => {
            cy.run("cy.get('#body')")

            cy.get('#outputArea', { timeout: 6000 }).should('contain.text', "Success:\n\ncy.get('#body') // Got element by selector '#body'")
            cy.checkA11y(".success")
        })

        it('error: invalid cypress command', () => {
            cy.run("cy.escolaTaT('Hello cypress')")

            cy.get('#outputArea', { timeout: 6000 }).should('contain.text', "Error:\n\nInvalid Cypress command: cy.escolaTaT('Hello cypress')")
            cy.checkA11y(".error")
        })

        it('error: valid command without parentheses', () => {
            cy.run('cy.get')

            cy.get('#outputArea', { timeout: 6000 })
                .should('contain.text', 'Error:')
                .and('contain.text', 'Missing parentheses')
            cy.checkA11y(".error")
        })

        it('output: warning, command has not been implemented yet', () => {
            cy.run("cy.contains('button', 'Run')")

            cy.get('#outputArea', { timeout: 6000 })
                .should('contain.text', 'Warning:')
                .and('contain.text', 'command has not been implemented yet.')
            cy.checkA11y(".warning")
        })

        it('asks for help and gets common Cypress commands and examples with a link to the docs', () => {
            cy.run("help")

            cy.get('#outputArea', { timeout: 6000 })
                .should('contain.text', 'Common Cypress commands and examples:')
            cy.checkA11y("#outputArea")
            cy.contains('#outputArea a', 'official Cypress API documentation')
                .invoke('removeAttr', 'target')
                .click()

            cy.origin('https://docs.cypress.io', () => {
                cy.contains('h1', 'Table of Contents')
            })
        })

        it('Assert the "Running... state" process', () => {
            cy.run("cy.log('escolaTaT')")

            cy.get('#runButton').should('contain.text', 'Running...')
            cy.get('#outputArea').should('contain.text', 'Running... Please wait.')
            cy.checkA11y()

            cy.contains('button', 'Running...', { timeout: 6000 }).should('not.exist')
            cy.contains('#outputArea', 'Running... Please wait.', { timeout: 6000 }).should('not.exist')

            cy.get('#outputArea', { timeout: 6000 }).should('contain.text', "cy.log('escolaTaT') // Logged message 'escolaTaT'")
        })
    })

    it('maximize/minimize output session', () => {
        cy.run("cy.log('escolaTaT')")
        cy.get('.expand-collapse').click()
        cy.get('.expand-collapse')
            .invoke('attr', 'aria-expanded')
            .should('eq', 'true')

        cy.checkA11y() //aqui apresenta um erro

        cy.get('.expand-collapse').click()
        cy.get('.expand-collapse')
            .invoke('attr', 'aria-expanded')
            .should('eq', 'false')
    })

    it('user logs out successfully', () => {
        cy.get('button[aria-label="Open menu"]').click()
        cy.contains('button', 'Logout')
            .should('be.visible')
            .click()

        cy.contains('h2', "Let's get started!").should('be.visible')

        cy.checkA11y()
    })

    it('show and hide logout button', () => {
        cy.get('button[aria-label="Open menu"]').click()

        cy.contains('button', 'Logout').should('be.visible')
        cy.checkA11y()

        cy.get('button[aria-label="Open menu"]').click()

        cy.contains('button', 'Logout').should('not.be.visible')
    })
})

describe('Cypress simulator - Cookies Consent', () => {
    beforeEach(() => {
        cy.login()
        cy.visit('./src/index.html?skipCaptcha=true')
        cy.injectAxe()
    })

    it('Accept cookies', () => {
        cy.get('#cookieConsent')
            .as('cookieConsentBanner')
            .should('be.visible')

        cy.checkA11y()

        cy.get('@cookieConsentBanner')
            .find("button:contains('Accept')")
            .click()

        cy.get('@cookieConsentBanner').should('not.be.visible')
        cy.window()
            .its('localStorage.cookieConsent')
            .should('be.equal', 'accepted')
    })
})

describe('Cypress simulator - Captcha and Login', () => {
    beforeEach(() => {
        cy.visit('./src/index.html?skipCaptcha=false')
        cy.contains('button', 'Login').click()
        cy.injectAxe()
    })

    it('Finds no a11y issues on all capthcha view states (button enable/disabled and error)', () => {
        cy.contains('button', 'Verify').should('be.disabled')

        cy.get('#captchaInput').type('1234')

        cy.contains('button', 'Verify').should('be.enabled')
        cy.checkA11y()

        cy.contains('button', 'Verify').click()

        cy.contains('p', 'Incorrect answer, please try again.').should('be.visible')

        cy.get('#captchaInput').should('be.empty')
        cy.contains('button', 'Verify').should('be.disabled')

        cy.checkA11y()
    })
})