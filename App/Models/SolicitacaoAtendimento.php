<?php

namespace App\Models;

use App\Models\Paciente;
use App\Enums\StatusSolicitacao;

class SolicitacaoAtendimento
{
    private int $idSolicitacao;
    private Paciente $paciente;
    private StatusSolicitacao  $status;
    private $dataCriacao;
    private $especialidade;
    private $observacaoInicial;


    public function getStatus()
    {
        return $this->status;
    }

    public function getPaciente()
    {
        return $this->paciente;
    }

    public function getIdSolicitacao()
    {
        return $this->idSolicitacao;
    }


    public function getDataCriacao()
    {
        return $this->dataCriacao;
    }

    public function getObservacaoInicial()
    {
        return $this->observacaoInicial;
    }


    public function setObservacaoInicial($observacaoInicial)
    {
        $this->observacaoInicial = $observacaoInicial;

        return $this;
    }
}
