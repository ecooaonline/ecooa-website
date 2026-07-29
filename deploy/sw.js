// Service worker de autodestruição.
//
// O site anterior registrava um service worker em /sw.js que segue instalado
// nos navegadores dos visitantes. Ele intercepta o site novo, serve respostas
// antigas em cache e impõe a política de segurança antiga, que bloqueia eval e
// derruba a sobrancelha e o rodapé. Este arquivo substitui aquele: limpa os
// caches, se desregistra e recarrega a página uma vez.

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    (async () => {
      const chaves = await caches.keys();
      await Promise.all(chaves.map((c) => caches.delete(c)));
      await self.registration.unregister();
      const janelas = await self.clients.matchAll({ type: 'window' });
      janelas.forEach((janela) => janela.navigate(janela.url));
    })()
  );
});

// Enquanto não se desregistra, não intercepta nada: tudo vai direto à rede.
self.addEventListener('fetch', () => {});
