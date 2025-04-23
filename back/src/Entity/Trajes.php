<?php

namespace App\Entity;

use App\Repository\TrajesRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity(repositoryClass: TrajesRepository::class)]
#[ApiResource]
class Trajes
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $tipo = null;

    #[ORM\Column]
    private ?int $talla = null;

    #[ORM\Column(length: 255)]
    private ?string $estado = null;

    #[ORM\ManyToOne(targetEntity: Padres::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Padres $duenoOriginal = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $fechaIncorporacion = null;

    // Nuevo campo disponible
    #[ORM\Column(type: 'boolean')]
    private bool $disponible = true;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTipo(): ?string
    {
        return $this->tipo;
    }

    public function setTipo(string $tipo): static
    {
        $tipo = strtolower($tipo);

        if (!in_array($tipo, ['gala', 'normal'])) {
            throw new \InvalidArgumentException("El tipo debe ser 'gala' o 'normal'.");
        }

        $this->tipo = $tipo;
        return $this;
    }

    public function getTalla(): ?int
    {
        return $this->talla;
    }

    public function setTalla(int $talla): static
    {
        $this->talla = $talla;
        return $this;
    }

    public function getEstado(): ?string
    {
        return $this->estado;
    }

    public function setEstado(string $estado): static
    {
        $estado = strtolower($estado);
        $estadosPermitidos = ['nuevo', 'aceptable', 'regular', 'mal'];

        if (!in_array($estado, $estadosPermitidos, true)) {
            throw new \InvalidArgumentException("El estado debe ser: nuevo, aceptable, regular o mal.");
        }

        $this->estado = $estado;
        return $this;
    }

    public function getDuenoOriginal(): ?Padres
    {
        return $this->duenoOriginal;
    }

    public function setDuenoOriginal(Padres $duenoOriginal): static
    {
        $this->duenoOriginal = $duenoOriginal;
        return $this;
    }

    public function getFechaIncorporacion(): ?\DateTimeInterface
    {
        return $this->fechaIncorporacion;
    }

    public function setFechaIncorporacion(\DateTimeInterface $fechaIncorporacion): static
    {
        $this->fechaIncorporacion = $fechaIncorporacion;
        return $this;
    }

    public function isDisponible(): bool
    {
        return $this->disponible;
    }

    public function setDisponible(bool $disponible): static
    {
        $this->disponible = $disponible;
        return $this;
    }
}
