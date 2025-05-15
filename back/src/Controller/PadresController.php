<?php

namespace App\Controller;

use App\Entity\Padres;
use App\Repository\PadresRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class PadresController extends AbstractController
{

    #[Route('/api/padres', name: 'padres', methods: 'GET', format: 'json')]
        public function getAllPadres(EntityManagerInterface $entityManager): JsonResponse
    {
        $padres = $entityManager->getRepository(Padres::class)->findAll();

        return $this->json($padres, Response::HTTP_OK, [], ['groups' => ['padres']]);
    }

    #[Route('/api/padres/{id}', name: 'padre_detail', methods: 'GET', format: 'json')]
    public function getPadre(Padres $padre): JsonResponse
    {
        return $this->json($padre, Response::HTTP_OK, [], ['groups' => ['padres']]);
    }

    #[Route('/api/padres', name: 'padre_create', methods: 'POST', format: 'json')]
    public function createPadre(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $padre = new Padres();

        $padre->setNombre($data['nombre']);
        $padre->setApellidos($data['apellidos']);
        $padre->setAnoInscripcion(new \DateTime($data['anoInscripcion']));
        $padre->setEstadoPagos($data['estadoPagos'] ?? 'pagado');
        $padre->setCredito($data['credito'] ?? 0);
        $padre->setEmail($data['email']);
        $padre->setContrasena(md5($data['contrasena']));


        $entityManager->persist($padre);
        $entityManager->flush();

        return $this->json($padre, Response::HTTP_CREATED, [], ['groups' => ['padres']]);
    }

    #[Route('/api/padres/{id}', name: 'padre_delete', methods: ['DELETE'], format: 'json')]
    public function deletePadre(Padres $padre, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($padre);
        $entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }


    #[Route('/api/padres/{id}', name: 'padre_update', methods: ['PATCH'])]
    public function update(
        int $id,
        Request $request,
        EntityManagerInterface $em,
        PadresRepository $padresRepo
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $padre = $padresRepo->find($id);
        if (!$padre) {
            return $this->json(['error' => 'Padre no encontrado'], Response::HTTP_NOT_FOUND);
        }

        if (array_key_exists('credito', $data)) {
            $padre->setCredito($data['credito']);
        }

        $em->persist($padre);
        $em->flush();

        return $this->json($padre, Response::HTTP_OK, [], ['groups' => ['padres']]);
    }
}
