/*
 * Copyright (C) 2017 Juergen Zimmermann
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// jshint expr:true

import * as _ from 'lodash'

const checkInit = function() {
    const {expect} = this
    expect.element('@nachname').to.be.visible
    return this
}

const nachname = function(nachnameStr) {
    this.expect.element('@nachname').to.be.visible
    return this.clearValue('@nachname').setValue('@nachname', nachnameStr)
}
const weiblich = function() {
    const {expect} = this
    expect.element('@geschlecht').to.be.visible
    this.click('@geschlecht')
    expect.element('@weiblich').to.be.visible
    return this.click('@weiblich')
}
const männlich = function() {
    const {expect} = this
    expect.element('@geschlecht').to.be.visible
    this.click('@geschlecht')
    expect.element('@männlich').to.be.visible
    return this.click('@männlich')
}
const sport = function() {
    this.expect.element('@sport').to.be.visible
    return this.click('@sport')
}
const lesen = function() {
    this.expect.element('@lesen').to.be.visible
    return this.click('@lesen')
}
const reisen = function() {
    this.expect.element('@reisen').to.be.visible
    return this.click('@reisen')
}
const submit = function() {
    this.expect.element('@button').to.be.visible
    return this.click('@button')
}
const checkAlleKunden = function() {
    this.expect.element('@gefundeneKundenHeader').to.be.visible
    return this
}

const checkGefundeneKunden = function(nachnameSubstr) {
    this.expect.element('@gefundeneKundenHeader').to.be.visible

    const {api} = this.client

    // Nachname in der 1. Zeile ueberpruefen
    const selectorNachnameZeile1 = 'hs-suchergebnis tbody tr:nth-child(1) ' +
                                'td:nth-child(3)'
    api.expect.element(selectorNachnameZeile1).text.to.contain(nachnameSubstr)

    // von allen "n"" Zeilen die Spalte "3" mit dem Nachname ermitteln:
    // Formel fuer nth-child():   a*n + b
    const selectorSpalte = 'hs-suchergebnis table tbody tr:nth-child(n) ' +
                           'td:nth-child(3)'

    // Callback zum Ueberpruefen des Nachnames in den Datenzellen der Spalte
    const checkNachname = zellen => {
        _.times(zellen.value.length, i => {
            /* eslint no-magic-numbers: 0, space-infix-ops: 0 */
            const selectorZelle = 'hs-suchergebnis tbody ' +
                                  `tr:nth-child(${i+1}) td:nth-child(3)`
            api.expect.element(selectorZelle).text.to.contain(nachnameSubstr)
        })
    }

    api.elements('css selector', selectorSpalte, checkNachname)

    this.expect.element('@fehlermeldung').to.be.not.present

    return this
}

const clickNachnameErsteZeile = function() {
    this.expect.element('@nachnameErsteZeile').to.be.visible
    this.click('@nachnameErsteZeile')
}

const checkFehlermeldung = function() {
    const {expect} = this
    expect.element('@fehlermeldung').to.be.visible
    expect.element('@gefundeneKundenHeader').to.be.not.present
    return this
}

const deleteErsteZeile = function() {
    this.expect.element('@deleteIconErsteZeile').to.be.visible
    return this.click('@deleteIconErsteZeile')
}

export default {
    url: 'https://localhost/suche',

    elements: {
        nachname: {
            selector: 'input[id=nachnameInput]',
        },
        geschlecht: {
            selector: 'select[name=geschlecht]',
        },
        weiblich: {
            selector: 'input[value=WEIBLICH]',
        },
        männlich: {
            selector: 'input[value=MÄNNLICH]',
        },
        sport: {
            selector: 'input[name=sport]',
        },
        lesen: {
            selector: 'input[name=lesen]',
        },
        reisen: {
            selector: 'input[name=reisen]',
        },
        button: {
            selector: 'button i[class="fa fa-search"]',
        },
        gefundeneKundenHeader: {
            selector: 'div[class=card-header]',
        },
        fehlermeldung: {
            selector: 'div[class=text-danger] ' +
                      'i[class="fa fa-exclamation-circle"]',
        },
        nachnameErsteZeile: {
            selector: 'hs-suchergebnis ' +
                      'tbody tr:nth-child(1) td:nth-child(3)',
        },
        deleteIconErsteZeile: {
            selector: 'hs-suchergebnis ' +
                      'tbody tr:nth-child(1) td i[class="fa fa-remove"]',
        },
    },

    commands: [
        {
            checkInit,
            nachname,
            weiblich,
            männlich,
            sport,
            lesen,
            reisen,
            submit,
            checkAlleKunden,
            checkGefundeneKunden,
            checkFehlermeldung,
            clickNachnameErsteZeile,
            deleteErsteZeile,
        },
    ],
}
