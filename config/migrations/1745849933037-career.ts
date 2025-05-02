import { MigrationInterface, QueryRunner } from "typeorm";

export class Career1745849933037 implements MigrationInterface {
    name = 'Career1745849933037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`yt\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`yt\``);
    }

}
