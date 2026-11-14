import { UserEntity } from '@database/entities/index.js';
import { BaseRepository } from './base.repository.js';

export class UserRepository extends BaseRepository<UserEntity> {}
