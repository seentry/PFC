<?php

namespace App\Controller;

use App\Entity\Padres;
use App\Form\PadresType;
use App\Repository\PadresRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/padres')]
final class PadresController extends AbstractController
{
    #[Route(name: 'app_padres_index', methods: ['GET'])]
    public function index(PadresRepository $padresRepository): Response
    {
        return $this->render('padres/index.html.twig', [
            'padres' => $padresRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_padres_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $padre = new Padres();
        $form = $this->createForm(PadresType::class, $padre);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($padre);
            $entityManager->flush();

            return $this->redirectToRoute('app_padres_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('padres/new.html.twig', [
            'padre' => $padre,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_padres_show', methods: ['GET'])]
    public function show(Padres $padre): Response
    {
        return $this->render('padres/show.html.twig', [
            'padre' => $padre,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_padres_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Padres $padre, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(PadresType::class, $padre);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_padres_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('padres/edit.html.twig', [
            'padre' => $padre,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_padres_delete', methods: ['POST'])]
    public function delete(Request $request, Padres $padre, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$padre->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($padre);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_padres_index', [], Response::HTTP_SEE_OTHER);
    }
}