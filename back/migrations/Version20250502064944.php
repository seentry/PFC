<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250502064944 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE padres ADD email VARCHAR(255) NOT NULL, ADD contrasena VARCHAR(255) NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE trajes ADD dueno_original_id INT NOT NULL, ADD disponible TINYINT(1) NOT NULL, DROP dueno_original
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE trajes ADD CONSTRAINT FK_B53F3C2F46A2C0DA FOREIGN KEY (dueno_original_id) REFERENCES padres (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_B53F3C2F46A2C0DA ON trajes (dueno_original_id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE padres DROP email, DROP contrasena
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE trajes DROP FOREIGN KEY FK_B53F3C2F46A2C0DA
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_B53F3C2F46A2C0DA ON trajes
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE trajes ADD dueno_original VARCHAR(255) NOT NULL, DROP dueno_original_id, DROP disponible
        SQL);
    }
}
