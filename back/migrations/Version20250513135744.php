<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250513135744 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE trajes ADD reservado_por_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE trajes ADD CONSTRAINT FK_B53F3C2F46A2C0DA FOREIGN KEY (dueno_original_id) REFERENCES padres (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE trajes ADD CONSTRAINT FK_B53F3C2F357A5388 FOREIGN KEY (reservado_por_id) REFERENCES padres (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_B53F3C2F46A2C0DA ON trajes (dueno_original_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_B53F3C2F357A5388 ON trajes (reservado_por_id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE trajes DROP FOREIGN KEY FK_B53F3C2F46A2C0DA
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE trajes DROP FOREIGN KEY FK_B53F3C2F357A5388
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_B53F3C2F46A2C0DA ON trajes
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_B53F3C2F357A5388 ON trajes
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE trajes DROP reservado_por_id
        SQL);
    }
}
