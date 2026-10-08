# Pousada Santa Helena — site de demonstração

Site estático (HTML, CSS e JS puro), no mesmo padrão do `portfolio`. Pronto para GitHub Pages.

## Estrutura

```
index.html         início, sobre, acomodações, galeria, arredores, contato
css/style.css      paleta (extraída da logo), base, navegação, botões
css/sections.css   layout de cada seção
js/main.js         CONFIG (contato), menu mobile, animação de entrada, ano
img/logo.png       logo enviada pelo cliente
```

## Preencher os dados de contato (1 só lugar)

Abra `js/main.js` e edite o bloco `CONFIG` no topo. A página se preenche
sozinha (WhatsApp, telefone, e-mail, Instagram). Campo vazio = o item fica
oculto no site (nada de contorno tracejado ou texto falso); preencheu, ele aparece:

```js
var CONFIG = {
  whatsapp: '5511999998888',   // 55 + DDD + número, só dígitos
  telefone: '(11) 4035-0000',
  email:    'contato@pousadasantahelena.com.br',
  instagram:'pousadasantahelena',  // sem @
};
```

## Pendências

- Fotos: cada `<div class="ph">` deve virar `<img>` com as fotos oficiais.
- Dados de contato: preencher o `CONFIG` em `js/main.js` (acima).
- Confirmar: capacidade do quarto família, estacionamento (removidos do site até confirmar).

Ícones são SVG inline (sem emoji); logo em `img/logo.png`.

## Rodar localmente

```
.\preview.ps1            # sobe em 8082 desacoplado do shell e confirma HTTP 200
.\preview.ps1 -Stop      # encerra
node serve.mjs 8081 --selftest   # só valida: sobe, testa as páginas e sai
```

`preview.ps1` cria o processo via `Win32_Process.Create`, então ele não herda os
handles do shell. Por isso o comando retorna na hora, e não fica preso como
acontecia com `Start-Process`. `node serve.mjs 8081` em primeiro plano também funciona.

## Publicação

GitHub Pages, branch `main`, pasta `/` (raiz). Cada push na `main` republica o site.
