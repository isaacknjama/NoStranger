import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verifyEvent, validateEvent } from 'nostr-tools';
import { NostrEventDto } from './dto/auth.dto';

interface JwtPayload {
  pubkey: string;
  sub?: string;
  iat?: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private jwtService: JwtService) {}

  authenticateNostrEvent(event: NostrEventDto): string {
    this.logger.debug(
      `Authenticating Nostr event from pubkey: ${event.pubkey}`,
    );

    // Validate event structure (kind, pubkey, sig, etc.)
    // Need to cast to any since nostr-tools expect a different shape
    const nostrEvent = event as any;

    if (!validateEvent(nostrEvent)) {
      this.logger.warn(
        `Invalid Nostr event structure from pubkey: ${event.pubkey}`,
      );
      throw new Error('Invalid Nostr event structure');
    }

    // Verify the signature matches the pubkey and content
    const isValid = verifyEvent(nostrEvent);
    if (!isValid) {
      this.logger.warn(
        `Invalid signature for event from pubkey: ${event.pubkey}`,
      );
      throw new Error('Invalid signature');
    }

    // Optional: Check if event is recent enough (within last 5 minutes)
    const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 300;
    if (event.created_at < fiveMinutesAgo) {
      this.logger.warn(`Event from pubkey: ${event.pubkey} is too old`);
      throw new Error(
        'Event too old. Please generate a new authentication event',
      );
    }

    // Create JWT payload with pubkey as the identifier
    const payload: JwtPayload = {
      pubkey: event.pubkey,
      sub: event.pubkey, // Standard JWT claim for subject
      iat: Math.floor(Date.now() / 1000), // Issued at time
    };

    return this.jwtService.sign(payload);
  }
}
