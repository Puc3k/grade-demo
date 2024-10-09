<?php

namespace App\DataFixtures;

use App\Entity\Grade;
use App\Entity\Subject;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(private readonly UserPasswordHasherInterface $passwordHasher)
    {
    }

    public function load(ObjectManager $manager): void
    {
        $admin = new User();
        $admin->setEmail('admin@example.com');
        $admin->setRoles(['ROLE_ADMIN']);
        $hashedPassword = $this->passwordHasher->hashPassword($admin, 'admin');
        $admin->setPassword($hashedPassword);
        $manager->persist($admin);

        $teacher = new User();
        $teacher->setEmail('teacher@example.com');
        $teacher->setRoles(['ROLE_TEACHER', 'ROLE_STUDENT']);
        $hashedPassword = $this->passwordHasher->hashPassword($teacher, 'teacher');
        $teacher->setPassword($hashedPassword);
        $manager->persist($teacher);

        $student = new User();
        $student->setEmail('student@example.com');
        $student->setRoles(['ROLE_STUDENT']);
        $hashedPassword = $this->passwordHasher->hashPassword($student, 'student');
        $student->setPassword($hashedPassword);
        $manager->persist($student);

        $subjects = ['Matematyka', 'Fizyka', 'Chemia', 'Język polski', 'Język angielski', 'W-f'];

        $subjectEntities = [];
        foreach ($subjects as $subjectName) {
            $subject = new Subject();
            $subject->setName($subjectName);
            $manager->persist($subject);
            $subjectEntities[] = $subject;
        }

        $this->addRandomGrades($manager, $student, $subjectEntities, 10);
        $this->addRandomGrades($manager, $teacher, $subjectEntities, 15);
        $this->addRandomGrades($manager, $teacher, $subjectEntities, 5);

        $manager->flush();
    }

    private function addRandomGrades(ObjectManager $manager, User $user, array $subjects, int $count): void
    {
        for ($i = 0; $i < $count; $i++) {
            $grade = new Grade();
            $grade->setValue(rand(1, 6));
            $grade->setUser($user);
            $grade->setSubject($subjects[array_rand($subjects)]);
            $manager->persist($grade);
        }
    }
}
