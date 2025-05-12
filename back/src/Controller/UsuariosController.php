<?php
namespace App\Controller;

use App\Entity\Usuarios;
use App\Repository\UsuariosRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UsuariosController extends AbstractController
{
    #[Route('/api/usuarios', name: 'usuarios_list', methods: ['GET'])]
    public function list(UsuariosRepository $repo): JsonResponse
    {
        $users = $repo->findAll();
        return $this->json($users, Response::HTTP_OK, [], ['groups' => ['usuarios']]);
    }

    #[Route('/api/usuarios/{id}', name: 'usuario_detail', methods: ['GET'])]
    public function detail(Usuarios $usuario): JsonResponse
    {
        return $this->json($usuario, Response::HTTP_OK, [], ['groups' => ['usuarios']]);
    }

    #[Route('/api/usuarios', name: 'usuario_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = new Usuarios();
        $user->setNombre($data['nombre']);
        $user->setApellidos($data['apellidos']);
        $user->setEdad($data['edad']);
        $user->setAnoInscripcion($data['anoInscripcion']);
        $user->setTutorLegal($data['tutorLegal']);

        $em->persist($user);
        $em->flush();

        return $this->json($user, Response::HTTP_CREATED, [], ['groups' => ['usuarios']]);
    }

    #[Route('/api/usuarios/{id}', name: 'usuario_delete', methods: ['DELETE'])]
    public function delete(Usuarios $usuario, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($usuario);
        $em->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}
