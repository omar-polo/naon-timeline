# Naon Timeline

> La grande storia di Pordenone

Monorepo gestito con pnpm workspaces e Turborepo. Al momento contiene
una sola app:

* `apps/timeline` (`@naon-timeline/app`): il timeline interattivo.

## Prerequisiti

* Node.js
* pnpm


## Istruzioni per la build

```sh
$ pnpm install
$ pnpm build
```


## Sviluppo

```sh
$ pnpm install
$ pnpm dev
```


## Stack tecnico

* pnpm + turborepo: gestione del monorepo
* vite: per la build e il server di sviluppo
* typescript
* leaflet: mappa
* React: componenti dell'UI
* Tailwind: stile


## Note

Durante lo sviluppo la maggior parte dei cambiamenti si applicano
automaticamente alla pagina senza bisogno di ricaricarla, tranne per
alcuni parametri di leaflet, che richiede di ricaricare manualmente
la pagina in modo che si applichino.
