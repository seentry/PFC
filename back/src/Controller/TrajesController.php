<?php
// src/Controller/TrajesController.php
namespace App\Controller;

use App\Entity\Trajes;
use App\Repository\TrajesRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class TrajesController extends AbstractController
{
    #[Route('/api/trajes', name: 'trajes_list', methods: ['GET'])]
    public function list(TrajesRepository $repo): JsonResponse
    {
        $trajes = $repo->findAll();
        return $this->json($trajes, Response::HTTP_OK, [], ['groups' => ['trajes']]);
    }

    #[Route('/api/trajes/{id}', name: 'traje_detail', methods: ['GET'])]
    public function detail(Trajes $traje): JsonResponse
    {
        return $this->json($traje, Response::HTTP_OK, [], ['groups' => ['trajes']]);
    }

    #[Route('/api/trajes', name: 'traje_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $traje = new Trajes();
        $traje->setTipo($data['tipo']);
        $traje->setTalla((int)$data['talla']);
        $traje->setEstado($data['estado']);

        if (isset($data['duenoOriginal'])) {
            $padre = $em->getRepository(\App\Entity\Padres::class)
                ->find((int)basename($data['duenoOriginal']));
            $traje->setDuenoOriginal($padre);
        }
        $traje->setFechaIncorporacion(new \DateTime($data['fechaIncorporacion']));
        $traje->setDisponible($data['disponible'] ?? true);

        $em->persist($traje);
        $em->flush();

        return $this->json($traje, Response::HTTP_CREATED, [], ['groups' => ['trajes']]);
    }

    #[Route('/api/trajes/{id}', name: 'traje_delete', methods: ['DELETE'])]
    public function delete(Trajes $traje, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($traje);
        $em->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}
