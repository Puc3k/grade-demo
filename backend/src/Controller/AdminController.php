<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class AdminController extends AbstractController
{
    #[Route('/api/admin/create-user', name: 'create_user', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function createUser(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $hasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword($hasher->hashPassword($user, $data['password']));
        $user->setRoles($data['roles']);
        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['status' => 'User created'], 201);
    }
}
