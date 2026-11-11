<?php

namespace App\Enums;

enum StatusSolicitacao: string
{
    case AGUARDANDO_TRIAGEM = 'AGUARDANDO_TRIAGEM';
    case ASSUMIDA = 'ASSUMIDA';
    case APROVADA = 'APROVADA';
    case RECUSADA = 'RECUSADA';
    case EM_ATENDIMENTO = 'EM_ATENDIMENTO';
    case FINALIZADA = 'FINALIZADA';
    case CANCELADA = 'CANCELADA';

}
