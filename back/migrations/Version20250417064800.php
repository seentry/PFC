<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250417064800 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE padres ADD email VARCHAR(255) NOT NULL, ADD contrasena VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE trajes ADD CONSTRAINT FK_B53F3C2F46A2C0DA FOREIGN KEY (dueno_original_id) REFERENCES padres (id)');
        $this->addSql('CREATE INDEX IDX_B53F3C2F46A2C0DA ON trajes (dueno_original_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE padres DROP email, DROP contrasena');
        $this->addSql('ALTER TABLE trajes DROP FOREIGN KEY FK_B53F3C2F46A2C0DA');
        $this->addSql('DROP INDEX IDX_B53F3C2F46A2C0DA ON trajes');
    }
}
