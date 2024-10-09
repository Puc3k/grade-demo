<?php

namespace App\DTO;

class GradeWithSubjectDTO
{
    public int $id;
    public int $value;
    public string $subjectName;
    public ?int $subjectId;

}