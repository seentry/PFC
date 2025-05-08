<?php
// src/Controller/AuthController.php
namespace App\Controller;

use App\Entity\Padres;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class AuthController extends AbstractController
{
    #[Route('/auth/login', name: 'login', methods: ['POST'])]
    public function login(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        $email      = $data['email'] ?? '';
        $plainPass  = $data['contrasena'] ?? '';
        $hashedPass = md5($plainPass);

        $padre = $em
            ->getRepository(Padres::class)
            ->findOneBy(['email' => $email, 'contrasena' => $hashedPass]);

        if (!$padre) {
            return new JsonResponse(
                ['error' => 'DATOS INCORRECTOS'],
                JsonResponse::HTTP_UNAUTHORIZED
            );
        }

        // Only expose the fields you want in the response:
        return new JsonResponse([
            'id'        => $padre->getId(),
            'nombre'    => $padre->getNombre(),
            'apellidos' => $padre->getApellidos(),
            'email'     => $padre->getEmail(),
            // etc...
        ], JsonResponse::HTTP_OK);
    }
}
