'use strict'

const CURRENT_USER_ID = 2   // ID do usuário logado
let usuariosGlobais = []
const commentsStore = {}    // armazena comentários por postId


window.addEventListener('DOMContentLoaded', () => {
  carregarPublicacoes()

  const savedProfile = JSON.parse(localStorage.getItem('clubefy_profile'))
  if (savedProfile && savedProfile.pic) {
    document.getElementById('userAvatarImg').src = savedProfile.pic
  }
  
})


async function carregarPublicacoes() {
  try {
    const [resPosts, resUsers] = await Promise.all([
      fetch('https://back-spider.vercel.app/publicacoes/listarPublicacoes'),
      fetch('https://back-spider.vercel.app/user/listarUsers')
    ])
    const publicacoes = await resPosts.json()
    const usuarios    = await resUsers.json()

    usuariosGlobais = usuarios
    exibirPublicacoes(publicacoes, usuarios)
  } catch (erro) {
    console.error('Erro ao carregar dados:', erro)
  }
}

function exibirPublicacoes(publicacoes, usuarios) {
  const feed = document.querySelector('#feed')
  feed.innerHTML = ''
  publicacoes.forEach(pub => {
    inserirPostNoFeed(pub, usuarios, false)
  })
}

function inserirPostNoFeed(publicacao, usuarios, prepend) {
  const usuario = usuarios.find(u => u.id === Number(publicacao.idUsuario)) || {}
  const feed    = document.querySelector('#feed')

  // monta o HTML base do post (sem o delete-btn)
  const post = document.createElement('div')
  post.classList.add('post')
  post.innerHTML = `
    <div class="post-header">
      <div class="avatar">
        <img src="${usuario.imagemPerfil}" alt="Avatar"
             style="width:100%;height:100%;border-radius:9999px;">
      </div>
      <div class="post-user-info">
        <p class="post-author">${usuario.nome||'Usuário'}</p>
        <p class="post-time">${publicacao.local||''}</p>
      </div>
    </div>
    <div class="post-image">
      <img src="${publicacao.imagem}" alt="Imagem da publicação">
    </div>
    <div class="post-content">
      <p>${publicacao.descricao}</p>
    </div>
    <div class="interaction-buttons">
      <button class="interaction-btn heart" data-id="${publicacao.id}" data-curtido="false">
        <img src="../assets/img/heart_false.png" alt="Curtir" width="20"> Curtir
      </button>
      <button class="interaction-btn comment-toggle" data-id="${publicacao.id}">
        <img src="../assets/img/chat.png" alt="Comentar" width="20"> Comentar
      </button>
    </div>
    <div class="comments">
      <div class="comment-list"></div>
      <div class="add-comment">
        <input class="comment-input" placeholder="Adicione um comentário..." />
        <button class="send-comment">Enviar</button>
      </div>
    </div>
  `

  // se for do usuário atual, adiciona o botão Deletar
  if (Number(publicacao.idUsuario) === CURRENT_USER_ID) {
    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'interaction-btn delete-btn'
    deleteBtn.innerHTML = `<i class="fas fa-trash"></i> Deletar`
    deleteBtn.addEventListener('click', () => {
      if (confirm('Deseja realmente deletar esta publicação?'))
        handleDelete(publicacao.id, post)
    })
    post.querySelector('.interaction-buttons').appendChild(deleteBtn)
  }

  // Curtir
  post.querySelector('.heart').addEventListener('click', e => {
    const btn = e.currentTarget
    const cur = btn.getAttribute('data-curtido') === 'true'
    btn.querySelector('img').src = cur
      ? '../assets/img/heart_false.png'
      : '../assets/img/heart_true.png'
    btn.setAttribute('data-curtido', !cur)
  })

  // Toggle comentários
  const toggleBtn   = post.querySelector('.comment-toggle')
  const commentsDiv = post.querySelector('.comments')
  toggleBtn.addEventListener('click', () => {
    renderComments(publicacao.id, commentsDiv.querySelector('.comment-list'))
    commentsDiv.style.display =
      commentsDiv.style.display === 'none' ? 'block' : 'none'
  })

  // Enviar comentário
  post.querySelector('.send-comment').addEventListener('click', () => {
    const inputEl = post.querySelector('.comment-input')
    const text    = inputEl.value.trim()
    if (!text) return
    if (!commentsStore[publicacao.id]) commentsStore[publicacao.id] = []
    const commentObj = { author:'Você', text }
    commentsStore[publicacao.id].push(commentObj)
    appendCommentToList(commentObj, commentsDiv.querySelector('.comment-list'))
    inputEl.value = ''
  })

  if (prepend) feed.prepend(post)
            else feed.appendChild(post)
}

function renderComments(postId, listEl) {
  listEl.innerHTML = ''
  const coms = commentsStore[postId] || []
  coms.forEach(c => appendCommentToList(c, listEl))
}

function appendCommentToList(commentObj, listEl) {
  const div = document.createElement('div')
  div.classList.add('comment')
  div.innerHTML = `
    <div class="comment-avatar"></div>
    <div class="comment-content">
      <p class="comment-author">${commentObj.author}</p>
      <p class="comment-text">${commentObj.text}</p>
    </div>
  `
  listEl.appendChild(div)
}

async function handleDelete(postId, postElement) {
  try {
    const resp = await fetch(
      `https://back-spider.vercel.app/publicacoes/deletarPublicacao/${postId}`,
      { method: 'DELETE' }
    )
    if (!resp.ok) throw new Error(`Status ${resp.status}`)
    postElement.remove()
  } catch (e) {
    console.error('Erro ao deletar:', e)
    alert('Não foi possível deletar. Tente novamente.')
  }
}

async function handlePost() {
  const descricao   = document.getElementById('newPostText').value.trim()
  const imagemUrl   = document.getElementById('newPostImageUrl').value.trim()
  const local       = document.getElementById('newPostLocation').value.trim()

  if (!descricao && !imagemUrl)
    return alert('Escreva algo ou cole um link de imagem antes de publicar.')
  if (!local)
    return alert('Informe o local da publicação.')

  const payload = {
    descricao,
    dataPublicacao: new Date().toLocaleDateString('pt-BR'),
    imagem: imagemUrl,
    local,
    idUsuario: CURRENT_USER_ID
  }

  try {
    const resp = await fetch(
      'https://back-spider.vercel.app/publicacoes/cadastrarPublicacao',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    )
    if (!resp.ok) throw new Error(`Status ${resp.status}`)
    const novaPub = await resp.json()
    inserirPostNoFeed(novaPub, usuariosGlobais, true)
    document.getElementById('newPostText').value     = ''
    document.getElementById('newPostImageUrl').value = ''
    document.getElementById('newPostLocation').value = ''
  } catch (e) {
    console.error('Erro ao publicar:', e)
    alert('Não foi possível publicar. Tente novamente.')
  }
}

