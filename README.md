# E-Coleta

projeto realizado tendo como base o do evento Next Level Week Booster.

### Executando:

- Backend:
```
$ cd backend && yarn dev
```

- Frontend:
```
$ cd frontend && yarn start
```

- Mobile:  
```
cd mobile && yarn start
```

dependendo de como será utilizado o expo, é necessário utilizar o ngrock para o servidor funcionar, desta forma execute:

```
$ ngrok http 3333
```

Copie o link gerado para o [baseUrl](./mobile/src/services/api.ts).