<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class GradeDTO
{
    public ?int $id = null;

    #[Assert\NotNull(message: "Value cannot be null.")]
    #[Assert\Range(
        notInRangeMessage: "Grade must be between {{ min }} and {{ max }}.",
        min: 1,
        max: 6
    )]
    public int $value;

    #[Assert\NotNull(message: "Subject ID cannot be null.")]
    public ?int $subjectId = null;
}


