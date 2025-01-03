import type { Request } from 'express'
import { lookup } from 'geoip-lite'
import * as countries from 'i18n-iso-countries'

import type { SessionMetadata } from '../types/session-metadata.types'

import { IS_DEV_ENV } from './is-dev.util'

import DeviceDetector = require('device-detector-js')

/**
 * Extracts metadata from the request, including the user's IP address, geolocation, and device information.
 *
 * @param req The Express request object.
 * @param configService The ConfigService instance.
 * @param userAgent The user agent string.
 * @returns An object containing the user's IP address, geolocation, and device information.
 */
export function getSessionMetadata(
	req: Request,
	userAgent: string
): SessionMetadata {
	// Determine the IP address of the client based on the environment and request headers.
	const ip = IS_DEV_ENV
		? '127.0.0.1' // In development mode, use the predefined local IP from the configuration.
		: Array.isArray(req.headers['cf-connecting-ip']) // Check if 'cf-connecting-ip' (Cloudflare-provided IP) is an array.
			? req.headers['cf-connecting-ip'][0] // If 'cf-connecting-ip' is an array, use the first IP address.
			: req.headers['cf-connecting-ip'] || // If 'cf-connecting-ip' is a string, use it directly.
				(typeof req.headers['x-forwarded-for'] === 'string' // Otherwise, check if 'x-forwarded-for' (standard proxy header) is a string.
					? req.headers['x-forwarded-for'].split(',')[0] // If 'x-forwarded-for' contains multiple IPs, use the first one.
					: req.ip) // Fallback to the request's IP address if none of the above headers are present.

	const location = lookup(ip)

	if (!location) {
		return {
			location: {
				country: 'Unknown',
				city: 'Unknown',
				latitude: 0,
				longitude: 0
			},
			device: {
				browser: 'Unknown',
				os: 'Unknown',
				type: 'Unknown'
			},
			ip
		}
	}

	const device = new DeviceDetector().parse(userAgent)

	return {
		location: {
			country: countries.getName(location.country, 'en') || 'Unknown',
			city: location.city || 'Unknown',
			latitude: location.ll ? location.ll[0] : 0,
			longitude: location.ll ? location.ll[1] : 0
		},
		device: {
			browser: device.client.name || 'Unknown',
			os: device.os.name || 'Unknown',
			type: device.device.type || 'Unknown'
		},
		ip
	}
}
