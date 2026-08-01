# Cabuloso’s — site estático para Vercel

Este pacote contém o site completo em **HTML, CSS e JavaScript puros**. Ele não usa React, npm ou etapa de compilação.

## Arquivos principais

- `index.html` — conteúdo e estrutura do site
- `styles.css` — identidade visual e responsividade
- `script.js` — cardápio interativo, pedido, menu mobile e animações GSAP
- `assets/` — imagens, logos, fontes, vetores e bibliotecas locais
- `vercel.json` — configuração do deploy estático

## Testar no VS Code

Você pode abrir `index.html` diretamente no navegador. Para uma prévia mais fiel, instale a extensão **Live Server** no VS Code, clique com o botão direito em `index.html` e escolha **Open with Live Server**.

Não é necessário executar `npm install` ou `npm run dev`.

## Publicar pela Vercel sem usar terminal

1. Descompacte este ZIP.
2. Crie um repositório novo no GitHub e envie **todo o conteúdo desta pasta**, mantendo `index.html` na raiz.
3. Entre na Vercel e escolha **Add New → Project**.
4. Importe o repositório.
5. Em **Framework Preset**, escolha **Other**.
6. Deixe **Build Command** vazio.
7. Deixe **Output Directory** vazio.
8. Clique em **Deploy**.

## Publicar arrastando a pasta

No painel da Vercel, você também pode usar a opção de deploy de projeto estático e enviar esta pasta. O arquivo `index.html` já está preparado como entrada do site.

## Usar domínio próprio

Depois do deploy, acesse **Project Settings → Domains**, adicione seu domínio e siga os registros DNS mostrados pela Vercel. Assim o endereço não terá nenhuma referência ao ChatGPT.

## Personalizações rápidas

- Produtos e textos: edite `index.html`.
- Cores, tamanhos e layout: edite `styles.css`.
- Preços usados no montador e link do WhatsApp: edite o início de `script.js`.
- Imagens: substitua os arquivos dentro de `assets/images/` e `assets/brand/`, preservando os nomes ou atualizando os caminhos no HTML.

O pedido montado é copiado automaticamente e o WhatsApp é aberto no link configurado. O cliente só precisa colar a mensagem para continuar.
