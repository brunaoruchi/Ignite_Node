import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository.createQueryBuilder("games")
    .where("games.title ilike :title", { title: `%${param}%` })
    .getMany()
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query("SELECT COUNT(*) FROM games");
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const games = await this.repository.createQueryBuilder("games")
    .innerJoinAndSelect("games.users", "users")
    .where("games.id = :id", {id}).getOne()

    if(!games){
      throw new Error("Games not exists")
    }

    return games?.users;
  }
}
