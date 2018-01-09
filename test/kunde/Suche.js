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

import {PAUSE} from '../shared/constants'

export default {
    '@tags': ['Kunden', 'suche'],

    after() {
        this.client.end()
    },

    afterEach(done) {
        this.client.pause(PAUSE)
        done()
    },

    'Suche alle Kunden'() {
        // Given
        this.client.page
            .suchePage()
            .navigate()

            // When
            .checkInit()
            .submit()

            // Then
            .checkAlleKunden()
    },

    'Suche Kunden mit "a" im Nachname'() {
        // Given
        const nachname = 'a'
        this.client.page
            .suchePage()
            .navigate()

            // When
            .checkInit()
            .nachname(nachname)
            .submit()

            // Then
            .checkGefundeneKunden(nachname)
    },

    'Suche mit Fehlermeldung'() {
        // Given
        const nachname = 'XXX'

        // When
        this.client.page
            .suchePage()
            .navigate()
            .nachname(nachname)
            .submit()

            // Then
            .checkFehlermeldung()
    },
}
