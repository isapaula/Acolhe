<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro Aluno</title>
</head>
<body>

    <h2>Cadastro do Aluno</h2>
    <form action="/auth/aluno" method="post">
        
        <input type="text" name="nome" id="nome" placeholder="Digite o nome" required>
        <br><br>
        <input type="email" name="email" id="email" placeholder="Digite o e-mail" required>
        <br><br>
        <label for="">Digite a senha:</label><br>
        <input type="password" name="senha" id="senha" placeholder="********" required>
        <br><br>
        <input type="number" name="matricula" id="matricula" maxlength="5" placeholder="digite sua matricula" required>
        <br><br>
        <input type="number" name="semestre" id="semestre" maxlength="1" placeholder="Qual semestre?" required>
        <br><br>
        <button type="submit">Enviar</button>
    </form>
</body>
</html>