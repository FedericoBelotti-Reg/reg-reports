
# /REG/Reports
Applicazione per la registrazione delle attività giornaliere legate ai ticket Regesta.
## Getting Started

1. Installare le dipendenze tramite il comando `npm install`.
2. Creare un file `.env` con il seguente contenuto per permettere all'applicazione di eseguire le chiamate al servizio OData dei rapportini durante lo sviluppo:
	```
	cds.requires.API_TICKETS.credentials.url=<URL SERVIZIO RAPPORTINI>
	cds.requires.API_TICKETS.credentials.authentication="NoAuthentication"
	```
3. Avviare l'applicazione tramite il comando `cds watch`.

L'applicazione sarà raggiungibile all'URL http://localhost:4004/ se la porta non è già impegnata. 
### GraphQL
L'applicazione espone di default un servizio OData, ma è possibile abilitare anche l'esposizione del servizio tramite **GraphQL**[^1] attraverso l'npm package **@cap-js/graphql**[^2], già presente tra le dipendenze dell'app.
Sarà sufficiente annotare il servizio TicketsService tramite l'annotation `@graphql`:
```cds
using {regesta.cap.reports  as  model} from  '../db/data-model';

@graphql
service  TicketsService {
	entity  Tickets  as  projection  on  model.Tickets;
	entity  Reports  as  projection  on  model.Reports;
	entity  Children as  projection  on  model.Children;
}
```
Per raggiungere il servizio esposto, bisognerà navigare all'URL http://localhost:4004/graphql. Non verrà servita la classica pagina di default con i servizi disponibili, bensì **GraphiQL**, un client per il test delle query in GraphQL.
[^1]: *Info su GraphQL: https://graphql.org/.*
[^2]: *Info su @cap-js/graphql: https://github.com/cap-js/graphql.*