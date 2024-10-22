import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fixtures } from './fixtures.entities';
import { Repository } from 'typeorm';
import { FixturesPaginationDTO } from './dtos/pagination.dto';
import { DateTime } from 'luxon';

@Injectable()
export class FixturesService {
  constructor(
    @InjectRepository(Fixtures)
    private fixturesRepository: Repository<Fixtures>,
  ) {}

  async findAll(query: FixturesPaginationDTO) {
    const { date, timezone } = query;

    const queryBuilder = this.fixturesRepository
      .createQueryBuilder('fixture')
      .leftJoinAndSelect('fixture.venue', 'venue')
      .leftJoinAndSelect('fixture.league', 'league')
      .leftJoinAndSelect('fixture.homeTeam', 'homeTeam')
      .leftJoinAndSelect('fixture.awayTeam', 'awayTeam')
      .leftJoinAndSelect(
        'fixture.fixtureBets',
        'fixtureBet',
        '(fixtureBet.betId = :betId OR fixtureBet.id IS NULL)',
        { betId: 1 },
      )
      .leftJoinAndSelect('fixtureBet.fixtureBetOdds', 'fixtureBetOdd');

    if (date && timezone) {
      const localDate = DateTime.fromISO(date, { zone: timezone });

      const startOfDay = localDate.startOf('day').toUTC();

      const endOfDay = localDate.endOf('day').toUTC();

      queryBuilder.andWhere(
        'fixture.date >= :startOfDay AND fixture.date <= :endOfDay',
        { startOfDay: startOfDay.toISO(), endOfDay: endOfDay.toISO() },
      );
    }

    queryBuilder.andWhere(
      '(fixtureBet.betId = :betId OR fixtureBet.id IS NULL)',
      { betId: 1 },
    );

    return await queryBuilder.getMany();
  }

  // TODO: future
  async findOneById(id: number) {
    const fixture = await this.fixturesRepository
      .createQueryBuilder('fixture')
      .leftJoinAndSelect('fixture.venue', 'venue')
      .leftJoinAndSelect('fixture.league', 'league')
      .leftJoinAndSelect('fixture.homeTeam', 'homeTeam')
      .leftJoinAndSelect('fixture.awayTeam', 'awayTeam')
      .leftJoinAndSelect(
        'fixture.fixtureBets',
        'fixtureBet',
        'fixtureBet.betId IN (:...betIds) OR fixtureBet.id IS NULL',
        {
          betIds: [1, 92],
        },
      )
      // .leftJoinAndSelect('fixtureBet.fixtureBetOdds', 'fixtureBetOdd')
      // .leftJoinAndSelect(
      //   'homeTeam.playerTeamRelationships',
      //   'homePlayerTeamRelationships',
      //   `
      // homePlayerTeamRelationships.leagueId = league.id AND
      // homePlayerTeamRelationships.leagueSeason = fixture.season
      // `,
      // )
      // .leftJoinAndSelect('homePlayerTeamRelationships.player', 'homePlayer')
      // .leftJoinAndSelect(
      //   'awayTeam.playerTeamRelationships',
      //   'awayPlayerTeamRelationships',
      //   `
      // awayPlayerTeamRelationships.leagueId = league.id AND
      // awayPlayerTeamRelationships.leagueSeason = fixture.season
      // `,
      // )
      // .leftJoinAndSelect('awayPlayerTeamRelationships.player', 'awayPlayer')
      .where('fixture.id = :id', { id })
      .getOne();

    if (!fixture) throw new NotFoundException('Fixture not found');

    // let fixtureBetAnytimeScorer = fixture.fixtureBets.find((bet) => bet.id);

    // if (fixtureBetAnytimeScorer) {
    //   const homeTeamSet = new Set(
    //     fixture.homeTeam.playerTeamRelationships.map((pr) => pr.player.name),
    //   );

    //   const awayTeamSet = new Set(
    //     fixture.awayTeam.playerTeamRelationships.map((pr) => pr.player.name),
    //   );

    //   for (let player of fixtureBetAnytimeScorer.fixtureBetOdds) {
    //     const playerWithTeam = player as {
    //       value: string;
    //       team?: 'home' | 'away';
    //     };

    //     if (homeTeamSet.has(playerWithTeam.value)) {
    //       playerWithTeam.team = 'home';
    //     } else if (awayTeamSet.has(playerWithTeam.value)) {
    //       playerWithTeam.team = 'away';
    //     }
    //   }
    // }

    // delete fixture.homeTeam.playerTeamRelationships;
    // delete fixture.awayTeam.playerTeamRelationships;

    return fixture;
  }
}
