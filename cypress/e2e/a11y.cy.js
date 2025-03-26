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
        it('passes successfully', () => {
            cy.get('#codeInput').type("cy.get('#body')")
            cy.get('#runButton').click()

            cy.get('#outputArea', { timeout: 6000 }).should('contain.text', "Success:\n\ncy.get('#body') // Got element by selector '#body'")
        })

        it('error: invalid cypress command', () => {
            cy.get('#codeInput').type("cy.escolaTaT('Hello cypress')")
            cy.get('#runButton').click()

            cy.get('#outputArea', { timeout: 6000 }).should('contain.text', "Error:\n\nInvalid Cypress command: cy.escolaTaT('Hello cypress')")
        })

        it('error: valid command without parentheses', () => {
            cy.get('#codeInput').type('cy.get')
            cy.get('#runButton').click()

            cy.get('#outputArea', { timeout: 6000 })
                .should('contain.text', 'Error:')
                .and('contain.text', 'Missing parentheses')
        })

        it('output: warning, command has not been implemented yet', () => {
            cy.get('#codeInput').type("cy.contains('button', 'Run')")
            cy.get('#runButton').click()

            cy.get('#outputArea', { timeout: 6000 })
                .should('contain.text', 'Warning:')
                .and('contain.text', 'command has not been implemented yet.')
        })

        it('asks for help and gets common Cypress commands and examples with a link to the docs', () => {
            cy.get('#codeInput').type("help")
            cy.get('#runButton').click()

            cy.get('#outputArea', { timeout: 6000 })
                .should('contain.text', 'Common Cypress commands and examples:')
            cy.contains('#outputArea a', 'official Cypress API documentation')
                .invoke('removeAttr', 'target')
                .click()

            cy.origin('https://docs.cypress.io', () => {
                cy.contains('h1', 'Table of Contents')
            })
        })

        it('Assert the "Running... state" process', () => {
            cy.get('#codeInput').type("cy.log('escolaTaT')")
            cy.get('#runButton').click()

            cy.get('#runButton').should('contain.text', 'Running...')
            cy.get('#outputArea').should('contain.text', 'Running... Please wait.')

            cy.contains('button', 'Running...', { timeout: 6000 }).should('not.exist')
            cy.contains('#outputArea', 'Running... Please wait.', { timeout: 6000 }).should('not.exist')

            cy.get('#outputArea', { timeout: 6000 }).should('contain.text', "cy.log('escolaTaT') // Logged message 'escolaTaT'")
        })
    })

    it('maximize/minimize output session', () => {
        cy.get('#codeInput').type("cy.log('escolaTaT')")
        cy.get('#runButton').click()
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
    })

    it('show and hide logout button', () => {
        cy.get('button[aria-label="Open menu"]').click()

        cy.contains('button', 'Logout').should('be.visible')

        cy.get('button[aria-label="Open menu"]').click()

        cy.contains('button', 'Logout').should('not.be.visible')
    })
})

describe('Cypress simulator - Cookies Consent', () => {
    beforeEach(() => {
        cy.visit('./src/index.html?skipCaptcha=true')
        cy.contains('button', 'Login').click()
        cy.contains('h1', 'Cypress Simulator').should('be.visible')
    })

    it('Accept cookies', () => {
        cy.get('#cookieConsent')
            .as('cookieConsentBanner')
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
    })
    it('Captcha button states', () => {
        cy.contains('button', 'Verify').should('be.disabled')

        cy.get('#captchaInput').type('123')

        cy.contains('button', 'Verify').should('not.be.disabled')

        cy.get('#captchaInput').clear()

        cy.contains('button', 'Verify').should('be.disabled')
    })

    it('Captcha error', () => {
        cy.get('#captchaInput').type('-123')
        cy.contains('button', 'Verify').click()

        cy.contains('p', 'Incorrect answer, please try again.').should('be.visible')
        cy.get('#captchaInput').should('be.empty')
        cy.contains('button', 'Verify').should('be.disabled')
    })
})