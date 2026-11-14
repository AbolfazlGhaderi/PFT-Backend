import { UserEntity } from '@database/entities/user.entity.js';
import { BaseRepository } from './base.repository.js';

export class UserRepository extends BaseRepository<UserEntity> {}
