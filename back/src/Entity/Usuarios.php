<?php

namespace App\Entity;

use App\Repository\UsuariosRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\MaxDepth;



#[ORM\Entity(repositoryClass: UsuariosRepository::class)]
class Usuarios
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['usuarios', 'login'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['usuarios'])]
    private ?string $nombre = null;

    #[ORM\Column(length: 255)]
    #[Groups(['usuarios'])]
    private ?string $apellidos = null;

    #[ORM\Column]
    #[Groups(['usuarios'])]
    private ?int $edad = null;

    #[ORM\ManyToOne(targetEntity: Padres::class, inversedBy: 'hijos')]
    #[Groups(['usuarios'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Padres $tutorLegal = null;


    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['usuarios'])]
    private ?\DateTimeInterface $anoInscripcion = null;

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

    public function getEdad(): ?int
    {
        return $this->edad;
    }

    public function setEdad(int $edad): static
    {
        $this->edad = $edad;

        return $this;
    }

    public function getTutorLegal(): ?Padres
    {
        return $this->tutorLegal;
    }

    public function setTutorLegal(Padres $tutorLegal): static
    {
        $this->tutorLegal = $tutorLegal;

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
}
