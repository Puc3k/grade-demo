<?php

namespace App\Controller;

use App\DTO\GradeDTO;
use App\DTO\GradeResponseDTO;
use App\DTO\GradeWithSubjectDTO;
use App\Entity\Grade;
use App\Entity\Subject;
use App\Repository\GradeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/grade')]
class GradeController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private ValidatorInterface $validator;

    public function __construct(EntityManagerInterface $entityManager, ValidatorInterface $validator)
    {
        $this->entityManager = $entityManager;
        $this->validator = $validator;
    }

    #[Route('', name: 'api_grade_index', methods: ['GET'])]
    #[IsGranted('ROLE_STUDENT')]
    public function index(GradeRepository $gradeRepository): JsonResponse
    {
        $user = $this->getUser();
        $grades = $gradeRepository->findBy(['user' => $user]);

        $gradeWithSubjects = array_map(fn($grade) => $this->createGradeWithSubjectDTO($grade), $grades);

        return $this->json($gradeWithSubjects, Response::HTTP_OK);
    }

    #[Route('', name: 'api_grade_new', methods: ['POST'])]
    #[IsGranted('ROLE_TEACHER')]
    public function new(Request $request): JsonResponse
    {
        $gradeDTO = $this->handleRequest($request);

        if ($errorResponse = $this->validateDTO($gradeDTO)) {
            return $errorResponse;
        }

        $subject = $this->getSubjectOrFail($gradeDTO->subjectId);
        $user = $this->getUser();

        $grade = new Grade();
        $grade->setValue($gradeDTO->value);
        $grade->setUser($user);
        $grade->setSubject($subject);

        $this->entityManager->persist($grade);
        $this->entityManager->flush();

        return $this->json($this->buildResponse($grade, $subject, $user), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_grade_show', methods: ['GET'])]
    #[IsGranted('ROLE_STUDENT')]
    public function show(Grade $grade): JsonResponse
    {
        if ($grade->getUser() !== $this->getUser()) {
            return new JsonResponse(['error' => 'Access denied'], Response::HTTP_FORBIDDEN);
        }

        $subject = $grade->getSubject();
        $responseDTO = new GradeResponseDTO(
            $grade->getId(),
            $grade->getValue(),
            $subject ? $subject->getId() : 0,
            $subject ? $subject->getName() : 'N/A',
            $this->getUser()->getId(),
            $this->getUser()->getEmail()
        );

        return $this->json($responseDTO, Response::HTTP_OK);
    }

    #[Route('/{id}', name: 'api_grade_edit', methods: ['PUT', 'PATCH'])]
    #[IsGranted('ROLE_TEACHER')]
    public function edit(Request $request, Grade $grade): JsonResponse
    {
        if ($grade->getUser() !== $this->getUser()) {
            return new JsonResponse(['error' => 'Access denied'], Response::HTTP_FORBIDDEN);
        }

        $gradeDTO = $this->handleRequest($request);

        if ($errorResponse = $this->validateDTO($gradeDTO)) {
            return $errorResponse;
        }

        if ($gradeDTO->subjectId !== null) {
            $subject = $this->getSubjectOrFail($gradeDTO->subjectId);
            $grade->setSubject($subject);
        }

        $grade->setValue($gradeDTO->value);
        $this->entityManager->flush();

        $user = $this->getUser();
        $responseDTO = new GradeResponseDTO(
            $grade->getId(),
            $grade->getValue(),
            $grade->getSubject() ? $grade->getSubject()->getId() : 0,
            $grade->getSubject() ? $grade->getSubject()->getName() : 'N/A',
            $user->getId(),
            $user->getEmail()
        );

        return $this->json($responseDTO, Response::HTTP_OK);
    }

    #[Route('/{id}', name: 'api_grade_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_TEACHER')]
    public function delete(Grade $grade): JsonResponse
    {
        if ($grade->getUser() !== $this->getUser()) {
            return new JsonResponse(['error' => 'Access denied'], Response::HTTP_FORBIDDEN);
        }

        $this->entityManager->remove($grade);
        $this->entityManager->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    private function handleRequest(Request $request): GradeDTO
    {
        $data = json_decode($request->getContent(), true);
        $gradeDTO = new GradeDTO();
        $gradeDTO->value = $data['value'] ?? null;
        $gradeDTO->subjectId = $data['subjectId'] ?? null;

        return $gradeDTO;
    }

    private function validateDTO(GradeDTO $gradeDTO): ?JsonResponse
    {
        $errors = $this->validator->validate($gradeDTO);
        if (count($errors) > 0) {
            return $this->handleValidationErrors($errors);
        }
        return null;
    }

    private function getSubjectOrFail(int $subjectId): Subject
    {
        $subject = $this->entityManager->getRepository(Subject::class)->find($subjectId);
        if (!$subject) {
            throw $this->createNotFoundException('Subject not found.');
        }
        return $subject;
    }

    private function buildResponse(Grade $grade, Subject $subject, $user): array
    {
        return [
            'id' => $grade->getId(),
            'value' => $grade->getValue(),
            'subjectId' => $subject->getId(),
            'subjectName' => $subject->getName(),
            'user' => [
                'id' => $user->getId(),
                'username' => $user->getEmail(),
            ],
        ];
    }

    private function handleValidationErrors($errors): JsonResponse
    {
        $errorMessages = array_map(fn($error) => $error->getMessage(), iterator_to_array($errors));
        return new JsonResponse(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
    }

    private function createGradeWithSubjectDTO(Grade $grade): GradeWithSubjectDTO
    {
        $gradeDTO = new GradeWithSubjectDTO();
        $gradeDTO->id = $grade->getId();
        $gradeDTO->value = $grade->getValue();
        $gradeDTO->subjectName = $grade->getSubject()?->getName();
        $gradeDTO->subjectId = $grade->getSubject()?->getId();

        return $gradeDTO;
    }
}
