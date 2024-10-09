<?php

namespace App\DTO;

class GradeResponseDTO
{
    public int $id;
    public int $value;
    public int $subjectId;
    public string $subjectName;
    public int $userId;
    public string $username;

    public function __construct(int $id, int $value, int $subjectId, string $subjectName, int $userId, string $username)
    {
        $this->id = $id;
        $this->value = $value;
        $this->subjectId = $subjectId;
        $this->subjectName = $subjectName;
        $this->userId = $userId;
        $this->username = $username;
    }
}
