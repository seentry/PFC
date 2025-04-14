<?php

namespace App\Controller;

use App\Entity\Trajes;
use App\Form\TrajesType;
use App\Repository\TrajesRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/trajes')]
final class TrajesController extends AbstractController
{
    #[Route('/api/trajes', name: 'api_trajes_index', methods: ['GET'])]
    public function listTrajes(TrajesRepository $repo): Response
    {
        $trajes = $repo->findAll();
        return $this->json($trajes);
    }


    #[Route('/api/new', name: 'app_trajes_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $traje = new Trajes();
        $form = $this->createForm(TrajesType::class, $traje);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($traje);
            $entityManager->flush();

            return $this->redirectToRoute('app_trajes_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('trajes/new.html.twig', [
            'traje' => $traje,
            'form' => $form,
        ]);
    }

    #[Route('/api/{id}', name: 'app_trajes_show', methods: ['GET'])]
    public function show(Trajes $traje): Response
    {
        return $this->render('trajes/show.html.twig', [
            'traje' => $traje,
        ]);
    }

    #[Route('/api/{id}/edit', name: 'app_trajes_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Trajes $traje, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(TrajesType::class, $traje);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_trajes_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('trajes/edit.html.twig', [
            'traje' => $traje,
            'form' => $form,
        ]);
    }

    #[Route('/api/{id}', name: 'app_trajes_delete', methods: ['POST'])]
    public function delete(Request $request, Trajes $traje, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$traje->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($traje);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_trajes_index', [], Response::HTTP_SEE_OTHER);
    }
}