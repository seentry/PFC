<?php

namespace App\Entity;

use App\Repository\PadresRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\Usuarios;

#[ORM\Entity(repositoryClass: PadresRepository::class)]
class Padres
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nombre = null;

    #[ORM\Column(length: 255)]
    private ?string $apellidos = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $añoInscripcion = null;

    #[ORM\Column(length: 255)]
    private ?string $estadoPagos = null;

    #[ORM\Column]
    private ?int $credito = null;

    #[ORM\OneToMany(mappedBy: 'tutorLegal', targetEntity: Usuarios::class)]
    private ?Collection $hijos = null;

    public function __construct()
    {
        $this->hijos = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): ?string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): static
    {
        $this->nombre = $nombre;

        return $this;
    }

    public function getApellidos(): ?string
    {
        return $this->apellidos;
    }

    public function setApellidos(string $apellidos): static
    {
        $this->apellidos = $apellidos;

        return $this;
    }

    public function getAñoInscripcion(): ?\DateTimeInterface
    {
        return $this->añoInscripcion;
    }

    public function setAñoInscripcion(\DateTimeInterface $añoInscripcion): static
    {
        $this->añoInscripcion = $añoInscripcion;

        return $this;
    }

    public function getEstadoPagos(): ?string
    {
        return $this->estadoPagos;
    }

    public function setEstadoPagos(string $estadoPagos): static
    {
        $estadoPagos = strtolower($estadoPagos);
        if (!in_array($estadoPagos, ['debe', 'pagado'], true)) {
            throw new \InvalidArgumentException("El estado de pagos debe ser 'debe' o 'pagado'.");
        }

        $this->estadoPagos = $estadoPagos;

        return $this;
    }

    public function getCredito(): ?int
    {
        return $this->credito;
    }

    public function setCredito(int $credito): static
    {
        $this->credito = $credito;

        return $this;
    }

    public function getHijos(): ?Collection
    {
        return $this->hijos;
    }

    public function addHijo(Usuarios $hijo): static
    {
        if (!$this->hijos->contains($hijo)) {
            $this->hijos->add($hijo);
            $hijo->setTutorLegal($this);
        }

        return $this;
    }

    public function removeHijo(Usuarios $hijo): static
    {
        if ($this->hijos && $this->hijos->removeElement($hijo)) {
            if ($hijo->getTutorLegal() === $this) {
                $hijo->setTutorLegal(null);
            }
        }

        return $this;
    }
}
