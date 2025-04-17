<?php

namespace App\Controller;

use App\Entity\Padres;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AuthController extends AbstractController
{
    #[Route('/auth/login', name: 'login', methods: ['POST'])]
    public function login(Request $request, EntityManagerInterface $entityManager): Response
    {
        // Get data from body
        $parameters = json_decode($request->getContent(), true);
        $email = $parameters['email'];
        $password = $parameters['contrasena'];

        // Hash password
        $password = md5($password);


        // Comprobar datos en tabla Usuarios
        $resultado = $entityManager->getRepository(Padres::class)->findOneBy(['email' => $email, 'contrasena' => $password]);
        if ($resultado != null) {
            return $this->json($resultado, Response::HTTP_OK, [], ['groups' => ['login']]);
        }

        return new Response('ERROR: DATOS INCORRECTOS', Response::HTTP_UNAUTHORIZED);
    }

}