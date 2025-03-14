import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// Based on the Nostr event structure
export class NostrEventDto {
  @IsNumber()
  @IsNotEmpty()
  kind: number;

  @IsString()
  @IsNotEmpty()
  pubkey: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Array)
  tags: string[][];

  @IsString()
  content: string;

  @IsNumber()
  created_at: number;

  @IsString()
  @IsNotEmpty()
  sig: string;
}
