<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/assets/css/materialize.css">
    <title>Formulário Paciente</title>
</head>
<body>
    
    <h2>Cadastro do Paciente</h2>
    <section>
        <div>
            <form action="/auth/paciente" method="post">
                <input type="text" name="nome" id="nome" placeholder="Digite o nome" required>
                <br><br>
                <input type="email" name="email" id="email" placeholder="Digite o e-mail" required>
                <br><br>
                <input type="password" name="senha" id="senha" required>
                <br><br>
                <input type="date" name="data_nasc" id="data_nasc" placeholder="Data Nascimento" required>
                <br><br>
                <input type="text" name="telefone" id="telefone" maxlength="11" placeholder="(00) 00000-0000" required>
                <br><br>
                <button type="submit">Enviar</button>
                
            </form>
        </div>
    </section>
    
</body>
</html>