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

import * as _ from 'lodash'
import * as moment from 'moment'
import 'moment/locale/de'
import _date = moment.unitOfTime._date;

moment.locale('de')

const MIN_RATING = 0
const MAX_RATING = 5

export enum GeschlechtType {
    MAENNLICH = 'MAENNLICH',
    WEIBLICH = 'WEIBLICH',
}

export enum FamilienstandType {
    LEDIG = 'L',
    VERHEIRATET = 'VH',
    GESCHIEDEN ='G',
    VERWITWET ='VW',
}
export enum InteressenType{
    SPORT = 'S',
    LESEN = 'L',
    REISEN = 'R',
}




/**
 * Gemeinsame Datenfelder unabh&auml;ngig, ob die Buchdaten von einem Server
 * (z.B. RESTful Web Service) oder von einem Formular kommen.
 */
export interface KundeShared {
    _id?: string|undefined
    name?: string|undefined
    geschlecht?: GeschlechtType|undefined
    familienstand: FamilienstandType|undefined
 //   kategorie: number|undefined
 //   datum: _date|undefined
    newsletter: boolean|undefined
    email: string|undefined
    geburtsdatum: string|undefined
    betrag: number|undefined
    waehrung: string|undefined
    homepage: string|undefined
    interessen: InteressenType|undefined
    ort: string|undefined
    plz: number|undefined
 //   username: string|undefined
    kategorie:number|undefined
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
    rating: number|undefined
    schlagwoerter?: Array<string>|undefined
}

/**
 * Daten aus einem Formular:
 * <ul>
 *  <li> je 1 Control fuer jede Checkbox und
 *  <li> au&szlig;erdem Strings f&uuml;r Eingabefelder f&uuml;r Zahlen.
 * </ul>
 */
export interface KundeForm extends KundeShared {
    rating: string
    geschaeftskunde?: boolean
    privatkunde?: boolean
}

/**
 * Model als Plain-Old-JavaScript-Object (POJO) fuer die Daten *UND*
 * Functions fuer Abfragen und Aenderungen.
 */
export class Kunde {
    ratingArray: Array<boolean> = []

    // wird aufgerufen von fromServer() oder von fromForm()
    private constructor(
        // tslint:disable-next-line:variable-name
        public _id: string|undefined,
        public name: string|undefined,
        public rating: number|undefined,
        public familienstand: FamilienstandType|undefined,
        public geschlecht: GeschlechtType|undefined,
        public geburtsdatum: moment.Moment|undefined,

        public kategorie: number|undefined,
        public newsletter: boolean|undefined,
        public schlagwoerter: Array<string>|undefined,
//selbst hinzugefügt
        public username: string|undefined,
        public ort: string|undefined,
        public plz: number|undefined,
        public homepage: string|undefined,
        public betrag: number|undefined,
        public waehrung:string|undefined,
        public interessen: InteressenType|undefined,
//.
        public email: string|undefined)
    {
        this._id = _id || undefined
        this.name = name || undefined
        this.rating = rating || undefined
        this.familienstand = familienstand || undefined
        this.geschlecht = geschlecht || undefined
        this.geburtsdatum =
            geburtsdatum !== undefined ? geburtsdatum : moment(new Date().toISOString())
        this.kategorie = kategorie || undefined
        this.newsletter = newsletter || undefined
//selbst hinzugefügt
        this.username = username|| undefined
        this.ort = ort|| undefined
        this.plz = plz|| undefined
        this.homepage = homepage|| undefined
        this.betrag = betrag|| undefined
        this.waehrung = waehrung|| undefined
        this.interessen = interessen|| undefined
//.

        if (schlagwoerter === undefined) {
            this.schlagwoerter = []
        } else {
            const tmpSchlagwoerter = schlagwoerter as Array<string>
            this.schlagwoerter = tmpSchlagwoerter
        }
        if (rating !== undefined) {
            _.times(rating - MIN_RATING, () => this.ratingArray.push(true))
            _.times(MAX_RATING - rating, () => this.ratingArray.push(false))
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
            kundeServer._id, kundeServer.name, kundeServer.rating, kundeServer.familienstand,
            kundeServer.geschlecht, datum, kundeServer.kategorie,//rabatt gelöscht!
            kundeServer.newsletter, kundeServer.schlagwoerter, kundeServer.email,kundeServer.geburtsdatum,
            kundeServer.ort, kundeServer.plz, kundeServer.homepage, kundeServer.waehrung, kundeServer.betrag,kundeServer.interessen)
        console.log('Kunde.fromServer(): kunde=', kunde)
        return kunde
    }

    /**
     * Ein Kunde-Objekt mit JSON-Daten erzeugen, die von einem Formular kommen.
     * @param buch JSON-Objekt mit Daten vom Formular
     * @return Das initialisierte Kunde-Objekt
     */
    static fromForm(kundeForm: KundeForm) {
        const schlagwoerter: Array<string> = []
        if (kundeForm.geschaeftskunde) {
            schlagwoerter.push('GESCHAEFTSKUNDE')
        }
        if (kundeForm.privatkunde) {
            schlagwoerter.push('PRIVATKUNDE')
        }

        const datumMoment = kundeForm.geburtsdatum === undefined ?
            undefined :
            moment(kundeForm.geburtsdatum as string)

        const kunde = new Kunde(
            kundeForm._id, kundeForm.name, kundeForm.rating, kundeForm.familienstand,
            kundeForm.geschlecht, datumMoment, kundeForm.kategorie,
            kundeForm.newsletter, schlagwoerter, kundeForm.email,kundeForm.geburtsdatum, kundeForm.ort, kundeForm.plz,
            kundeForm.homepage, kundeForm.betrag, kundeForm.waehrung,kundeForm.interessen)
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
     * Abfrage, ob im Buchtitel der angegebene Teilstring enthalten ist. Dabei
     * wird nicht auf Gross-/Kleinschreibung geachtet.
     * @param name Zu &uuml;berpr&uuml;fender Teilstring
     * @return true, falls der Teilstring im Buchtitel enthalten ist. Sonst
     *         false.
     */
    containsName(name: string) {
        let result = false
        if (this.name !== undefined) {
            const tmp = this.name as string
            result = tmp.toLowerCase().includes(name.toLowerCase())
        }
        return result
    }

    /**
     * Die Bewertung ("rating") des Buches um 1 erh&ouml;hen
     */
    rateUp() {
        if (this.rating !== undefined && this.rating < MAX_RATING) {
            this.rating++
        }
    }

    /**
     * Die Bewertung ("rating") des Buches um 1 erniedrigen
     */
    rateDown() {
        if (this.rating !== undefined && this.rating > MIN_RATING) {
            this.rating--
        }
    }

    /**
     * Abfrage, ob das Kunde dem angegebenen GeschlechtType zugeordnet ist.
     * @param verlag der Name des Verlags
     * @return true, falls das Kunde dem GeschlechtType zugeordnet ist. Sonst false.
     */
    hasVerlag(geschlecht: string) {
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
        name: string, familienstandType: FamilienstandType, geschlechtType: GeschlechtType, rating: number,
        datum: moment.Moment|undefined, kategorie: number|undefined,
        username: string|undefined, ort: string|undefined,plz:number|undefined, homepage: string|undefined,
        betrag: number|undefined,waehrung: string|undefined, interessen: InteressenType|undefined ) {
        this.name = name
        this.familienstand = familienstandType
        this.geschlecht = geschlechtType
        this.rating = rating
        this.ratingArray = []
        _.times(rating - MIN_RATING, () => this.ratingArray.push(true))
        this.geburtsdatum = datum
        this.kategorie = kategorie

        this.username = username
        this.ort = ort
        this.plz = plz
        this.homepage = homepage
        this.betrag = betrag
        this.waehrung = waehrung
        this.interessen = interessen
    }

    /**
     * Abfrage, ob es zum Kunde auch Schlagw&ouml;rter gibt.
     * @return true, falls es mindestens ein Schlagwort gibt. Sonst false.
     */
    hasSchlagwoerter() {
        if (this.schlagwoerter === undefined) {
            return false
        }
        const tmpSchlagwoerter = this.schlagwoerter as Array<string>
        return tmpSchlagwoerter.length !== 0
    }

    /**
     * Abfrage, ob es zum Kunde das angegebene Schlagwort gibt.
     * @param schlagwort das zu &uuml;berpr&uuml;fende Schlagwort
     * @return true, falls es das Schlagwort gibt. Sonst false.
     */
    hasSchlagwort(schlagwort: string) {
        if (this.schlagwoerter === undefined) {
            return false
        }
        const tmpSchlagwoerter = this.schlagwoerter as Array<string>
        return tmpSchlagwoerter.includes(schlagwort)
    }

    /**
     * Aktualisierung der Schlagw&ouml;rter des Kunde-Objekts.
     * @param geschaeftskunde ist das Schlagwort JAVASCRIPT gesetzt
     * @param privatkunde ist das Schlagwort TYPESCRIPT gesetzt
     */
    updateSchlagwoerter(geschaeftskunde: boolean, privatkunde: boolean) {
        this.resetSchlagwoerter()
        if (geschaeftskunde) {
            this.addSchlagwort('GESCHAEFTSKUNDE')
        }
        if (privatkunde) {
            this.addSchlagwort('PRIVATKUNDE')
        }
    }

    /**
     * Konvertierung des Buchobjektes in ein JSON-Objekt f&uuml;r den RESTful
     * Web Service.
     * @return {{_id: (string|any); name: (string|any); rating: (number|any); familienstand: (FamilienstandType|any); geschlecht: (GeschlechtType|any); datum: string; kategorie: (number|any); newsletter: (boolean|any); schlagwoerter: (Array<string>|any); email: (string|any); username: (string|any); adresse: (Adresse|any); homepage: (string|any); umsatz: (Umsatz|any); interessen: (InteressenType|any)}} JSON-Objekt f&uuml;r den RESTful Web Service
     */
    toJSON(): KundeServer {
        const datum = this.geburtsdatum === undefined ?
            undefined :
            this.geburtsdatum.format('YYYY-MM-DD')
        return <KundeServer>{  //<KundeServer> hinzugefüht !!
            _id: this._id,
            name: this.name,
            rating: this.rating,
            familienstand: this.familienstand,
            geschlecht: this.geschlecht,
            datum,
            kategorie: this.kategorie,
            newsletter: this.newsletter,
            schlagwoerter: this.schlagwoerter,
            email: this.email,
            username: this.username,
            ort: this.ort,
            plz: this.plz,
            homepage: this.homepage,
            betrag: this.betrag,
            waehrung: this.waehrung,
            interessen: this.interessen
        }
    }

    toString() {
        return JSON.stringify(this, null, 2)
    }

    private resetSchlagwoerter() {
        this.schlagwoerter = []
    }

    private addSchlagwort(schlagwort: string) {
        if (this.schlagwoerter === undefined) {
            this.schlagwoerter = []
        }
        const tmpSchlagwoerter = this.schlagwoerter as Array<string>
        tmpSchlagwoerter.push(schlagwort)
    }
}
