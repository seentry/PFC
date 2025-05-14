<?php

namespace App\Entity;

use App\Entity\Trajes;
use App\Repository\PadresRepository;
use App\Repository\TrajesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity(repositoryClass: PadresRepository::class)]
class Padres
{

    public function __toString(): string
    {
        return $this->nombre . ' ' . $this->apellidos;
    }

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['padres','login', 'trajes'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['padres'])]
    private ?string $nombre = null;

    #[ORM\Column(length: 255)]
    #[Groups(['padres'])]
    private ?string $apellidos = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['padres'])]
    private ?\DateTimeInterface $anoInscripcion = null;

    #[ORM\Column(length: 255)]
    #[Groups(['padres'])]
    private ?string $estadoPagos = null;

    #[ORM\Column]
    #[Groups(['padres'])]
    private ?int $credito = null;

    #[ORM\Column(length: 255)]
    #[Groups(['padres', 'login'])]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    #[Groups(['padres', 'login'])]
    private ?string $contrasena = null;
 
    #[ORM\OneToMany(mappedBy: 'duenoOriginal', targetEntity: Trajes::class)]
    #[Groups(['padres'])]
    private Collection $trajes;
    #[ORM\OneToMany(mappedBy: 'tutorLegal', targetEntity: Usuarios::class)]
    #[Groups(['padres'])]
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

    public function getAnoInscripcion(): ?\DateTimeInterface
    {
        return $this->anoInscripcion;
    }

    public function setAnoInscripcion(\DateTimeInterface $anoInscripcion): static
    {
        $this->anoInscripcion = $anoInscripcion;

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

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getContrasena(): ?string
    {
        return $this->contrasena;
    }

    public function setContrasena(string $contrasena): static
    {
        $this->contrasena = $contrasena;

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
