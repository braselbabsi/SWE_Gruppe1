// tslint:disable:max-file-line-count
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
import 'andresse.ts'
import 'umsatz.ts'

import * as _ from 'lodash'
import * as moment from 'moment'
import 'moment/locale/de'

// import _date = moment.unitOfTime._date
moment.locale('de')

const MIN_RATING = 0
const MAX_RATING = 5

export enum GeschlechtType {
    MAENNLICH,
    WEIBLICH,
}

export enum FamilienstandType {
    LEDIG,
    VERHEIRATET,
    GESCHIEDEN,
    VERWITWET,
}
// export enum InteressenType {
//    SPORT = 'S',
//    LESEN = 'L',
//    REISEN = 'R',
// }
/**
 * Gemeinsame Datenfelder unabh&auml;ngig, ob die Buchdaten von einem Server
 * (z.B. RESTful Web Service) oder von einem Formular kommen.
 */
export interface KundeShared {
    _id?: string|undefined
    nachname?: string|undefined
    geschlecht?: GeschlechtType|undefined
    familienstand: FamilienstandType|undefined
    kategorie: number|undefined
    newsletter: boolean|undefined
    email: string|undefined
    geburtsdatum: string|undefined
    umsatz: Umsatz|undefined
    homepage: string|undefined
    adresse: Adresse|undefined
    user: string|undefined
}

/**
 * Daten vom und zum REST-Server:
 * <ul>
 *  <li> Arrays f&uuml;r mehrere Werte, die in einem Formular als Checkbox
 *       dargestellt werden.
 *  <li> Daten mit Zahlen als Datentyp, die in einem Formular nur als
 *       String handhabbar sind.
 * </ul>
 */
export interface KundeServer extends KundeShared {
    kategorie: number|undefined
    interessen?: Array<string>|undefined
}

/**
 * Daten aus einem Formular:
 * <ul>
 *  <li> je 1 Control fuer jede Checkbox und
 *  <li> au&szlig;erdem Strings f&uuml;r Eingabefelder f&uuml;r Zahlen.
 * </ul>
 */
export interface KundeForm extends KundeShared {
    kategorie: number
    lesen?: boolean
    reisen?: boolean
    sport?: boolean
}

/**
 * Model als Plain-Old-JavaScript-Object (POJO) fuer die Daten *UND*
 * Functions fuer Abfragen und Aenderungen.
 */
export class Kunde {
    kategorieArray: Array<boolean> = []

    // wird aufgerufen von fromServer() oder von fromForm()
    private constructor(
        // tslint:disable-next-line:variable-name
        public _id: string|undefined,
        public nachname: string|undefined,
        public kategorie: number|undefined,
        public familienstand: FamilienstandType|undefined,
        public geschlecht: GeschlechtType|undefined,
        public geburtsdatum: moment.Moment|undefined,
        public newsletter: boolean|undefined,
        public user: string|undefined,
        public adresse: Adresse|undefined,
        public homepage: string|undefined,
        public umsatz: Umsatz|undefined,
        public interessen: Array<string>|undefined,
        public email: string|undefined) {
        this._id = _id || undefined
        this.nachname = nachname || undefined
        this.kategorie = kategorie || undefined
        this.familienstand = familienstand || undefined
        this.geschlecht = geschlecht || undefined
        this.geburtsdatum =
        geburtsdatum !== undefined ? geburtsdatum : moment(new Date().toISOString())
        this.newsletter = newsletter || undefined
        this.user = user || undefined
        this.adresse = adresse || undefined
        this.homepage = homepage || undefined
        this.umsatz = umsatz || undefined

        if (interessen === undefined) {
            this.interessen = []
        } else {
            const tmpInteressen = interessen as Array<string>
            this.interessen = tmpInteressen
        }
        if (kategorie !== undefined) {
            _.times(kategorie - MIN_RATING, () => this.kategorieArray.push(true))
            _.times(MAX_RATING - kategorie, () => this.kategorieArray.push(false))
        }
        this.email = email || undefined
    }

    /**
     * Ein Kunde-Objekt mit JSON-Daten erzeugen, die von einem RESTful Web
     * Service kommen.
     * @param kunde JSON-Objekt mit Daten vom RESTful Web Server
     * @return Das initialisierte Kunde-Objekt
     */
    static fromServer(kundeServer: KundeServer) {
        let datum: moment.Moment|undefined
        if (kundeServer.geburtsdatum !== undefined) {
            const tmp = kundeServer.geburtsdatum as string
            datum = moment(tmp)
        }
        const kunde = new Kunde(
            kundeServer._id, kundeServer.nachname, kundeServer.kategorie, kundeServer.familienstand,
            kundeServer.geschlecht, datum, kundeServer.newsletter, kundeServer.user,
            kundeServer.adresse, kundeServer.homepage, kundeServer.umsatz,
            kundeServer.interessen, kundeServer.email)
        console.log('Kunde.fromServer(): kunde=', kunde)
        return kunde
    }

    /**
     * Ein Kunde-Objekt mit JSON-Daten erzeugen, die von einem Formular kommen.
     * @param buch JSON-Objekt mit Daten vom Formular
     * @return Das initialisierte Kunde-Objekt
     */
    static fromForm(kundeForm: KundeForm) {
        const interessen: Array<string> = []
        if (kundeForm.lesen) {
            interessen.push('Lesen')
        }
        if (kundeForm.reisen) {
            interessen.push('Reisen')
        }
        if (kundeForm.sport) {
            interessen.push('Sport')
        }

        const datumMoment = kundeForm.geburtsdatum === undefined ?
            undefined :
            moment(kundeForm.geburtsdatum as string)

        const kunde = new Kunde(
            kundeForm._id, kundeForm.nachname, kundeForm.kategorie, kundeForm.familienstand,
            kundeForm.geschlecht, datumMoment,
            kundeForm.newsletter, kundeForm.user, kundeForm.adresse,
            kundeForm.homepage, kundeForm.umsatz, interessen, kundeForm.email)
        console.log('Kunde.fromForm(): kunde=', kunde)
        return kunde
    }

    // http://momentjs.com
    get datumFormatted() {
        let result: string|undefined
        if (this.geburtsdatum !== undefined) {
            const datum = this.geburtsdatum as moment.Moment
            result = datum.format('Do MMM YYYY')
        }
        return result
    }

    get datumFromNow() {
        let result: string|undefined
        if (this.geburtsdatum !== undefined) {
            const datum = this.geburtsdatum as moment.Moment
            result = datum.fromNow()
        }
        return result
    }

    /**
     * Abfrage, ob im Kundenname der angegebene Teilstring enthalten ist. Dabei
     * wird nicht auf Gross-/Kleinschreibung geachtet.
     * @param nachname Zu &uuml;berpr&uuml;fender Teilstring
     * @return true, falls der Teilstring im Kundenname enthalten ist. Sonst
     *         false.
     */
    containsName(nachname: string) {
        let result = false
        if (this.nachname !== undefined) {
            const tmp = this.nachname as string
            result = tmp.toLowerCase().includes(nachname.toLowerCase())
        }
        return result
    }

    /**
     * Die Bewertung ("rating") des Buches um 1 erh&ouml;hen
     */
    rateUp() {
        if (this.kategorie !== undefined && this.kategorie < MAX_RATING) {
            this.kategorie++
        }
    }

    /**
     * Die Bewertung ("rating") des Buches um 1 erniedrigen
     */
    rateDown() {
        if (this.kategorie !== undefined && this.kategorie > MIN_RATING) {
            this.kategorie--
        }
    }

    /**
     * Abfrage, ob das Kunde dem angegebenen GeschlechtType zugeordnet ist.
     * @param verlag der Name des Verlags
     * @return true, falls das Kunde dem GeschlechtType zugeordnet ist. Sonst false.
     */
    hasGeschlecht(geschlecht: GeschlechtType) {
        return this.geschlecht === geschlecht
    }

    /**
     * Aktualisierung der Stammdaten des Kunde-Objekts.
     * @param name Der neue Buchtitel
     * @param rating Die neue Bewertung
     * @param familienstandType Die neue Buchart (VERHEIRATET oder LEDIG)
     * @param geschlechtType Der neue GeschlechtType
     * @param kategorie Der neue Preis
     * @param rabatt Der neue Rabatt
     */
    updateStammdaten(
        nachname: string, geschlechtType: GeschlechtType, familienstandType: FamilienstandType, kategorie: number,
        newletter: boolean | undefined, email: string | undefined, datum: moment.Moment|undefined,
        user: string|undefined, adresse: Adresse|undefined, homepage: string|undefined,
        umsatz: Umsatz|undefined) {
        this.nachname = nachname
        this.geschlecht = geschlechtType
        this.familienstand = familienstandType
        this.kategorie = kategorie
        this.kategorieArray = []
        _.times(kategorie - MIN_RATING, () => this.kategorieArray.push(true))
        this.newsletter = newletter
        this.email = email
        this.geburtsdatum = datum
        this.umsatz = umsatz
        this.homepage = homepage
        this.adresse = adresse
        this.user = user
    }

    /**
     * Abfrage, ob es zum Kunde auch Schlagw&ouml;rter gibt.
     * @return true, falls es mindestens ein Schlagwort gibt. Sonst false.
     */
    hasInteressen() {
        if (this.interessen === undefined) {
            return false
        }
        const tmpInteressen = this.interessen as Array<string>
        return tmpInteressen.length !== 0
    }

    /**
     * Abfrage, ob es zum Kunde das angegebene Schlagwort gibt.
     * @param schlagwort das zu &uuml;berpr&uuml;fende Schlagwort
     * @return true, falls es das Schlagwort gibt. Sonst false.
     */
    hasInteresse(interessen: string) {
        if (this.interessen === undefined) {
            return false
        }
        const tmpInteressen = this.interessen as Array<string>
        return tmpInteressen.includes(interessen)
    }

    /**
     * Aktualisierung der Interessen des Kunde-Objekts.
     * @param lesen ist das Interesse LESEN gesetzt
     * @param reisen ist das Interesse REISEN gesetzt
     * @param sport ist das Interesse SPORT gesetzt
     */
    updateInteressen(lesen: boolean, reisen: boolean, sport: boolean) {
        this.resetInteressen()
        if (lesen) {
            this.addInteresse('Lesen')
        }
        if (reisen) {
            this.addInteresse('Reisen')
        }
        if (sport) {
            this.addInteresse('Sport')
        }
    }

    /**
     * Konvertierung des Kundeobjektes in ein JSON-Objekt f&uuml;r den RESTful
     * Web Service.
     */
     // tslint:disable-next-line:max-line-length
    /** @return {_id: (string|any); nachname: (string|any); kategorie: (number|any); familienstand: (FamilienstandType|any); geschlecht: (GeschlechtType|any); geburtsdatum: (moment.Moment|any); newsletter: (boolean|any); interessen: (Array<string>|any); email: (string|any); user: (string|any); adresse: (Adresse|any); homepage: (string|any); umsatz: (Umsatz|any)}
     * JSON-Objekt f&uuml;r den RESTful Web Service
     */

     toJSON(): KundeServer {
        const geburtsdatum = this.geburtsdatum === undefined ?
            undefined :
            this.geburtsdatum.format('YYYY-MM-DD')
        return {
            _id: this._id,
            nachname: this.nachname,
            kategorie: this.kategorie,
            familienstand: this.familienstand,
            geschlecht: this.geschlecht,
            geburtsdatum,
            newsletter: this.newsletter,
            interessen: this.interessen,
            email: this.email,
            user: this.user,
            adresse: this.adresse,
            homepage: this.homepage,
            umsatz: this.umsatz,
        }
    }

    toString() {
        return JSON.stringify(this, null, 2)
    }

    private resetInteressen() {
        this.interessen = []
    }

    private addInteresse(interessen: string) {
        if (this.interessen === undefined) {
            this.interessen = []
        }
        const tmpInteressen = this.interessen as Array<string>
        tmpInteressen.push(interessen)
    }
}
