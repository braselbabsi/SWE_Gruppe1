/*
 * Copyright (C) 2015 - 2017 Juergen Zimmermann, Hochschule Karlsruhe
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

import {Component, Input, OnInit} from '@angular/core'
import {FormBuilder, FormControl, FormGroup} from '@angular/forms'
import {Router} from '@angular/router'

import {HOME_PATH} from '../../app/routes'
import {log} from '../../shared'
import {Kunde} from '../shared'
import {KundeService} from '../shared/kunde.service'

/**
 * Komponente f&uuml;r das Tag <code>hs-schlagwoerter</code>
 */
@Component({
    selector: 'hs-update-schlagwoerter',
    templateUrl: './update-schlagwoerter.html',
})
export default class UpdateSchlagwoerterComponent implements OnInit {
    // <hs-schlagwoerter [kunde]="...">
    @Input() kunde: Kunde

    form: FormGroup
    geschaeftskunde: FormControl
    privatkunde: FormControl

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly kundeService: KundeService,
        private readonly router: Router) {
        console.log('UpdateSchlagwoerterComponent.constructor()')
    }

    /**
     * Das Formular als Gruppe von Controls initialisieren und mit den
     * Schlagwoertern des zu &auml;ndernden Buchs vorbelegen.
     */
    @log
    ngOnInit() {
        console.log('kunde=', this.kunde)

        // Definition und Vorbelegung der Eingabedaten (hier: Checkbox)
        const hasGeschaeftskunde = this.kunde.hasSchlagwort('GESCHAEFTSKUNDE')
        this.geschaeftskunde = new FormControl(hasGeschaeftskunde)
        const hasPrivatkunde = this.kunde.hasSchlagwort('PRIVATKUNDE')
        this.privatkunde = new FormControl(hasPrivatkunde)

        this.form = this.formBuilder.group({
            // siehe ngFormControl innerhalb von @Component({template: `...`})
            geschaeftskunde: this.geschaeftskunde,
            privatkunde: this.privatkunde,
        })
    }

    /**
     * Die aktuellen Schlagwoerter f&uuml;r das angezeigte Kunde-Objekt
     * zur&uuml;ckschreiben.
     * @return false, um das durch den Button-Klick ausgel&ouml;ste Ereignis
     *         zu konsumieren.
     */
    @log
    onUpdate() {
        if (this.form.pristine) {
            console.log('keine Aenderungen')
            return
        }

        if (this.kunde === undefined) {
            console.error('kunde === undefined')
            return
        }

        this.kunde.updateSchlagwoerter(
            this.geschaeftskunde.value, this.privatkunde.value)
        console.log('kunde=', this.kunde)

        const successFn = () => {
            console.log(
                `UpdateSchlagwoerterComponent: successFn: path: ${HOME_PATH}`)
            this.router.navigate([HOME_PATH])
        }
        const errFn: (status: number,
                      errors: {[s: string]: any}|undefined) => void =
            (status, errors = undefined) => {
            console.error(`UpdateSchlagwoerterComponent.onUpdate(): errFn(): status: ${status}`)
            console.error('UpdateSchlagwoerterComponent.onUpdate(): errFn(): errors', errors)
        }
        this.kundeService.update(this.kunde, successFn, errFn)

        // damit das (Submit-) Ereignis konsumiert wird und nicht an
        // uebergeordnete Eltern-Komponenten propagiert wird bis zum
        // Refresh der gesamten Seite
        return false
    }

    toString() {
        return 'UpdateSchlagwoerterComponent'
    }
}
