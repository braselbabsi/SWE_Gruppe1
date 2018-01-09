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

const updateNachname = function(nachnameStr) {
    const {expect, click, clearValue} = this

    expect.element('@tabSchlagwoerter').to.be.visible
    expect.element('@tabStammdaten').to.be.visible

    expect.element('@nachname').to.be.visible
    clearValue('@nachname').setValue('@nachname', nachnameStr)
    expect.element('@updateStammdatenButton').to.be.visible
    return click('@updateStammdatenButton')
}

export default {
    url: 'https://localhost/details',

    elements: {
        tabStammdaten: {
            selector: 'a[href="#stammdaten"]',
        },
        tabInteressen: {
            selector: 'a[href="#interessen"]',
        },
        nachname: {
            selector: 'input[id=nachnameInput]',
        },
        updateStammdatenButton: {
            selector: 'hs-update-stammdaten button',
        },
    },

    commands: [
        {
            updateNachname,
        },
    ],
}
