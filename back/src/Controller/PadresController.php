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
    #[Route('/api/padres', name: 'padres_list', methods: ['GET'])]
    public function list(PadresRepository $repo): JsonResponse
    {
        $padres = $repo->findAll();
        return $this->json($padres, Response::HTTP_OK, [], ['groups' => ['padres']]);
    }

    #[Route('/api/padres/{id}', name: 'padre_detail', methods: ['GET'])]
    public function detail(Padres $padre): JsonResponse
    {
        return $this->json($padre, Response::HTTP_OK, [], ['groups' => ['padres']]);
    }

    #[Route('/api/padres', name: 'padre_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $padre = new Padres();
        $padre->setNombre($data['nombre']);
        $padre->setApellidos($data['apellidos']);
        $padre->setAnoInscripcion(new \DateTime());
        $padre->setEstadoPagos($data['estadoPagos'] ?? 'pagado');
        $padre->setCredito($data['credito'] ?? 0);
        $padre->setEmail($data['email']);
        $padre->setContrasena(md5($data['contrasena']));

        $em->persist($padre);
        $em->flush();

        return $this->json($padre, Response::HTTP_CREATED, [], ['groups' => ['padres']]);
    }

    #[Route('/api/padres/{id}', name: 'padre_delete', methods: ['DELETE'])]
    public function delete(Padres $padre, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($padre);
        $em->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}
