import { Countries } from 'src/countries/countries.entity';
import { PlayerTeamRelationships } from 'src/player-team-relationships/player-team-relationships.entity';
import { Venues } from 'src/venues/venues.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('teams')
export class Teams {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @ManyToOne(() => Countries, { nullable: false })
  @JoinColumn({ name: 'country' })
  country: Countries;

  @Column()
  founded: number;

  @Column()
  national: boolean;

  @Column()
  logo: string;

  @OneToOne(() => Venues, { nullable: true })
  @JoinColumn({ name: 'venueId' })
  venue: Venues | null;

  @OneToMany(
    () => PlayerTeamRelationships,
    (playerTeamRelationship) => playerTeamRelationship.team,
  )
  playerTeamRelationships: PlayerTeamRelationships[];
}
