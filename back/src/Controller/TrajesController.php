<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class TrajesController extends AbstractController
{
    #[Route('/trajes', name: 'app_trajes')]
    public function index(): Response
    {
        return $this->render('trajes/index.html.twig', [
            'controller_name' => 'TrajesController',
        ]);
    }
}
