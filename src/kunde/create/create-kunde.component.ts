/*
 * Copyright (C) 2015 - 2016 Juergen Zimmermann, Hochschule Karlsruhe
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

import {Component, OnInit} from '@angular/core'
// Bereitgestellt durch das ReactiveFormsModule (s. Re-Export im SharedModule)
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import {Title} from '@angular/platform-browser'
// Bereitgestellt durch das RouterModule (s. Re-Export im SharedModule)
import {Router} from '@angular/router'

import {HOME_PATH} from '../../app/routes'
import {log} from '../../shared'
import {Kunde, emailValidator} from '../shared'
import {KundeService} from '../shared/kunde.service'

/**
 * Komponente mit dem Tag &lt;create-kunde&gt;, um das Erfassungsformular
 * f&uuml;r ein neuer Kunde zu realisieren.
 */
@Component({
    // moduleId: module.id,
    selector: 'hs-create-kunde',
    templateUrl: './create-kunde.html',
})
export default class CreateKundeComponent implements OnInit {
    [x: string]: any;
    form: FormGroup

    // Keine Vorbelegung bzw. der leere String, da es Placeholder gibt
    // Varianten fuer Validierung:
    //    serverseitig mittels Request/Response
    //    clientseitig bei den Ereignissen keyup, change, ...
    // Ein Endbenutzer bewirkt staendig einen neuen Fehlerstatus
    readonly nachname: FormControl = new FormControl(undefined, Validators.compose([
        Validators.required, Validators.minLength(2),
        Validators.pattern(/^\w.*$/),
    ]))
    readonly interesse: FormControl = new FormControl(undefined)
    readonly familienstand: FormControl = new FormControl('LEDIG')
    readonly kategorie: FormControl = new FormControl(undefined)
    readonly adresse: FormControl = new FormControl(undefined)
    readonly newsletter: FormControl = new FormControl(undefined)
    readonly homepage: FormControl = new FormControl(undefined)
    readonly umsatz: FormControl = new FormControl(undefined)
    readonly geburtsdatum: FormControl = new FormControl(false)
    readonly geschlecht: FormControl = new FormControl(false)
    readonly email: FormControl =
        new FormControl(undefined, [Validators.required, emailValidator] as any)

    showWarning = false
    fertig = false

    constructor(
        private formBuilder: FormBuilder,
        private kundeService: KundeService, private router: Router,
        private nachnameService: Nachname) {
        console.log('CreateKundeComponent.constructor()')
        if (router !== undefined) {
            console.log('Injizierter Router:', router)
        }
    }

    /**
     * Das Formular als Gruppe von Controls initialisieren.
     */
    @log
    ngOnInit() {
        this.form = this.formBuilder.group({
            // siehe formControlName innerhalb @Component({template: ...})
            nachname: this.nachname,
            email: this.email,
            kategorie: this.kategorie,
            newsletter: this.newsletter,
            geburtsdatum: this.geburtsdatum,
            umsatz: this.umsatz,
            homepage: this.homepage,
            geschlecht: this.geschlecht,
            familienstand: this.familienstand,
            interessen: this.interessen,
            adresse: this.adresse,
        })

        this.nachnameService.setNachname('Neuer Kunde')
    }

    /**
     * Die Methode <code>save</code> realisiert den Event-Handler, wenn das
     * Formular abgeschickt wird, um ein neuer Kunde anzulegen.
     * @return false, um das durch den Button-Klick ausgel&ouml;ste Ereignis
     *         zu konsumieren.
     */
    @log
    onSave() {
        // In einem Control oder in einer FormGroup gibt es u.a. folgende
        // Properties
        //    value     JSON-Objekt mit den IDs aus der FormGroup als
        //              Schluessel und den zugehoerigen Werten
        //    errors    Map<string,any> mit den Fehlern, z.B. {'required': true}
        //    valid     true/false
        //    dirty     true/false, falls der Wert geaendert wurde

        if (!this.form.valid) {
            console.log('Validierungsfehler:', this.form)
            return false
        }

        const neuerKunde = Kunde.fromForm(this.form.value)
        console.log('neuerKunde=', neuerKunde)

        const successFn: (location: string|undefined) => void =
            (location = undefined) => {
                console.log(
                    `CreateKunde.onSave(): successFn(): location: ${location}`)
                // TODO Das Response-Objekt enthaelt im Header NICHT "Location"
                console.log(
                    `CreateKunde.onSave(): successFn(): navigate: ${HOME_PATH}`)
                this.fertig = true
                this.showWarning = false
                this.router.navigate([HOME_PATH])
            }
        const errorFn: (status: number,
                        errors: {[s: string]: any}|undefined) => void =
            (status, errors) => {
                console.error(`CreateKunde.onSave(): errorFn(): status: ${status}`)
                console.error('CreateKunde.onSave(): errorFn(): errors', errors)
            }
        this.kundeService.save(neuerKunde, successFn, errorFn)

        // damit das (Submit-) Ereignis konsumiert wird und nicht an
        // uebergeordnete Eltern-Komponenten propagiert wird bis zum Refresh
        // der gesamten Seite
        return false
    }

    toString() {
        return 'CreateKundeComponent'
    }
}
