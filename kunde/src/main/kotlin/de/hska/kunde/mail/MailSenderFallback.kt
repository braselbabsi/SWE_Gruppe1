/*
 * Copyright (C) 2016 - 2017 Juergen Zimmermann, Hochschule Karlsruhe
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
package de.hska.kunde.mail

import de.hska.kunde.entity.Kunde
import org.apache.logging.log4j.LogManager.getLogger
import org.springframework.stereotype.Service

/**
 * Fallback zum MailSender fuer neue Kunden.
 * @author [Juergen Zimmermann](mailto:Juergen.Zimmermann@HS-Karlsruhe.de)
 */
@Service
internal class MailSenderFallback {
    fun send(neuerKunde: Kunde) =
        // TODO Abspeichern der noch nicht gesendeten Email
        LOGGER.error("Fehler beim Senden der Email fuer: {}", neuerKunde)

    private companion object {
        val LOGGER = getLogger()
    }
}
