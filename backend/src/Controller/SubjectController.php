<?php

namespace App\Controller;

use App\DTO\SubjectDTO;
use App\Repository\SubjectRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/subject')]
#[IsGranted('ROLE_STUDENT')]
class SubjectController extends AbstractController
{
    #[Route('', name: 'api_subject_index', methods: ['GET'])]
    public function index(SubjectRepository $subjectRepository): JsonResponse
    {
        $subjects = $subjectRepository->findAll();

        $subjectDTOs = array_map(fn($subject) => new SubjectDTO($subject->getId(), $subject->getName()), $subjects);

        return $this->json($subjectDTOs, Response::HTTP_OK);
    }
}

