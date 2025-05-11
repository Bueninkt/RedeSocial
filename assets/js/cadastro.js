'use strict'

const cadastroSection = document.querySelector('.cadastro-section');

// Cria o título
const title = document.createElement('h2');
title.textContent = 'Sign Up!';
cadastroSection.appendChild(title);

// Cria o parágrafo de descrição
const description = document.createElement('p');
description.textContent = 'Conecte-se, compartilhe e descubra o que está acontecendo no setor com uma conta.';
cadastroSection.appendChild(description);

// Cria o formulário
const form = document.createElement('form');

// Cria campos do formulário

// Campo Email
const emailGroup = document.createElement('div');
emailGroup.classList.add('input-group');
const emailInput = document.createElement('input');
emailInput.type = 'email';
emailInput.id = 'email';
emailInput.placeholder = 'E-mail';
const emailLabel = document.createElement('label');
emailLabel.setAttribute('for', 'email');
emailLabel.textContent = 'E-mail';
emailGroup.appendChild(emailInput);
emailGroup.appendChild(emailLabel);
form.appendChild(emailGroup);

// Campo Nome
const nomeGroup = document.createElement('div');
nomeGroup.classList.add('input-group');
const nomeInput = document.createElement('input');
nomeInput.type = 'text';
nomeInput.id = 'nome';
nomeInput.placeholder = 'Nome Completo';
const nomeLabel = document.createElement('label');
nomeLabel.setAttribute('for', 'nome');
nomeLabel.textContent = 'Nome Completo';
nomeGroup.appendChild(nomeInput);
nomeGroup.appendChild(nomeLabel);
form.appendChild(nomeGroup);

// Campo Senha
const senhaGroup = document.createElement('div');
senhaGroup.classList.add('input-group');
const senhaInput = document.createElement('input');
senhaInput.type = 'password';
senhaInput.id = 'senha';
senhaInput.placeholder = 'Senha';
const senhaLabel = document.createElement('label');
senhaLabel.setAttribute('for', 'senha');
senhaLabel.textContent = 'Senha';
senhaGroup.appendChild(senhaInput);
senhaGroup.appendChild(senhaLabel);
form.appendChild(senhaGroup);

// Campo Senha de Recuperação
const senhaRecuperacaoGroup = document.createElement('div');
senhaRecuperacaoGroup.classList.add('input-group');
const senhaRecuperacaoInput = document.createElement('input');
senhaRecuperacaoInput.type = 'password';
senhaRecuperacaoInput.id = 'senhaRecuperacao';
senhaRecuperacaoInput.placeholder = 'Senha de Recuperação';
const senhaRecuperacaoLabel = document.createElement('label');
senhaRecuperacaoLabel.setAttribute('for', 'senhaRecuperacao');
senhaRecuperacaoLabel.textContent = 'Senha de Recuperação';
senhaRecuperacaoGroup.appendChild(senhaRecuperacaoInput);
senhaRecuperacaoGroup.appendChild(senhaRecuperacaoLabel);
form.appendChild(senhaRecuperacaoGroup);

// Cria botão de submit
const submitButton = document.createElement('button');
submitButton.type = 'submit';
submitButton.textContent = 'Sign Up';
form.appendChild(submitButton);

// Adiciona o formulário à seção
cadastroSection.appendChild(form);

// Cria elemento para exibir mensagens de erro
const errorMessage = document.createElement('p');
errorMessage.style.color = 'red';
errorMessage.style.display = 'none';
cadastroSection.appendChild(errorMessage);

// Cria o link "Já tem um login? Faça login"
const loginLink = document.createElement('p');
loginLink.innerHTML = 'Já tem um login? <a href="../index.html">Faça login</a>';
cadastroSection.appendChild(loginLink);

// Evento de submit do formulário
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();
    const nome = nomeInput.value.trim();
    const premium = "0";
    const imagemPerfil = "https://static.vecteezy.com/ti/vetor-gratis/p1/26434417-padrao-avatar-perfil-icone-do-social-meios-de-comunicacao-do-utilizador-foto-vetor.jpg";
    const senhaRecuperacao = "Gato12";

    if (!email || !senha || !nome || !senhaRecuperacao) {
        errorMessage.textContent = 'Preencha todos os campos!';
        errorMessage.style.display = 'block';
        return;
    }

    try {
        const response = await fetch('https://back-spider.vercel.app/user/cadastrarUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha, nome, premium, imagemPerfil, senhaRecuperacao })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao realizar cadastro');
        }

        // Armazena o token e os dados do usuário no localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); // Aqui você salva os dados do usuário

        // Redireciona para a tela de login
        window.location.href = '../index.html';
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    }
});
