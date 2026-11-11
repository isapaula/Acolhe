<?php

namespace App\Enums;

enum Especialidade: string
{
    case A = 'Ansiedade';
    case D = 'Depressão';
    case T = 'TDAH';
    case TR = 'Traumas gerais';
    case C = 'Padrões comportamentais';
    case O = 'Orientação';
}
