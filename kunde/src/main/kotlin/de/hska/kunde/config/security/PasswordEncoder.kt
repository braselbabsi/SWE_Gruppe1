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
package de.hska.kunde.config.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Description
import org.springframework.security.crypto.factory.PasswordEncoderFactories
        .createDelegatingPasswordEncoder

internal interface PasswordEncoder {
    @Bean
    @Description("Default Passwort-Verschluesselung (bcrypt)")
    // Alternativen: pbkdf2, scrypt, noop
    fun passwordEncoder() = createDelegatingPasswordEncoder()
}